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
 * AdvantEDGE Metrics Service REST API
 * Metrics Service provides metrics about the active scenario <p>**Micro-service**<br>[meep-metrics-engine](https://github.com/InterDigitalInc/AdvantEDGE/tree/master/go-apps/meep-metrics-engine) <p>**Type & Usage**<br>Platform Service used by control/monitoring software and possibly by edge applications that require metrics <p>**Details**<br>API details available at _your-AdvantEDGE-ip-address/api_
 *
 * OpenAPI spec version: 1.0.0
 * Contact: AdvantEDGE@InterDigital.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.9
 *
 * Do not edit the class manually.
 *
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/DataflowMetric', 'model/DataflowMetricList', 'model/DataflowMetrics', 'model/DataflowQueryParams', 'model/EventMetric', 'model/EventMetricList', 'model/EventQueryParams', 'model/EventSubscription', 'model/EventSubscriptionList', 'model/EventSubscriptionParams', 'model/EventsCallbackReference', 'model/HttpMetric', 'model/HttpMetricList', 'model/HttpQueryParams', 'model/NetworkCallbackReference', 'model/NetworkMetric', 'model/NetworkMetricList', 'model/NetworkQueryParams', 'model/NetworkSubscription', 'model/NetworkSubscriptionList', 'model/NetworkSubscriptionParams', 'model/Scope', 'model/SeqMetric', 'model/SeqMetricList', 'model/SeqMetrics', 'model/SeqQueryParams', 'model/Tag', 'api/MetricsApi', 'api/SubscriptionsApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/DataflowMetric'), require('./model/DataflowMetricList'), require('./model/DataflowMetrics'), require('./model/DataflowQueryParams'), require('./model/EventMetric'), require('./model/EventMetricList'), require('./model/EventQueryParams'), require('./model/EventSubscription'), require('./model/EventSubscriptionList'), require('./model/EventSubscriptionParams'), require('./model/EventsCallbackReference'), require('./model/HttpMetric'), require('./model/HttpMetricList'), require('./model/HttpQueryParams'), require('./model/NetworkCallbackReference'), require('./model/NetworkMetric'), require('./model/NetworkMetricList'), require('./model/NetworkQueryParams'), require('./model/NetworkSubscription'), require('./model/NetworkSubscriptionList'), require('./model/NetworkSubscriptionParams'), require('./model/Scope'), require('./model/SeqMetric'), require('./model/SeqMetricList'), require('./model/SeqMetrics'), require('./model/SeqQueryParams'), require('./model/Tag'), require('./api/MetricsApi'), require('./api/SubscriptionsApi'));
  }
}(function(ApiClient, DataflowMetric, DataflowMetricList, DataflowMetrics, DataflowQueryParams, EventMetric, EventMetricList, EventQueryParams, EventSubscription, EventSubscriptionList, EventSubscriptionParams, EventsCallbackReference, HttpMetric, HttpMetricList, HttpQueryParams, NetworkCallbackReference, NetworkMetric, NetworkMetricList, NetworkQueryParams, NetworkSubscription, NetworkSubscriptionList, NetworkSubscriptionParams, Scope, SeqMetric, SeqMetricList, SeqMetrics, SeqQueryParams, Tag, MetricsApi, SubscriptionsApi) {
  'use strict';

  /**
   * Metrics_Service_provides_metrics_about_the_active_scenario_pMicro_servicebr_meep_metrics_engine_httpsgithub_comInterDigitalIncAdvantEDGEtreemastergo_appsmeep_metrics_engine_pType__UsagebrPlatform_Service_used_by_controlmonitoring_software_and_possibly_by_edge_applications_that_require_metrics_pDetailsbrAPI_details_available_at__your_AdvantEDGE_ip_addressapi_.<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var AdvantEdgeMetricsServiceRestApi = require('index'); // See note below*.
   * var xxxSvc = new AdvantEdgeMetricsServiceRestApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new AdvantEdgeMetricsServiceRestApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
   * and put the application logic within the callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new AdvantEdgeMetricsServiceRestApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new AdvantEdgeMetricsServiceRestApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version 1.0.0
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The DataflowMetric model constructor.
     * @property {module:model/DataflowMetric}
     */
    DataflowMetric: DataflowMetric,
    /**
     * The DataflowMetricList model constructor.
     * @property {module:model/DataflowMetricList}
     */
    DataflowMetricList: DataflowMetricList,
    /**
     * The DataflowMetrics model constructor.
     * @property {module:model/DataflowMetrics}
     */
    DataflowMetrics: DataflowMetrics,
    /**
     * The DataflowQueryParams model constructor.
     * @property {module:model/DataflowQueryParams}
     */
    DataflowQueryParams: DataflowQueryParams,
    /**
     * The EventMetric model constructor.
     * @property {module:model/EventMetric}
     */
    EventMetric: EventMetric,
    /**
     * The EventMetricList model constructor.
     * @property {module:model/EventMetricList}
     */
    EventMetricList: EventMetricList,
    /**
     * The EventQueryParams model constructor.
     * @property {module:model/EventQueryParams}
     */
    EventQueryParams: EventQueryParams,
    /**
     * The EventSubscription model constructor.
     * @property {module:model/EventSubscription}
     */
    EventSubscription: EventSubscription,
    /**
     * The EventSubscriptionList model constructor.
     * @property {module:model/EventSubscriptionList}
     */
    EventSubscriptionList: EventSubscriptionList,
    /**
     * The EventSubscriptionParams model constructor.
     * @property {module:model/EventSubscriptionParams}
     */
    EventSubscriptionParams: EventSubscriptionParams,
    /**
     * The EventsCallbackReference model constructor.
     * @property {module:model/EventsCallbackReference}
     */
    EventsCallbackReference: EventsCallbackReference,
    /**
     * The HttpMetric model constructor.
     * @property {module:model/HttpMetric}
     */
    HttpMetric: HttpMetric,
    /**
     * The HttpMetricList model constructor.
     * @property {module:model/HttpMetricList}
     */
    HttpMetricList: HttpMetricList,
    /**
     * The HttpQueryParams model constructor.
     * @property {module:model/HttpQueryParams}
     */
    HttpQueryParams: HttpQueryParams,
    /**
     * The NetworkCallbackReference model constructor.
     * @property {module:model/NetworkCallbackReference}
     */
    NetworkCallbackReference: NetworkCallbackReference,
    /**
     * The NetworkMetric model constructor.
     * @property {module:model/NetworkMetric}
     */
    NetworkMetric: NetworkMetric,
    /**
     * The NetworkMetricList model constructor.
     * @property {module:model/NetworkMetricList}
     */
    NetworkMetricList: NetworkMetricList,
    /**
     * The NetworkQueryParams model constructor.
     * @property {module:model/NetworkQueryParams}
     */
    NetworkQueryParams: NetworkQueryParams,
    /**
     * The NetworkSubscription model constructor.
     * @property {module:model/NetworkSubscription}
     */
    NetworkSubscription: NetworkSubscription,
    /**
     * The NetworkSubscriptionList model constructor.
     * @property {module:model/NetworkSubscriptionList}
     */
    NetworkSubscriptionList: NetworkSubscriptionList,
    /**
     * The NetworkSubscriptionParams model constructor.
     * @property {module:model/NetworkSubscriptionParams}
     */
    NetworkSubscriptionParams: NetworkSubscriptionParams,
    /**
     * The Scope model constructor.
     * @property {module:model/Scope}
     */
    Scope: Scope,
    /**
     * The SeqMetric model constructor.
     * @property {module:model/SeqMetric}
     */
    SeqMetric: SeqMetric,
    /**
     * The SeqMetricList model constructor.
     * @property {module:model/SeqMetricList}
     */
    SeqMetricList: SeqMetricList,
    /**
     * The SeqMetrics model constructor.
     * @property {module:model/SeqMetrics}
     */
    SeqMetrics: SeqMetrics,
    /**
     * The SeqQueryParams model constructor.
     * @property {module:model/SeqQueryParams}
     */
    SeqQueryParams: SeqQueryParams,
    /**
     * The Tag model constructor.
     * @property {module:model/Tag}
     */
    Tag: Tag,
    /**
     * The MetricsApi service constructor.
     * @property {module:api/MetricsApi}
     */
    MetricsApi: MetricsApi,
    /**
     * The SubscriptionsApi service constructor.
     * @property {module:api/SubscriptionsApi}
     */
    SubscriptionsApi: SubscriptionsApi
  };

  return exports;
}));
