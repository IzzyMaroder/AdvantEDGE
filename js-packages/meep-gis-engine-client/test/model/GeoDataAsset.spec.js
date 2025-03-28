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
 * AdvantEDGE GIS Engine REST API
 * This API allows to control geo-spatial behavior and simulation. <p>**Micro-service**<br>[meep-gis-engine](https://github.com/InterDigitalInc/AdvantEDGE/tree/master/go-apps/meep-gis-engine) <p>**Type & Usage**<br>Platform runtime interface to control geo-spatial behavior and simulation <p>**Details**<br>API details available at _your-AdvantEDGE-ip-address/api_
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
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.AdvantEdgeGisEngineRestApi);
  }
}(this, function(expect, AdvantEdgeGisEngineRestApi) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('GeoDataAsset', function() {
      beforeEach(function() {
        instance = new AdvantEdgeGisEngineRestApi.GeoDataAsset();
      });

      it('should create an instance of GeoDataAsset', function() {
        // TODO: update the code to test GeoDataAsset
        expect(instance).to.be.a(AdvantEdgeGisEngineRestApi.GeoDataAsset);
      });

      it('should have the property assetName (base name: "assetName")', function() {
        // TODO: update the code to test the property assetName
        expect(instance).to.have.property('assetName');
        // expect(instance.assetName).to.be(expectedValueLiteral);
      });

      it('should have the property assetType (base name: "assetType")', function() {
        // TODO: update the code to test the property assetType
        expect(instance).to.have.property('assetType');
        // expect(instance.assetType).to.be(expectedValueLiteral);
      });

      it('should have the property subType (base name: "subType")', function() {
        // TODO: update the code to test the property subType
        expect(instance).to.have.property('subType');
        // expect(instance.subType).to.be(expectedValueLiteral);
      });

    });
  });

}));
