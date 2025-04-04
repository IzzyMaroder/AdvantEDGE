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
 * MEEP Demo App API
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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.MeepDemoAppApi) {
      root.MeepDemoAppApi = {};
    }
    root.MeepDemoAppApi.ZoneInfo = factory(root.MeepDemoAppApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * The ZoneInfo model module.
   * @module model/ZoneInfo
   * @version 0.0.1
   */

  /**
   * Constructs a new <code>ZoneInfo</code>.
   * A type containing zone information.
   * @alias module:model/ZoneInfo
   * @class
   * @param zoneId {String} Unique Identifier of a Location Zone
   * @param numberOfAccessPoints {Number} Number of access points or points of access within a Location Zone
   * @param numberOfUsers {Number} The number of users currently on the access point
   */
  var exports = function(zoneId, numberOfAccessPoints, numberOfUsers) {
    this.zoneId = zoneId;
    this.numberOfAccessPoints = numberOfAccessPoints;
    this.numberOfUsers = numberOfUsers;
  };

  /**
   * Constructs a <code>ZoneInfo</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ZoneInfo} obj Optional instance to populate.
   * @return {module:model/ZoneInfo} The populated <code>ZoneInfo</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('zoneId'))
        obj.zoneId = ApiClient.convertToType(data['zoneId'], 'String');
      if (data.hasOwnProperty('numberOfAccessPoints'))
        obj.numberOfAccessPoints = ApiClient.convertToType(data['numberOfAccessPoints'], 'Number');
      if (data.hasOwnProperty('numberOfUsers'))
        obj.numberOfUsers = ApiClient.convertToType(data['numberOfUsers'], 'Number');
    }
    return obj;
  }

  /**
   * Unique Identifier of a Location Zone
   * @member {String} zoneId
   */
  exports.prototype.zoneId = undefined;

  /**
   * Number of access points or points of access within a Location Zone
   * @member {Number} numberOfAccessPoints
   */
  exports.prototype.numberOfAccessPoints = undefined;

  /**
   * The number of users currently on the access point
   * @member {Number} numberOfUsers
   */
  exports.prototype.numberOfUsers = undefined;

  return exports;

}));
