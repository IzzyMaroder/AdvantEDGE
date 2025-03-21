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

package sbi

import (
	"sync"
	"time"

	dataModel "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-data-model"
	gc "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-gis-cache"
	log "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-logger"
	met "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-metrics"
	mod "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-model"
	mq "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-mq"
	sam "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-swagger-api-mgr"
)

const moduleName string = "meep-wais-sbi"

var metricStore *met.MetricStore
var redisAddr string = "meep-redis-master.default.svc.cluster.local:6379"
var influxAddr string = "http://meep-influxdb.default.svc.cluster.local:8086"

type SbiCfg struct {
	ModuleName     string
	SandboxName    string
	MepName        string
	RedisAddr      string
	InfluxAddr     string
	PostgisHost    string
	PostgisPort    string
	Locality       []string
	StaInfoCb      func(string, string, string, *int32, *int32, *int32)
	ApInfoCb       func(string, string, *float32, *float32, []string)
	ScenarioNameCb func(string)
	CleanUpCb      func()
}

type WaisSbi struct {
	moduleName              string
	sandboxName             string
	mepName                 string
	scenarioName            string
	localityEnabled         bool
	locality                map[string]bool
	mqLocal                 *mq.MsgQueue
	handlerId               int
	apiMgr                  *sam.SwaggerApiMgr
	activeModel             *mod.Model
	gisCache                *gc.GisCache
	refreshTicker           *time.Ticker
	updateStaInfoCB         func(string, string, string, *int32, *int32, *int32)
	updateAccessPointInfoCB func(string, string, *float32, *float32, []string)
	updateScenarioNameCB    func(string)
	cleanUpCB               func()
	mutex                   sync.Mutex
}

var sbi *WaisSbi

// Init - WAI Service SBI initialization
func Init(cfg SbiCfg) (err error) {

	// Create new SBI instance
	if sbi != nil {
		sbi = nil
	}
	sbi = new(WaisSbi)
	sbi.moduleName = cfg.ModuleName
	sbi.sandboxName = cfg.SandboxName
	sbi.mepName = cfg.MepName
	sbi.scenarioName = ""
	sbi.updateStaInfoCB = cfg.StaInfoCb
	sbi.updateAccessPointInfoCB = cfg.ApInfoCb
	sbi.updateScenarioNameCB = cfg.ScenarioNameCb
	sbi.cleanUpCB = cfg.CleanUpCb
	redisAddr = cfg.RedisAddr
	influxAddr = cfg.InfluxAddr

	// Fill locality map
	if len(cfg.Locality) > 0 {
		sbi.locality = make(map[string]bool)
		for _, locality := range cfg.Locality {
			sbi.locality[locality] = true
		}
		sbi.localityEnabled = true
	} else {
		sbi.localityEnabled = false
	}

	// Create message queue
	sbi.mqLocal, err = mq.NewMsgQueue(mq.GetLocalName(sbi.sandboxName), moduleName, sbi.sandboxName, cfg.RedisAddr)
	if err != nil {
		log.Error("Failed to create Message Queue with error: ", err)
		return err
	}
	log.Info("Message Queue created")

	// Create Swagger API Manager
	sbi.apiMgr, err = sam.NewSwaggerApiMgr(sbi.moduleName, sbi.sandboxName, sbi.mepName, sbi.mqLocal)
	if err != nil {
		log.Error("Failed to create Swagger API Manager. Error: ", err)
		return err
	}
	log.Info("Swagger API Manager created")

	// Create new active scenario model
	modelCfg := mod.ModelCfg{
		Name:      "activeScenario",
		Namespace: sbi.sandboxName,
		Module:    moduleName,
		UpdateCb:  nil,
		DbAddr:    cfg.RedisAddr,
	}
	sbi.activeModel, err = mod.NewModel(modelCfg)
	if err != nil {
		log.Error("Failed to create model: ", err.Error())
		return err
	}

	// Connect to GIS cache
	sbi.gisCache, err = gc.NewGisCache(sbi.sandboxName, cfg.RedisAddr)
	if err != nil {
		log.Error("Failed to GIS Cache: ", err.Error())
		return err
	}
	log.Info("Connected to GIS Cache")

	// Initialize service
	processActiveScenarioUpdate()

	return nil
}

// Run - MEEP WAIS execution
func Run() (err error) {

	// Start Swagger API Manager (provider)
	err = sbi.apiMgr.Start(true, false)
	if err != nil {
		log.Error("Failed to start Swagger API Manager with error: ", err.Error())
		return err
	}
	log.Info("Swagger API Manager started")

	// Add module Swagger APIs
	err = sbi.apiMgr.AddApis()
	if err != nil {
		log.Error("Failed to add Swagger APIs with error: ", err.Error())
		return err
	}
	log.Info("Swagger APIs successfully added")

	// Register Message Queue handler
	handler := mq.MsgHandler{Handler: msgHandler, UserData: nil}
	sbi.handlerId, err = sbi.mqLocal.RegisterHandler(handler)
	if err != nil {
		log.Error("Failed to register message queue handler: ", err.Error())
		return err
	}

	// Start refresh loop
	startRefreshTicker()

	return nil
}

