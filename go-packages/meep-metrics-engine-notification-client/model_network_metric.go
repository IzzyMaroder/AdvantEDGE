/*
 * Copyright (c) 2022  The AdvantEDGE Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * AdvantEDGE Metrics Service Notification REST API
 *
 * This API enables the Metrics Service to post metrics measurements/events to edge applications <p>**Micro-service**<br>None <p>**Type & Usage**<br>User's Edge Applications subscribing to Metrics measurements/events must implement this API <p>**Details**<br>API details available at _your-AdvantEDGE-ip-address/api_ <p>**Note**<br>This API is not exposed by default on the AdvantEDGE platform
 *
 * API version: 1.0.0
 * Contact: AdvantEDGE@InterDigital.com
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */

package client

// Value of a single network metric
type NetworkMetric struct {
	// Time of network metrics
	Time string `json:"time,omitempty"`
	// Round-trip latency (ms)
	Lat int32 `json:"lat,omitempty"`
	// Uplink throughput from src to dest (Mbps)
	Ul float64 `json:"ul,omitempty"`
	// Downlink throughput from dest to src (Mbps)
	Dl float64 `json:"dl,omitempty"`
	// Uplink packet loss from src to dest (%)
	Ulos float64 `json:"ulos,omitempty"`
	// Uplink packet loss from dest to src (%)
	Dlos float64 `json:"dlos,omitempty"`
}
