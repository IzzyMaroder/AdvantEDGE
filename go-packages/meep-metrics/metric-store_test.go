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

package metrics

import (
	"encoding/json"
	"fmt"
	"strconv"
	"testing"

	log "github.com/InterDigitalInc/AdvantEDGE/go-packages/meep-logger"
)

const metricStore1Name string = "metric-store-1"
const metricStore2Name string = "metric-store-2"
const metricStore3Name string = "metric-store-3"
const metricStoreNamespace string = "metric-ns"
const metricStoreInfluxAddr string = "http://localhost:30986"
const metricStoreRedisAddr string = "localhost:30380"

const metric1 = "metric1"
const tag1 = "tag1"
const tag2 = "tag2"
const field1 = "field1"
const field2 = "field2"
const field3 = "field3"
const field4 = "field4"

func TestMetricStoreNew(t *testing.T) {
	fmt.Println("--- ", t.Name())
	log.MeepTextLogInit(t.Name())

	fmt.Println("Invalid Metric Store address")
	ms, err := NewMetricStore("", metricStoreNamespace, "ExpectedFailure-InvalidStoreAddr", "")
	if err == nil {
		t.Fatalf("Should report error on invalid store addr")
	}
	if ms != nil {
		t.Fatalf("Should have a nil metric store")
	}
	ms, err = NewMetricStore("", "", "", "")
	if err == nil {
		t.Fatalf("Should report error on invalid store addr")
	}
	if ms != nil {
		t.Fatalf("Should have a nil metric store")
	}

	fmt.Println("Create valid Metric Store")
	ms, err = NewMetricStore("", metricStoreNamespace, metricStoreInfluxAddr, metricStoreRedisAddr)
	if err != nil {
		t.Fatalf("Unable to create Metric Store")
	}
	fmt.Println("Invoke API before setting store")
	tags := map[string]string{tag1: "tag1", tag2: "tag2"}
	fields := []string{field1, field2, field3, field4}
	_, err = ms.GetInfluxMetric(metric1, tags, fields, "", 0)
	if err == nil {
		t.Fatalf("API call should fail if no store is set")
	}
	metricList := make([]Metric, 1)
	metric := &metricList[0]
	metric.Name = NetMetName
	metric.Tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	metric.Fields = map[string]interface{}{field1: true, field2: "val1", field3: 0, field4: 0.0}
	err = ms.SetInfluxMetric(metricList)
	if err == nil {
		t.Fatalf("API call should fail if no store is set")
	}

	fmt.Println("Set store")
	err = ms.SetStore(metricStore1Name, metricStoreNamespace, true)
	if err != nil {
		t.Fatalf("Unable to set Store")
	}
	fmt.Println("Set store2")
	err = ms.SetStore(metricStore2Name, metricStoreNamespace, false)
	if err != nil {
		t.Fatalf("Unable to set Store2")
	}

	fmt.Println("Reset store")
	err = ms.SetStore("", metricStoreNamespace, true)
	if err != nil {
		t.Fatalf("Unable to reset Store")
	}

	fmt.Println("Invoke API after resetting store")
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	_, err = ms.GetInfluxMetric(metric1, tags, fields, "", 0)
	if err == nil {
		t.Fatalf("API call should fail if no store is set")
	}

	// t.Fatalf("DONE")
}

