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
 * AdvantEDGE Auth Service REST API
 * This API provides microservice API authentication & authorization services <p>**Micro-service**<br>[meep-auth](https://github.com/InterDigitalInc/AdvantEDGE/tree/master/go-apps/meep-auth) <p>**Type & Usage**<br>Platform interface used by ingress to authenticate & authorize microservice API access <p>**Details**<br>API details available at _your-AdvantEDGE-ip-address/api_
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
    factory(root.expect, root.AdvantEdgeAuthServiceRestApi);
  }
}(this, function(expect, AdvantEdgeAuthServiceRestApi) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('Sandbox', function() {
      beforeEach(function() {
        instance = new AdvantEdgeAuthServiceRestApi.Sandbox();
      });

      it('should create an instance of Sandbox', function() {
        // TODO: update the code to test Sandbox
        expect(instance).to.be.a(AdvantEdgeAuthServiceRestApi.Sandbox);
      });

      it('should have the property name (base name: "name")', function() {
        // TODO: update the code to test the property name
        expect(instance).to.have.property('name');
        // expect(instance.name).to.be(expectedValueLiteral);
      });

    });
  });

}));
