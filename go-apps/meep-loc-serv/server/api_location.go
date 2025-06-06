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
 * AdvantEDGE Location API
 *
 * Location Service is AdvantEDGE's implementation of [ETSI MEC ISG MEC013 Location API](https://www.etsi.org/deliver/etsi_gs/MEC/001_099/013/02.02.01_60/gs_mec013v020201p.pdf) <p>The API is based on the Open Mobile Alliance's specification RESTful Network API for Zonal Presence <p>[Copyright (c) ETSI 2017](https://forge.etsi.org/etsi-forge-copyright-notice.txt) <p>**Micro-service**<br>[meep-loc-serv](https://github.com/InterDigitalInc/AdvantEDGE/tree/master/go-apps/meep-loc-serv) <p>**Type & Usage**<br>Edge Service used by edge applications that want to get information about Users (UE) and Zone locations <p>**Note**<br>AdvantEDGE supports all of Location API endpoints (see below).
 *
 * API version: 2.2.1
 * Contact: AdvantEDGE@InterDigital.com
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */
package server

import (
	"net/http"
)

func ApByIdGET(w http.ResponseWriter, r *http.Request) {
	apByIdGet(w, r)
}

func ApGET(w http.ResponseWriter, r *http.Request) {
	apGet(w, r)
}

func AreaCircleSubDELETE(w http.ResponseWriter, r *http.Request) {
	areaCircleSubDelete(w, r)
}

func AreaCircleSubGET(w http.ResponseWriter, r *http.Request) {
	areaCircleSubGet(w, r)
}

func AreaCircleSubListGET(w http.ResponseWriter, r *http.Request) {
	areaCircleSubListGet(w, r)
}

func AreaCircleSubPOST(w http.ResponseWriter, r *http.Request) {
	areaCircleSubPost(w, r)
}

func AreaCircleSubPUT(w http.ResponseWriter, r *http.Request) {
	areaCircleSubPut(w, r)
}

func DistanceGET(w http.ResponseWriter, r *http.Request) {
	distanceGet(w, r)
}

func DistanceSubDELETE(w http.ResponseWriter, r *http.Request) {
	distanceSubDelete(w, r)
}

func DistanceSubGET(w http.ResponseWriter, r *http.Request) {
	distanceSubGet(w, r)
}

func DistanceSubListGET(w http.ResponseWriter, r *http.Request) {
	distanceSubListGet(w, r)
}

func DistanceSubPOST(w http.ResponseWriter, r *http.Request) {
	distanceSubPost(w, r)
}

func DistanceSubPUT(w http.ResponseWriter, r *http.Request) {
	distanceSubPut(w, r)
}

func Mec011AppTerminationPOST(w http.ResponseWriter, r *http.Request) {
	mec011AppTerminationPost(w, r)
}

func PeriodicSubDELETE(w http.ResponseWriter, r *http.Request) {
	periodicSubDelete(w, r)
}

func PeriodicSubGET(w http.ResponseWriter, r *http.Request) {
	periodicSubGet(w, r)
}

func PeriodicSubListGET(w http.ResponseWriter, r *http.Request) {
	periodicSubListGet(w, r)
}

func PeriodicSubPOST(w http.ResponseWriter, r *http.Request) {
	periodicSubPost(w, r)
}

func PeriodicSubPUT(w http.ResponseWriter, r *http.Request) {
	periodicSubPut(w, r)
}

func UserTrackingSubDELETE(w http.ResponseWriter, r *http.Request) {
	userTrackingSubDelete(w, r)
}

func UserTrackingSubGET(w http.ResponseWriter, r *http.Request) {
	userTrackingSubGet(w, r)
}

func UserTrackingSubListGET(w http.ResponseWriter, r *http.Request) {
	userTrackingSubListGet(w, r)
}

func UserTrackingSubPOST(w http.ResponseWriter, r *http.Request) {
	userTrackingSubPost(w, r)
}

func UserTrackingSubPUT(w http.ResponseWriter, r *http.Request) {
	userTrackingSubPut(w, r)
}

func UsersGET(w http.ResponseWriter, r *http.Request) {
	usersGet(w, r)
}

func ZonalTrafficSubDELETE(w http.ResponseWriter, r *http.Request) {
	zonalTrafficSubDelete(w, r)
}

func ZonalTrafficSubGET(w http.ResponseWriter, r *http.Request) {
	zonalTrafficSubGet(w, r)
}

func ZonalTrafficSubListGET(w http.ResponseWriter, r *http.Request) {
	zonalTrafficSubListGet(w, r)
}

func ZonalTrafficSubPOST(w http.ResponseWriter, r *http.Request) {
	zonalTrafficSubPost(w, r)
}

func ZonalTrafficSubPUT(w http.ResponseWriter, r *http.Request) {
	zonalTrafficSubPut(w, r)
}

func ZoneStatusSubDELETE(w http.ResponseWriter, r *http.Request) {
	zoneStatusSubDelete(w, r)
}

func ZoneStatusSubGET(w http.ResponseWriter, r *http.Request) {
	zoneStatusSubGet(w, r)
}

func ZoneStatusSubListGET(w http.ResponseWriter, r *http.Request) {
	zoneStatusSubListGet(w, r)
}

func ZoneStatusSubPOST(w http.ResponseWriter, r *http.Request) {
	zoneStatusSubPost(w, r)
}

func ZoneStatusSubPUT(w http.ResponseWriter, r *http.Request) {
	zoneStatusSubPut(w, r)
}

func ZonesGET(w http.ResponseWriter, r *http.Request) {
	zonesGet(w, r)
}

func ZonesGetById(w http.ResponseWriter, r *http.Request) {
	zonesByIdGet(w, r)
}
