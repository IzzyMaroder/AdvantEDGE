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
	"math/rand"
	"time"

	log "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-logger"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

// Payload represents additional data appended to outgoing ICMP Echo
// Requests.
type Payload []byte

// Resize will assign a new payload of the given size to p.
func (p *Payload) Resize(size uint16) {
	buf := make([]byte, size)
	if _, err := rand.Read(buf); err != nil {
		log.Error("error resizing payload: ", err)
		return
	}
	*p = Payload(buf)
}
