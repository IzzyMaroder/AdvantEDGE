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
 *
 * NOTICE: File content based on https://github.com/morvencao/kube-mutating-webhook-tutorial (Apache 2.0)
 */

package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	log "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-logger"
	mod "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-model"
	mq "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-mq"

	"github.com/ghodss/yaml"
	admissionv1 "k8s.io/api/admission/v1"
	admissionregistrationv1 "k8s.io/api/admissionregistration/v1"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/serializer"
)

const meepOrigin = "scenario"

// MQ payload fields
const fieldSandboxName = "sandbox-name"

var (
	runtimeScheme = runtime.NewScheme()
	codecs        = serializer.NewCodecFactory(runtimeScheme)
	deserializer  = codecs.UniversalDeserializer()
)

type WebhookServer struct {
	sidecarConfig *Config
	server        *http.Server
}

// Webhook Server parameters
type WhSvrParameters struct {
	port           int    // webhook server port
	certFile       string // path to the x509 certificate for https
	keyFile        string // path to the x509 private key matching `CertFile`
	sidecarCfgFile string // path to sidecar injector configuration file
}

type Config struct {
	Containers     []corev1.Container `yaml:"containers"`
	Volumes        []corev1.Volume    `yaml:"volumes"`
	InitContainers []corev1.Container `yaml:"initContainers"`
}

type patchOperation struct {
	Op    string      `json:"op"`
	Path  string      `json:"path"`
	Value interface{} `json:"value,omitempty"`
}

func init() {
	_ = corev1.AddToScheme(runtimeScheme)
	_ = admissionregistrationv1.AddToScheme(runtimeScheme)
}

// Message Queue handler
func msgHandler(msg *mq.Msg, userData interface{}) {
	switch msg.Message {
	case mq.MsgScenarioActivate, mq.MsgScenarioUpdate:
		log.Debug("RX MSG: ", mq.PrintMsg(msg))
		err := refreshSandboxData(msg.Payload[fieldSandboxName])
		if err != nil {
			log.Error(err.Error())
		}
	case mq.MsgScenarioTerminate:
		log.Debug("RX MSG: ", mq.PrintMsg(msg))
		err := flushSandboxData(msg.Payload[fieldSandboxName])
		if err != nil {
			log.Error(err.Error())
		}
	default:
		log.Trace("Ignoring unsupported message: ", mq.PrintMsg(msg))
	}
}

func refreshSandboxData(sbxName string) error {
	// Validate params
	if sbxName == "" {
		return errors.New("Missing sandbox name")
	}

	mutex.Lock()
	defer mutex.Unlock()

	// Get sandbox data
	sbxData, found := sbxDataMap[sbxName]
	if !found {
		// Create new sandbox data if it does not exist
		sbxData = new(SandboxData)

		// Create new active scenario model
		modelCfg := mod.ModelCfg{
			Name:      sbxName,
			Namespace: sbxName,
			Module:    moduleName,
			UpdateCb:  nil,
			DbAddr:    "",
		}
		var err error
		sbxData.ActiveScenario, err = mod.NewModel(modelCfg)
		if err != nil {
			return errors.New("Failed to create model: " + err.Error())
		}

		// Add new sandbox data to map
		sbxDataMap[sbxName] = sbxData
	}

	// Obtain latest scenario
	sbxData.ActiveScenario.UpdateScenario()

	// Refresh scenario name
	sbxData.ScenarioName = sbxData.ActiveScenario.GetScenarioName()

	// Refresh app instance ID map
	sbxData.AppIdMap = make(map[string]string)
	appTypeList := []string{mod.NodeTypeUEApp, mod.NodeTypeEdgeApp, mod.NodeTypeCloudApp}
	appNameList := sbxData.ActiveScenario.GetNodeNames(appTypeList...)
	for _, appName := range appNameList {
		appId := sbxData.ActiveScenario.GetNodeId(appName)
		if appId != "" {
			sbxData.AppIdMap[appName] = appId
		}
	}

	return nil
}

func flushSandboxData(sbxName string) error {
	// Validate params
	if sbxName == "" {
		return errors.New("Missing sandbox name")
	}

	mutex.Lock()
	defer mutex.Unlock()

	// Make sure sandbox data exists
	_, found := sbxDataMap[sbxName]
	if !found {
		return errors.New("Sandbox data not found for: " + sbxName)
	}

	// Delete sandbox data
	delete(sbxDataMap, sbxName)

	return nil
}

func getScenarioName(sbxName string) string {
	// Validate params
	if sbxName == "" {
		return ""
	}

	mutex.Lock()
	defer mutex.Unlock()

	// Get scenario name from sandbox data
	if sbxData, found := sbxDataMap[sbxName]; found {
		return sbxData.ScenarioName
	}
	return ""
}

