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
 * Demo iperf transit App API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.1
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.9
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/IperfInfo'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/IperfInfo'));
  } else {
    // Browser globals (root is window)
    if (!root.DemoIperfTransitAppApi) {
      root.DemoIperfTransitAppApi = {};
    }
    root.DemoIperfTransitAppApi.IperfAppInfoApi = factory(root.DemoIperfTransitAppApi.ApiClient, root.DemoIperfTransitAppApi.IperfInfo);
  }
}(this, function(ApiClient, IperfInfo) {
  'use strict';

  /**
   * IperfAppInfo service.
   * @module api/IperfAppInfoApi
   * @version 0.0.1
   */

  /**
   * Constructs a new IperfAppInfoApi. 
   * @alias module:api/IperfAppInfoApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the handleIperfInfo operation.
     * @callback module:api/IperfAppInfoApi~handleIperfInfoCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Sends iperf details to issue an iperf command on the host
     * 
     * @param {module:model/IperfInfo} iperfInfo Demo transit Iperf Server Info
     * @param {module:api/IperfAppInfoApi~handleIperfInfoCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.handleIperfInfo = function(iperfInfo, callback) {
      var postBody = iperfInfo;

      // verify the required parameter 'iperfInfo' is set
      if (iperfInfo === undefined || iperfInfo === null) {
        throw new Error("Missing the required parameter 'iperfInfo' when calling handleIperfInfo");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/iperf-app', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