func TestMetricStoreGetSetInflux(t *testing.T) {
	fmt.Println("--- ", t.Name())
	log.MeepTextLogInit(t.Name())

	fmt.Println("Create valid Metric Store")
	ms, err := NewMetricStore(metricStore1Name, metricStoreNamespace, metricStoreInfluxAddr, metricStoreRedisAddr)
	if err != nil {
		t.Fatalf("Unable to create Metric Store")
	}

	fmt.Println("Flush store metrics")
	ms.Flush()

	fmt.Println("Get empty metric")
	tags := map[string]string{tag1: "tag1", tag2: "tag2"}
	fields := []string{field1, field2, field3, field4}
	result, err := ms.GetInfluxMetric(metric1, tags, fields, "", 1)
	if err != nil || len(result) != 0 {
		t.Fatalf("Net metric should not exist")
	}

	fmt.Println("Set metrics")
	metricList := make([]Metric, 1)
	metric := &metricList[0]
	metric.Name = metric1
	metric.Tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	metric.Fields = map[string]interface{}{field1: true, field2: "val1", field3: 0, field4: 0.0}
	err = ms.SetInfluxMetric(metricList)
	if err != nil {
		t.Fatalf("Failed to set metric")
	}
	metric.Tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	metric.Fields = map[string]interface{}{field1: false, field2: "val2", field3: 1, field4: 1.1}
	err = ms.SetInfluxMetric(metricList)
	if err != nil {
		t.Fatalf("Failed to set metric")
	}

	fmt.Println("Get last metric")
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 1)
	if err != nil || len(result) != 1 {
		t.Fatalf("Failed to get metric")
	}
	if !validateMetric(result[0], false, "val2", 1, 1.1) {
		t.Fatalf("Invalid result")
	}

	fmt.Println("Get all metrics")
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 0)
	if err != nil || len(result) != 2 {
		t.Fatalf("Failed to get metric")
	}
	if !validateMetric(result[0], false, "val2", 1, 1.1) {
		t.Fatalf("Invalid result")
	}
	if !validateMetric(result[1], true, "val1", 0, 0.0) {
		t.Fatalf("Invalid result")
	}

	fmt.Println("Get all metrics from the last 10 seconds")
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "10s", 0)
	if err != nil || len(result) != 2 {
		if err == nil {
			fmt.Println(len(result))
		}
		t.Fatalf("Failed to get metric")
	}
	if !validateMetric(result[0], false, "val2", 1, 1.1) {
		t.Fatalf("Invalid result")
	}
	if !validateMetric(result[1], true, "val1", 0, 0.0) {
		t.Fatalf("Invalid result")
	}

	fmt.Println("Get all metrics from the last millisecond (none)")
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1ms", 0)
	if err != nil || len(result) != 0 {
		t.Fatalf("Net metric list should be empty")
	}

	// t.Fatalf("DONE")
}

func TestMetricStoreCopyInflux(t *testing.T) {
	fmt.Println("--- ", t.Name())
	log.MeepTextLogInit(t.Name())

	fmt.Println("Create valid Metric Store")
	ms, err := NewMetricStore(metricStore1Name, metricStoreNamespace, metricStoreInfluxAddr, metricStoreRedisAddr)
	if err != nil {
		t.Fatalf("Unable to create Metric Store")
	}

	fmt.Println("Flush store metrics")
	ms.Flush()

	fmt.Println("Set metrics")
	metricList := make([]Metric, 1)
	metric := &metricList[0]
	metric.Name = metric1
	metric.Tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	metric.Fields = map[string]interface{}{field1: true, field2: "val1", field3: 0, field4: 0.0}
	err = ms.SetInfluxMetric(metricList)
	if err != nil {
		t.Fatalf("Failed to set metric")
	}
	metric.Tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	metric.Fields = map[string]interface{}{field1: false, field2: "val2", field3: 1, field4: 1.1}
	err = ms.SetInfluxMetric(metricList)
	if err != nil {
		t.Fatalf("Failed to set metric")
	}

	fmt.Println("Copy invalid")
	err = ms.Copy("", metricStore3Name)
	if err == nil {
		t.Fatalf("Database copy should fail")
	}
	err = ms.Copy(metricStore1Name, "")
	if err == nil {
		t.Fatalf("Database copy should fail")
	}

	fmt.Println("Copy store")
	err = ms.Copy(metricStore1Name, metricStore3Name)
	if err != nil {
		t.Fatalf("Failed to copy database")
	}

	fmt.Println("Validate copied data")
	fmt.Println("Set store")
	err = ms.SetStore(metricStore3Name, metricStoreNamespace, true)
	if err != nil {
		t.Fatalf("Unable to set Store")
	}

	fmt.Println("Get all metrics")
	tags := map[string]string{tag1: "tag1", tag2: "tag2"}
	fields := []string{field1, field2, field3, field4}
	result, err := ms.GetInfluxMetric(metric1, tags, fields, "", 0)
	if err != nil || len(result) != 2 {
		t.Fatalf("Failed to get metric")
	}
	if !validateMetric(result[0], false, "val2", 1, 1.1) {
		t.Fatalf("Invalid result")
	}
	if !validateMetric(result[1], true, "val1", 0, 0.0) {
		t.Fatalf("Invalid result")
	}
}