func Stop() (err error) {
	if sbi == nil {
		return
	}

	// Stop refresh loop
	stopRefreshTicker()

	if sbi.mqLocal != nil {
		sbi.mqLocal.UnregisterHandler(sbi.handlerId)
	}

	if sbi.apiMgr != nil {
		// Remove APIs
		err = sbi.apiMgr.RemoveApis()
		if err != nil {
			log.Error("Failed to remove APIs with err: ", err.Error())
			return err
		}
	}

	return nil
}

func startRefreshTicker() {
	log.Debug("Starting refresh loop")
	sbi.refreshTicker = time.NewTicker(1000 * time.Millisecond)
	go func() {
		for range sbi.refreshTicker.C {
			refreshPositions()
			refreshMeasurements()
		}
	}()
}

func stopRefreshTicker() {
	if sbi.refreshTicker != nil {
		sbi.refreshTicker.Stop()
		sbi.refreshTicker = nil
		log.Debug("Refresh loop stopped")
	}
}

// Message Queue handler
func msgHandler(msg *mq.Msg, userData interface{}) {
	switch msg.Message {
	case mq.MsgScenarioActivate:
		log.Debug("RX MSG: ", mq.PrintMsg(msg))
		processActiveScenarioUpdate()
	case mq.MsgScenarioUpdate:
		log.Debug("RX MSG: ", mq.PrintMsg(msg))
		processActiveScenarioUpdate()
	case mq.MsgScenarioTerminate:
		log.Debug("RX MSG: ", mq.PrintMsg(msg))
		processActiveScenarioTerminate()
	default:
		log.Trace("Ignoring unsupported message: ", mq.PrintMsg(msg))
	}
}

func processActiveScenarioTerminate() {
	log.Debug("processActiveScenarioTerminate")

	// Sync with active scenario store
	sbi.activeModel.UpdateScenario()

	sbi.cleanUpCB()
}

func getAppSumUlDl(apps []string) (float32, float32) {
	sumUl := 0.0
	sumDl := 0.0
	//var appNames []string
	for _, appName := range apps {
		//appNames = append(appNames, process.Name)
		if metricStore != nil {
			metricsArray, err := metricStore.GetCachedNetworkMetrics("*", appName)
			if err != nil {
				log.Error("Failed to get network metric:", err)
			}

			//downlink for the app is uplink for the UE, and vice-versa
			for _, metrics := range metricsArray {
				sumUl += metrics.DlTput
				sumDl += metrics.UlTput
			}
		}
	}

	return float32(sumUl), float32(sumDl)
}

func processActiveScenarioUpdate() {

	sbi.mutex.Lock()
	defer sbi.mutex.Unlock()

	log.Debug("processActiveScenarioUpdate")

	// Get previous list of connected UEs
	prevUeNames := []string{}
	prevUeNameList := sbi.activeModel.GetNodeNames("UE")
	for _, name := range prevUeNameList {
		if isUeConnected(name) && isInLocality(name) {
			prevUeNames = append(prevUeNames, name)
		}
	}

	sbi.activeModel.UpdateScenario()

	scenarioName := sbi.activeModel.GetScenarioName()

	// Connect to Metric Store
	sbi.updateScenarioNameCB(scenarioName)

	if scenarioName != sbi.scenarioName {
		sbi.scenarioName = scenarioName
		var err error

		metricStore, err = met.NewMetricStore(scenarioName, sbi.sandboxName, influxAddr, redisAddr)
		if err != nil {
			log.Error("Failed connection to metric-store: ", err)
		}
	}
	// Get all POA positions & UE measurments
	poaPositionMap, _ := sbi.gisCache.GetAllPositions(gc.TypePoa)
	uePoaMeasMap, _ := sbi.gisCache.GetAllPoaMeasurements()

	// Update UE info
	ueNames := []string{}
	ueNameList := sbi.activeModel.GetNodeNames("UE")
	for _, name := range ueNameList {
		// Ignore disconnected UEs
		if !isUeConnected(name) || !isInLocality(name) {
			continue
		}
		ueNames = append(ueNames, name)

		// Update STA Info
		ueParent := sbi.activeModel.GetNodeParent(name)
		if poa, ok := ueParent.(*dataModel.NetworkLocation); ok {
			apMacId := ""
			var rssi *int32
			switch poa.Type_ {
			case mod.NodeTypePoaWifi:
				apMacId = poa.PoaWifiConfig.MacId
				rssi = getRssi(name, poa.Name, uePoaMeasMap)
			}
			ue := (sbi.activeModel.GetNode(name)).(*dataModel.PhysicalLocation)

			//get all appNames under the UE
			apps := (sbi.activeModel.GetNodeChild(name)).(*[]dataModel.Process)

			var appNames []string
			for _, process := range *apps {
				appNames = append(appNames, process.Name)
			}

			sumUl, sumDl := getAppSumUlDl(appNames)
			sumUlKbps := int32(sumUl * 1000)
			sumDlKbps := int32(sumDl * 1000)
			sbi.updateStaInfoCB(name, ue.MacId, apMacId, rssi, &sumUlKbps, &sumDlKbps)
		}
	}

	// Update UEs that were removed
	for _, prevUeName := range prevUeNames {
		found := false
		for _, ueName := range ueNames {
			if ueName == prevUeName {
				found = true
				break
			}
		}
		if !found {
			sbi.updateStaInfoCB(prevUeName, "", "", nil, nil, nil)
			log.Info("Ue removed : ", prevUeName)
		}
	}

	// Update POA Wifi info
	poaNameList := sbi.activeModel.GetNodeNames(mod.NodeTypePoaWifi)
	for _, name := range poaNameList {
		// Ignore POAs not in locality
		if !isInLocality(name) {
			continue
		}

		poa := (sbi.activeModel.GetNode(name)).(*dataModel.NetworkLocation)
		if poa == nil {
			log.Error("Can't find poa named " + name)
			continue
		}

		var longitude *float32
		var latitude *float32
		if position, found := poaPositionMap[name]; found {
			longitude = &position.Longitude
			latitude = &position.Latitude
		}
		//list of Ues MacIds
		var ueMacIdList []string

		for _, pl := range poa.PhysicalLocations {
			if pl.Connected {
				ueMacIdList = append(ueMacIdList, pl.MacId)
			}
		}
		sbi.updateAccessPointInfoCB(name, poa.PoaWifiConfig.MacId, longitude, latitude, ueMacIdList)
	}
}