func getAppId(sbxName string, appName string) string {
	// Validate params
	if sbxName == "" || appName == "" {
		return ""
	}

	mutex.Lock()
	defer mutex.Unlock()

	// Get scenario name from sandbox data
	if sbxData, found := sbxDataMap[sbxName]; found {
		if appId, found := sbxData.AppIdMap[appName]; found {
			return appId
		}
	}
	return ""
}

func loadConfig(configFile string) (*Config, error) {
	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		return nil, err
	}
	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

// Determine if resource is part of the active scenario
func isScenarioResource(name string, scenarioName string) bool {
	return name != "" && strings.HasPrefix(name, "meep-"+scenarioName+"-")
}

func getPlatformPatch(template corev1.PodTemplateSpec, sidecarConfig *Config, meepAppName string, sandboxName string) (patch []byte, err error) {
	var patchOps []patchOperation

	// Get scenario name
	scenarioName := getScenarioName(sandboxName)
	meepAppId := getAppId(sandboxName, meepAppName)

	// Add env vars to sidecar containers
	var envVars []corev1.EnvVar
	var envVar corev1.EnvVar
	envVar.Name = "MEEP_POD_NAME"
	envVar.Value = meepAppName
	envVars = append(envVars, envVar)
	envVar.Name = "MEEP_APP_ID"
	envVar.Value = meepAppId
	envVars = append(envVars, envVar)
	envVar.Name = "MEEP_SANDBOX_NAME"
	envVar.Value = sandboxName
	envVars = append(envVars, envVar)
	envVar.Name = "MEEP_SCENARIO_NAME"
	envVar.Value = scenarioName
	envVars = append(envVars, envVar)

	var sidecarContainers []corev1.Container
	for _, container := range sidecarConfig.Containers {
		container.Env = envVars
		sidecarContainers = append(sidecarContainers, container)
	}

	// Add env vars to scenario containers
	for idx, container := range template.Spec.Containers {
		patchOps = append(patchOps, addEnvVar(container.Env, envVars, fmt.Sprintf("/spec/template/spec/containers/%d/env", idx))...)
	}

	// Add sidecar containers
	patchOps = append(patchOps, addContainer(template.Spec.Containers, sidecarContainers, "/spec/template/spec/containers")...)
	patchOps = append(patchOps, addVolume(template.Spec.Volumes, sidecarConfig.Volumes, "/spec/template/spec/volumes")...)

	// Add labels
	newLabels := make(map[string]string)
	newLabels["meepApp"] = meepAppName
	newLabels["meepOrigin"] = meepOrigin
	newLabels["meepSandbox"] = sandboxName
	newLabels["meepScenario"] = scenarioName
	newLabels["processId"] = meepAppName
	patchOps = append(patchOps, updateLabels(template.ObjectMeta.Labels, newLabels, "/spec/template/metadata/labels")...)

	// Init Container for dependency check
	var initContainers []corev1.Container
	initContainers = append(initContainers, sidecarConfig.InitContainers...)
	patchOps = append(patchOps, addContainer(template.Spec.InitContainers, initContainers, "/spec/template/spec/initContainers")...)

	// Serialize patch
	patch, err = json.Marshal(patchOps)
	if err != nil {
		return nil, err
	}

	return patch, nil
}

func addContainer(target, added []corev1.Container, basePath string) (patch []patchOperation) {
	first := len(target) == 0
	var value interface{}
	for _, add := range added {
		value = add
		path := basePath
		if first {
			first = false
			value = []corev1.Container{add}
		} else {
			path = path + "/-"
		}

		patch = append(patch, patchOperation{
			Op:    "add",
			Path:  path,
			Value: value,
		})
	}
	return patch
}

func addVolume(target, added []corev1.Volume, basePath string) (patch []patchOperation) {
	first := len(target) == 0
	var value interface{}
	for _, add := range added {
		value = add
		path := basePath
		if first {
			first = false
			value = []corev1.Volume{add}
		} else {
			path = path + "/-"
		}
		patch = append(patch, patchOperation{
			Op:    "add",
			Path:  path,
			Value: value,
		})
	}
	return patch
}

func updateLabels(target map[string]string, added map[string]string, basePath string) (patch []patchOperation) {
	for key, value := range added {
		path := basePath + "/" + key
		op := "add"
		if target != nil && target[key] != "" {
			op = "replace"
		}
		patch = append(patch, patchOperation{
			Op:    op,
			Path:  path,
			Value: value,
		})
	}
	return patch
}

func addEnvVar(target, added []corev1.EnvVar, basePath string) (patch []patchOperation) {
	first := len(target) == 0
	var value interface{}
	for _, add := range added {
		value = add
		path := basePath
		if first {
			first = false
			value = []corev1.EnvVar{add}
		} else {
			path = path + "/-"
		}
		patch = append(patch, patchOperation{
			Op:    "add",
			Path:  path,
			Value: value,
		})
	}
	return patch
}

