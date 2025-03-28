/*
 * Copyright (c) 2021 ETSI STF 625
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
	"os"
	"strings"
	"testing"

	log "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-logger"
)

// Build:
//  $ go test -covermode=count -coverpkg=./... -c -o <name-of-your-app>
// Run:
//  $ ./<name-of-your-app> -test.coverprofile=cover.out __DEVEL--code-cov  <your-app-args>

// TestMain is a hack that allows us to figure out what the coverage is during
// integration tests. I would not recommend that you use a binary built using
// this hack outside of a test suite.
func TestMain(t *testing.T) {
	var (
		args []string
		run  bool
	)

	log.Info(os.Args)
	for _, arg := range os.Args {
		switch {
		case arg == "__DEVEL--code-cov":
			run = true
		case strings.HasPrefix(arg, "-test"):
		case strings.HasPrefix(arg, "__DEVEL"):
		default:
			args = append(args, arg)
		}
	}
	os.Args = args
	log.Info(os.Args)

	if run {
		main()
	}
}
