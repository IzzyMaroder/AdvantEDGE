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

package server

import (
	"encoding/json"

	log "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-logger"
)

func convertJsonToAppInfo(jsonInfo string) *AppInfo {

	var obj AppInfo
	err := json.Unmarshal([]byte(jsonInfo), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertAppInfoToJson(obj *AppInfo) string {

	jsonInfo, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonInfo)
}

func convertJsonToPoaInfo(jsonInfo string) *PoaInfo {

	var obj PoaInfo
	err := json.Unmarshal([]byte(jsonInfo), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertPoaInfoToJson(obj *PoaInfo) string {

	jsonInfo, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonInfo)
}

func convertJsonToUeData(jsonData string) *UeData {

	var obj UeData
	err := json.Unmarshal([]byte(jsonData), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertUeDataToJson(obj *UeData) string {

	jsonData, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonData)
}

func convertJsonToDomainData(jsonData string) *DomainData {

	var obj DomainData
	err := json.Unmarshal([]byte(jsonData), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertDomainDataToJson(obj *DomainData) string {

	jsonData, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonData)
}

/*
func convertJsonToOneOfNotificationSubscription(jsonInfo string) *OneOfNotificationSubscription {

        var obj OneOfNotificationSubscription
        err := json.Unmarshal([]byte(jsonInfo), &obj)
        if err != nil {
                log.Error(err.Error())
                return nil
        }
        return &obj
}

func convertOneOfNotificationSubscriptionToJson(obj *OneOfNotificationSubscription) string {

        jsonInfo, err := json.Marshal(*obj)
        if err != nil {
                log.Error(err.Error())
                return ""
        }

        return string(jsonInfo)
}
*/
func convertJsonToCellChangeSubscription(jsonInfo string) *CellChangeSubscription {

	var obj CellChangeSubscription
	err := json.Unmarshal([]byte(jsonInfo), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertCellChangeSubscriptionToJson(obj *CellChangeSubscription) string {

	jsonInfo, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonInfo)
}

func convertJsonToRabEstSubscription(jsonInfo string) *RabEstSubscription {

	var obj RabEstSubscription
	err := json.Unmarshal([]byte(jsonInfo), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertRabEstSubscriptionToJson(obj *RabEstSubscription) string {

	jsonInfo, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonInfo)
}

func convertJsonToRabRelSubscription(jsonInfo string) *RabRelSubscription {

	var obj RabRelSubscription
	err := json.Unmarshal([]byte(jsonInfo), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertRabRelSubscriptionToJson(obj *RabRelSubscription) string {

	jsonInfo, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonInfo)
}

func convertJsonToMeasRepUeSubscription(jsonInfo string) *MeasRepUeSubscription {

	var obj MeasRepUeSubscription
	err := json.Unmarshal([]byte(jsonInfo), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertMeasRepUeSubscriptionToJson(obj *MeasRepUeSubscription) string {

	jsonInfo, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonInfo)
}

func convertJsonToNrMeasRepUeSubscription(jsonInfo string) *NrMeasRepUeSubscription {

	var obj NrMeasRepUeSubscription
	err := json.Unmarshal([]byte(jsonInfo), &obj)
	if err != nil {
		log.Error(err.Error())
		return nil
	}
	return &obj
}

func convertNrMeasRepUeSubscriptionToJson(obj *NrMeasRepUeSubscription) string {

	jsonInfo, err := json.Marshal(*obj)
	if err != nil {
		log.Error(err.Error())
		return ""
	}

	return string(jsonInfo)
}

func convertProblemDetailstoJson(probdetails *ProblemDetails) string {
	jsonInfo, err := json.Marshal(*probdetails)
	if err != nil {
		log.Error(err.Error())
		return ""
	}
	return string(jsonInfo)
}