// main mutation process
func (whsvr *WebhookServer) mutate(ar *admissionv1.AdmissionReview) *admissionv1.AdmissionResponse {
	req := ar.Request
	log.Info("Mutate request Name[", req.Name, "] Kind[", req.Kind, "] Namespace[", req.Namespace, "]")

	// Get scenario name
	scenarioName := getScenarioName(req.Namespace)

	// Ignore if no active scenario
	if scenarioName == "" {
		log.Info("No active scenario. Ignoring request...")
		return &admissionv1.AdmissionResponse{
			Allowed: true,
		}
	}

	// Retrieve resource-specific information
	var resourceName string
	var releaseName string
	var template corev1.PodTemplateSpec

	switch req.Kind.Kind {
	case "Deployment":
		// Unmarshal Deployment
		var deployment appsv1.Deployment
		if err := json.Unmarshal(req.Object.Raw, &deployment); err != nil {
			log.Error("Could not unmarshal raw object: ", err.Error())
			return &admissionv1.AdmissionResponse{
				Result: &metav1.Status{
					Message: err.Error(),
				},
			}
		}
		resourceName = deployment.Name
		releaseName = deployment.Labels["release"]
		template = deployment.Spec.Template
		log.Info("Deployment Name: ", resourceName, " Release: ", releaseName)

	case "StatefulSet":
		// Unmarshal StatefulSet
		var statefulset appsv1.StatefulSet
		if err := json.Unmarshal(req.Object.Raw, &statefulset); err != nil {
			log.Error("Could not unmarshal raw object: ", err.Error())
			return &admissionv1.AdmissionResponse{
				Result: &metav1.Status{
					Message: err.Error(),
				},
			}
		}
		resourceName = statefulset.Name
		releaseName = statefulset.Labels["release"]
		template = statefulset.Spec.Template
		log.Info("StatefulSet Name: ", resourceName, " Release: ", releaseName)

	default:
		log.Info("Unsupported admission request Kind[", req.Kind.Kind, "]")
		return &admissionv1.AdmissionResponse{
			Allowed: true,
		}
	}

	// Determine if resource is part of the active scenario
	if !isScenarioResource(releaseName, scenarioName) {
		log.Info("Resource not part of active scenario. Ignoring request...")
		return &admissionv1.AdmissionResponse{
			Allowed: true,
		}
	}

	// Get platform patch
	patch, err := getPlatformPatch(template, whsvr.sidecarConfig, resourceName, req.Namespace)
	if err != nil {
		return &admissionv1.AdmissionResponse{
			Result: &metav1.Status{
				Message: err.Error(),
			},
		}
	}

	log.Debug("AdmissionResponse: patch=", string(patch))
	return &admissionv1.AdmissionResponse{
		Allowed: true,
		Patch:   patch,
		PatchType: func() *admissionv1.PatchType {
			pt := admissionv1.PatchTypeJSONPatch
			return &pt
		}(),
	}
}

// Serve method for webhook server
func (whsvr *WebhookServer) serve(w http.ResponseWriter, r *http.Request) {
	var body []byte
	if r.Body != nil {
		if data, err := ioutil.ReadAll(r.Body); err == nil {
			body = data
		}
	}
	if len(body) == 0 {
		log.Error("empty body")
		http.Error(w, "empty body", http.StatusBadRequest)
		return
	}

	// verify the content type is accurate
	contentType := r.Header.Get("Content-Type")
	if contentType != "application/json" {
		log.Error("Content-Type=", contentType, ", expect application/json")
		http.Error(w, "invalid Content-Type, expect `application/json`", http.StatusUnsupportedMediaType)
		return
	}

	var admissionResponse *admissionv1.AdmissionResponse
	ar := admissionv1.AdmissionReview{}
	if _, _, err := deserializer.Decode(body, nil, &ar); err != nil {
		log.Error("Can't decode body: ", err.Error())
		admissionResponse = &admissionv1.AdmissionResponse{
			Result: &metav1.Status{
				Message: err.Error(),
			},
		}
	} else {
		admissionResponse = whsvr.mutate(&ar)
	}

	admissionReview := admissionv1.AdmissionReview{}
	if admissionResponse != nil {
		admissionReview.Response = admissionResponse
		if ar.Request != nil {
			admissionReview.Response.UID = ar.Request.UID
		}
	}

	resp, err := json.Marshal(admissionReview)
	if err != nil {
		log.Error("Can't encode response: ", err.Error())
		http.Error(w, fmt.Sprintf("could not encode response: %v", err), http.StatusInternalServerError)
	}
	log.Info("Ready to write reponse: ", string(resp))
	if _, err := w.Write(resp); err != nil {
		log.Error("Can't write response: ", err.Error())
		http.Error(w, fmt.Sprintf("could not write response: %v", err), http.StatusInternalServerError)
	}
}