func TestIncrementalInfluxQuery(t *testing.T) {
	fmt.Println("--- ", t.Name())
	log.MeepTextLogInit(t.Name())

	fmt.Println("Create valid Metric Store")
	ms, err := NewMetricStore(metricStore1Name, metricStoreNamespace, metricStoreInfluxAddr, metricStoreRedisAddr)
	if err != nil {
		t.Fatalf("Unable to create Metric Store")
	}

	fmt.Println("Flush store metrics")
	ms.Flush()

	fmt.Println("Get empty metric")
	tags := map[string]string{tag1: "tag1", tag2: "tag2"}
	fields := []string{field1, field2, field3, field4}
	result, err := ms.GetInfluxMetric(metric1, tags, fields, "", 1)
	if err != nil || len(result) != 0 {
		t.Fatalf("Net metric should not exist")
	}

	fmt.Println("Set metrics")
	metricList := make([]Metric, 1)
	MAX_LIMIT = 20
	count := 0
	for count < 100 {
		metricNum := strconv.Itoa(count)
		metric := &metricList[0]
		metric.Name = "metric1"
		metric.Tags = map[string]string{tag1: "tag1", tag2: "tag2"}
		metric.Fields = map[string]interface{}{field1: true, field2: "val" + metricNum, field3: 0, field4: 0.0}
		err = ms.SetInfluxMetric(metricList)
		count += 1
	}
	if err != nil {
		t.Fatalf("Failed to set metric")
	}

	fmt.Println("Get last metric")
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 1)
	if err != nil || len(result) != 1 {
		t.Fatalf("Failed to get metric")
	}
	fmt.Println(result[0])
	if !validateMetric(result[0], true, "val99", 0, 0.0) {
		t.Fatalf("Invalid result")
	}

	fmt.Println("Get all metrics")
	MAX_LIMIT = 10
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 0)
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}
	if !validateMetric(result[0], true, "val99", 0, 0.0) {
		t.Fatalf("Invalid result")
	}
	if !validateMetric(result[1], true, "val98", 0, 0.0) {
		t.Fatalf("Invalid result")
	}
	if !validateMetric(result[99], true, "val0", 0, 0.0) {
		t.Fatalf("Invalid result")
	}

	fmt.Println("Get all metrics")
	MAX_LIMIT = 100
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 0)
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get all metrics")
	MAX_LIMIT = 1000
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 0)
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N > log count, maxlimit < log count")
	MAX_LIMIT = 10
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 1000)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N > log count, maxlimit = log count")
	MAX_LIMIT = 100
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 1000)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N > log count, maxlimit > log count")
	MAX_LIMIT = 500
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 1000)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N > log count, N=maxlimit > log count")
	MAX_LIMIT = 1000
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 1000)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N < log count, maxlimit < log count")
	MAX_LIMIT = 10
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 25)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 25 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N < log count, N=maxlimit < log count")
	MAX_LIMIT = 25
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 25)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 25 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N < log count & maxlimit, maxlimit < log count")
	MAX_LIMIT = 50
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 25)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 25 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N < log count, maxlimit = log count")
	MAX_LIMIT = 100
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 25)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 25 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N < log count, maxlimit > log count")
	MAX_LIMIT = 500
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 25)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 25 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N = log count, maxlimit > log count")
	MAX_LIMIT = 500
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 100)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N = log count, maxlimit < log count")
	MAX_LIMIT = 50
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 100)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Get N = log count = maxlimit")
	MAX_LIMIT = 100
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "", 100)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Check Duration")
	MAX_LIMIT = 100
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1s", 100)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Check Duration")
	MAX_LIMIT = 10
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1s", 100)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Check Duration")
	MAX_LIMIT = 500
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1s", 100)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Check Duration")
	MAX_LIMIT = 100
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1s", 50)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 50 {
		t.Fatalf("Failed to get metric")
	}
	fmt.Println("Check Duration")
	MAX_LIMIT = 100
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1s", 0)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Check Duration")
	MAX_LIMIT = 10
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1s", 0)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}

	fmt.Println("Check long Duration")
	MAX_LIMIT = 10
	tags = map[string]string{tag1: "tag1", tag2: "tag2"}
	fields = []string{field1, field2, field3, field4}
	result, err = ms.GetInfluxMetric(metric1, tags, fields, "1d", 100)
	fmt.Println("Length of results: ", len(result))
	if err != nil || len(result) != 100 {
		t.Fatalf("Failed to get metric")
	}
}

func validateMetric(result map[string]interface{}, v1 bool, v2 string, v3 int32, v4 float64) bool {
	if result[field1] != v1 {
		fmt.Println("Invalid " + field1)
	} else if result[field2] != v2 {
		fmt.Println("Invalid " + field2)
	} else if val, ok := result[field3].(json.Number); !ok || JsonNumToInt32(val) != v3 {
		fmt.Println("Invalid " + field3)
	} else if val, ok := result[field4].(json.Number); !ok || JsonNumToFloat64(val) != v4 {
		fmt.Println("Invalid " + field4)
	} else {
		// Valid metric
		return true
	}
	return false
}