func refreshPositions() {

	sbi.mutex.Lock()
	defer sbi.mutex.Unlock()

	// Update POA Positions
	poaPositionMap, _ := sbi.gisCache.GetAllPositions(gc.TypePoa)
	poaNameList := sbi.activeModel.GetNodeNames(mod.NodeTypePoaWifi)
	for _, name := range poaNameList {
		// Ignore POAs not in locality
		if !isInLocality(name) {
			continue
		}
		// Get Network Location
		poa := (sbi.activeModel.GetNode(name)).(*dataModel.NetworkLocation)
		if poa == nil {
			log.Error("Can't find poa named " + name)
			continue
		}

		// Get position
		var longitude *float32
		var latitude *float32
		if position, found := poaPositionMap[name]; found {
			longitude = &position.Longitude
			latitude = &position.Latitude
		}

		// Get list UE MacIds
		var ueMacIdList []string
		for _, pl := range poa.PhysicalLocations {
			if pl.Connected {
				ueMacIdList = append(ueMacIdList, pl.MacId)
			}
		}

		sbi.updateAccessPointInfoCB(name, poa.PoaWifiConfig.MacId, longitude, latitude, ueMacIdList)
	}
}

func refreshMeasurements() {
	// Update UE measurements
	uePoaMeasMap, _ := sbi.gisCache.GetAllPoaMeasurements()
	ueNameList := sbi.activeModel.GetNodeNames("UE")
	for _, name := range ueNameList {
		// Ignore disconnected UEs
		if !isUeConnected(name) || !isInLocality(name) {
			continue
		}

		// Update STA Info
		ueParent := sbi.activeModel.GetNodeParent(name)
		if poa, ok := ueParent.(*dataModel.NetworkLocation); ok {
			apMacId := ""
			var rssi *int32
			switch poa.Type_ {
			case mod.NodeTypePoaWifi:
				apMacId = poa.PoaWifiConfig.MacId
				rssi = getRssi(name, poa.Name, uePoaMeasMap)
			}
			ue := (sbi.activeModel.GetNode(name)).(*dataModel.PhysicalLocation)
			apps := (sbi.activeModel.GetNodeChild(name)).(*[]dataModel.Process)

			var appNames []string
			for _, process := range *apps {
				appNames = append(appNames, process.Name)
			}

			sumUl, sumDl := getAppSumUlDl(appNames)
			sumUlKbps := int32(sumUl * 1000)
			sumDlKbps := int32(sumDl * 1000)
			sbi.updateStaInfoCB(name, ue.MacId, apMacId, rssi, &sumUlKbps, &sumDlKbps)
		}
	}
}

func getRssi(ue string, poa string, uePoaMeasMap map[string]*gc.UePoaMeasurement) *int32 {
	if ueMeas, ueFound := uePoaMeasMap[ue]; ueFound {
		if meas, poaFound := ueMeas.Measurements[poa]; poaFound {
			rssi := int32(meas.Rssi)
			return &rssi
		}
	}
	return nil
}

func isUeConnected(name string) bool {
	node := sbi.activeModel.GetNode(name)
	if node != nil {
		pl := node.(*dataModel.PhysicalLocation)
		if pl.Connected {
			return true
		}
	}
	return false
}

func isInLocality(name string) bool {
	if sbi.localityEnabled {
		ctx := sbi.activeModel.GetNodeContext(name)
		if ctx == nil {
			log.Error("Error getting context for: " + name)
			return false
		}
		if _, found := sbi.locality[ctx.Parents[mod.Zone]]; !found {
			return false
		}
	}
	return true
}
