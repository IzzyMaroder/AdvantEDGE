/*
 * Copyright (c) 2022  The AdvantEDGE Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package main

import (
	"fmt"
	"net"
	"time"

	log "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-logger"

	"golang.org/x/net/icmp"
	"golang.org/x/net/ipv4"
	"golang.org/x/net/ipv6"
)

// receiver listens on the raw socket and correlates ICMP Echo Replys with
// currently running requests.
func (pinger *Pinger) receiver(proto int, conn *icmp.PacketConn) {
	rb := make([]byte, 1500)

	// read incoming packets
	for {
		if n, source, err := conn.ReadFrom(rb); err != nil {
			if _, ok := err.(net.Error); !ok {
				break // socket gone
			}
		} else {
			pinger.receive(proto, rb[:n], source.(*net.IPAddr).IP, time.Now())
		}
	}

	// close running requests
	pinger.mtx.RLock()
	for _, req := range pinger.requests {
		req.handleReply(errClosed, nil, nil)
	}
	pinger.mtx.RUnlock()

	// Close() waits for us
	pinger.wg.Done()
}

// receive takes the raw message and tries to evaluate an ICMP response.
// If that succeeds, the body will given to process() for further processing.
func (pinger *Pinger) receive(proto int, bytes []byte, addr net.IP, t time.Time) {
	// parse message
	m, err := icmp.ParseMessage(proto, bytes)
	if err != nil {
		return
	}

	// evaluate message
	switch m.Type {
	case ipv4.ICMPTypeEchoReply, ipv6.ICMPTypeEchoReply:
		pinger.process(m.Body, nil, addr, &t)

	case ipv4.ICMPTypeDestinationUnreachable, ipv6.ICMPTypeDestinationUnreachable:
		body := m.Body.(*icmp.DstUnreach)
		if body == nil {
			return
		}

		var bodyData []byte
		switch proto {
		case ProtocolICMP:
			// parse header of original IPv4 packet
			hdr, err := ipv4.ParseHeader(body.Data)
			if err != nil {
				return
			}
			bodyData = body.Data[hdr.Len:]
		case ProtocolICMPv6:
			// parse header of original IPv6 packet (we don't need the actual
			// header, but want to detect parsing errors)
			_, err := ipv6.ParseHeader(body.Data)
			if err != nil {
				return
			}
			bodyData = body.Data[ipv6.HeaderLen:]
		default:
			return
		}

		// parse ICMP message after the IP header
		msg, err := icmp.ParseMessage(proto, bodyData)
		if err != nil {
			return
		}
		pinger.process(msg.Body, fmt.Errorf("%s", m.Type), nil, nil)
	}
}

// process will finish a currently running Echo Request, if the body is
// an ICMP Echo reply to a request from us.
func (pinger *Pinger) process(body icmp.MessageBody, result error, addr net.IP, tRecv *time.Time) {
	echo, ok := body.(*icmp.Echo)
	if !ok || echo == nil {
		if pinger.LogUnexpectedPackets {
			log.Info("expected *icmp.Echo, got ", body)
		}
		return
	}

	// check if we sent this
	if uint16(echo.ID) != pinger.id {
		return
	}

	// search for existing running echo request
	pinger.mtx.Lock()
	req := pinger.requests[uint16(echo.Seq)]
	if _, ok := req.(*simpleRequest); ok {
		// a simpleRequest is finished on the first reply
		delete(pinger.requests, uint16(echo.Seq))
	}
	pinger.mtx.Unlock()

	if req != nil {
		req.handleReply(result, addr, tRecv)
	}
}
