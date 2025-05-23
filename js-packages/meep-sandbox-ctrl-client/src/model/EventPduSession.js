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
 * AdvantEDGE Sandbox Controller REST API
 * This API is the main Sandbox Controller API for scenario deployment & event injection <p>**Micro-service**<br>[meep-sandbox-ctrl](https://github.com/InterDigitalInc/AdvantEDGE/tree/master/go-apps/meep-sandbox-ctrl) <p>**Type & Usage**<br>Platform runtime interface to manage active scenarios and inject events in AdvantEDGE platform <p>**Details**<br>API details available at _your-AdvantEDGE-ip-address/api_
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

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/PDUSession'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./PDUSession'));
  } else {
    // Browser globals (root is window)
    if (!root.AdvantEdgeSandboxControllerRestApi) {
      root.AdvantEdgeSandboxControllerRestApi = {};
    }
    root.AdvantEdgeSandboxControllerRestApi.EventPduSession = factory(root.AdvantEdgeSandboxControllerRestApi.ApiClient, root.AdvantEdgeSandboxControllerRestApi.PDUSession);
  }
}(this, function(ApiClient, PDUSession) {
  'use strict';

  /**
   * The EventPduSession model module.
   * @module model/EventPduSession
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>EventPduSession</code>.
   * PDU Session Event object.<br> Specifies a PDU session action to perform for the provided UE. <p>Supported Actions: <li>ADD - Create new PDU Session from UE to target data network. <li>REMOVE - Remove active PDU Session. Only UE name & PDU session ID are required.
   * @alias module:model/EventPduSession
   * @class
   */
  var exports = function() {
  };

  /**
   * Constructs a <code>EventPduSession</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EventPduSession} obj Optional instance to populate.
   * @return {module:model/EventPduSession} The populated <code>EventPduSession</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('action'))
        obj.action = ApiClient.convertToType(data['action'], 'String');
      if (data.hasOwnProperty('pduSession'))
        obj.pduSession = PDUSession.constructFromObject(data['pduSession']);
    }
    return obj;
  }

  /**
   * PDU Session action to perform for provided UE
   * @member {module:model/EventPduSession.ActionEnum} action
   */
  exports.prototype.action = undefined;

  /**
   * @member {module:model/PDUSession} pduSession
   */
  exports.prototype.pduSession = undefined;


  /**
   * Allowed values for the <code>action</code> property.
   * @enum {String}
   * @readonly
   */
  exports.ActionEnum = {
    /**
     * value: "ADD"
     * @const
     */
    ADD: "ADD",

    /**
     * value: "REMOVE"
     * @const
     */
    REMOVE: "REMOVE"
  };

  return exports;

}));
