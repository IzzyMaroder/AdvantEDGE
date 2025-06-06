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
    define(['ApiClient', 'model/LineString', 'model/Point'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./LineString'), require('./Point'));
  } else {
    // Browser globals (root is window)
    if (!root.AdvantEdgeSandboxControllerRestApi) {
      root.AdvantEdgeSandboxControllerRestApi = {};
    }
    root.AdvantEdgeSandboxControllerRestApi.GeoData = factory(root.AdvantEdgeSandboxControllerRestApi.ApiClient, root.AdvantEdgeSandboxControllerRestApi.LineString, root.AdvantEdgeSandboxControllerRestApi.Point);
  }
}(this, function(ApiClient, LineString, Point) {
  'use strict';

  /**
   * The GeoData model module.
   * @module model/GeoData
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>GeoData</code>.
   * Geographic data
   * @alias module:model/GeoData
   * @class
   */
  var exports = function() {
  };

  /**
   * Constructs a <code>GeoData</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/GeoData} obj Optional instance to populate.
   * @return {module:model/GeoData} The populated <code>GeoData</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('location'))
        obj.location = Point.constructFromObject(data['location']);
      if (data.hasOwnProperty('radius'))
        obj.radius = ApiClient.convertToType(data['radius'], 'Number');
      if (data.hasOwnProperty('path'))
        obj.path = LineString.constructFromObject(data['path']);
      if (data.hasOwnProperty('eopMode'))
        obj.eopMode = ApiClient.convertToType(data['eopMode'], 'String');
      if (data.hasOwnProperty('velocity'))
        obj.velocity = ApiClient.convertToType(data['velocity'], 'Number');
      if (data.hasOwnProperty('d2dInRange'))
        obj.d2dInRange = ApiClient.convertToType(data['d2dInRange'], ['String']);
      if (data.hasOwnProperty('poaInRange'))
        obj.poaInRange = ApiClient.convertToType(data['poaInRange'], ['String']);
    }
    return obj;
  }

  /**
   * @member {module:model/Point} location
   */
  exports.prototype.location = undefined;

  /**
   * Optional - Radius (in meters) around the location
   * @member {Number} radius
   */
  exports.prototype.radius = undefined;

  /**
   * @member {module:model/LineString} path
   */
  exports.prototype.path = undefined;

  /**
   * End-of-Path mode: <li>LOOP: When path endpoint is reached, start over from the beginning <li>REVERSE: When path endpoint is reached, return on the reverse path
   * @member {module:model/GeoData.EopModeEnum} eopMode
   */
  exports.prototype.eopMode = undefined;

  /**
   * Speed of movement along path in m/s
   * @member {Number} velocity
   */
  exports.prototype.velocity = undefined;

  /**
   * @member {Array.<String>} d2dInRange
   */
  exports.prototype.d2dInRange = undefined;

  /**
   * @member {Array.<String>} poaInRange
   */
  exports.prototype.poaInRange = undefined;


  /**
   * Allowed values for the <code>eopMode</code> property.
   * @enum {String}
   * @readonly
   */
  exports.EopModeEnum = {
    /**
     * value: "LOOP"
     * @const
     */
    LOOP: "LOOP",

    /**
     * value: "REVERSE"
     * @const
     */
    REVERSE: "REVERSE"
  };

  return exports;

}));
