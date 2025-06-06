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

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.AdvantEdgeMetricsServiceRestApi);
  }
}(this, function(expect, AdvantEdgeMetricsServiceRestApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new AdvantEdgeMetricsServiceRestApi.SubscriptionsApi();
  });

  describe('(package)', function() {
    describe('SubscriptionsApi', function() {
      describe('createEventSubscription', function() {
        it('should call createEventSubscription successfully', function(done) {
          // TODO: uncomment, update parameter values for createEventSubscription call and complete the assertions
          /*
          var params = new AdvantEdgeMetricsServiceRestApi.EventSubscriptionParams();
          params.clientCorrelator = "83";
          params.callbackReference = new AdvantEdgeMetricsServiceRestApi.EventsCallbackReference();
          params.callbackReference.notifyURL = "http://clientApp.example.com/metric_event_notifications/123456";
          params.eventQueryParams = new AdvantEdgeMetricsServiceRestApi.EventQueryParams();
          params.eventQueryParams.tags = [new AdvantEdgeMetricsServiceRestApi.Tag()];
          params.eventQueryParams.tags[0].name = "src";
          params.eventQueryParams.tags[0].value = "ue1-iperf";
          params.eventQueryParams.fields = ["event"]"event";
          params.eventQueryParams.scope = new AdvantEdgeMetricsServiceRestApi.Scope();
          params.eventQueryParams.scope.limit = 60;
          params.eventQueryParams.scope.duration = "10s";
          params.period = 1;
          params.subscriptionType = "period";

          instance.createEventSubscription(params, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.EventSubscription);
            expect(data.subscriptionId).to.be.a('string');
            expect(data.subscriptionId).to.be("1.2556487E7");
            expect(data.clientCorrelator).to.be.a('string');
            expect(data.clientCorrelator).to.be("83");
            expect(data.callbackReference).to.be.a(AdvantEdgeMetricsServiceRestApi.EventsCallbackReference);
                  expect(data.callbackReference.notifyURL).to.be.a('string');
              expect(data.callbackReference.notifyURL).to.be("http://clientApp.example.com/metric_event_notifications/123456");
            expect(data.resourceURL).to.be.a('string');
            expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/events/subscription123");
            expect(data.eventQueryParams).to.be.a(AdvantEdgeMetricsServiceRestApi.EventQueryParams);
                  {
                let dataCtr = data.eventQueryParams.tags;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.Tag);
                  expect(data.name).to.be.a('string');
                  expect(data.name).to.be("src");
                  expect(data.value).to.be.a('string');
                  expect(data.value).to.be("ue1-iperf");
                }
              }
              {
                let dataCtr = data.eventQueryParams.fields;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a('string');
                  expect(data).to.be("event");
                }
              }
              expect(data.eventQueryParams.scope).to.be.a(AdvantEdgeMetricsServiceRestApi.Scope);
                    expect(data.eventQueryParams.scope.limit).to.be.a('number');
                expect(data.eventQueryParams.scope.limit).to.be(60);
                expect(data.eventQueryParams.scope.duration).to.be.a('string');
                expect(data.eventQueryParams.scope.duration).to.be("10s");
            expect(data.period).to.be.a('number');
            expect(data.period).to.be(1);
            expect(data.subscriptionType).to.be.a('string');
            expect(data.subscriptionType).to.be("period");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('createNetworkSubscription', function() {
        it('should call createNetworkSubscription successfully', function(done) {
          // TODO: uncomment, update parameter values for createNetworkSubscription call and complete the assertions
          /*
          var params = new AdvantEdgeMetricsServiceRestApi.NetworkSubscriptionParams();
          params.clientCorrelator = "83";
          params.callbackReference = new AdvantEdgeMetricsServiceRestApi.NetworkCallbackReference();
          params.callbackReference.notifyURL = "http://clientApp.example.com/metric_network_notifications/123456";
          params.networkQueryParams = new AdvantEdgeMetricsServiceRestApi.NetworkQueryParams();
          params.networkQueryParams.tags = [new AdvantEdgeMetricsServiceRestApi.Tag()];
          params.networkQueryParams.tags[0].name = "src";
          params.networkQueryParams.tags[0].value = "ue1-iperf";
          params.networkQueryParams.fields = ["lat"]"lat";
          params.networkQueryParams.scope = new AdvantEdgeMetricsServiceRestApi.Scope();
          params.networkQueryParams.scope.limit = 60;
          params.networkQueryParams.scope.duration = "10s";
          params.period = 1;
          params.subscriptionType = "period";

          instance.createNetworkSubscription(params, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkSubscription);
            expect(data.subscriptionId).to.be.a('string');
            expect(data.subscriptionId).to.be("1.2556487E7");
            expect(data.clientCorrelator).to.be.a('string');
            expect(data.clientCorrelator).to.be("83");
            expect(data.callbackReference).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkCallbackReference);
                  expect(data.callbackReference.notifyURL).to.be.a('string');
              expect(data.callbackReference.notifyURL).to.be("http://clientApp.example.com/metric_network_notifications/123456");
            expect(data.resourceURL).to.be.a('string');
            expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/network/subscription123");
            expect(data.networkQueryParams).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkQueryParams);
                  {
                let dataCtr = data.networkQueryParams.tags;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.Tag);
                  expect(data.name).to.be.a('string');
                  expect(data.name).to.be("src");
                  expect(data.value).to.be.a('string');
                  expect(data.value).to.be("ue1-iperf");
                }
              }
              {
                let dataCtr = data.networkQueryParams.fields;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a('string');
                  expect(data).to.be("lat");
                }
              }
              expect(data.networkQueryParams.scope).to.be.a(AdvantEdgeMetricsServiceRestApi.Scope);
                    expect(data.networkQueryParams.scope.limit).to.be.a('number');
                expect(data.networkQueryParams.scope.limit).to.be(60);
                expect(data.networkQueryParams.scope.duration).to.be.a('string');
                expect(data.networkQueryParams.scope.duration).to.be("10s");
            expect(data.period).to.be.a('number');
            expect(data.period).to.be(1);
            expect(data.subscriptionType).to.be.a('string');
            expect(data.subscriptionType).to.be("period");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('deleteEventSubscriptionById', function() {
        it('should call deleteEventSubscriptionById successfully', function(done) {
          // TODO: uncomment, update parameter values for deleteEventSubscriptionById call
          /*
          var subscriptionId = "subscriptionId_example";

          instance.deleteEventSubscriptionById(subscriptionId, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('deleteNetworkSubscriptionById', function() {
        it('should call deleteNetworkSubscriptionById successfully', function(done) {
          // TODO: uncomment, update parameter values for deleteNetworkSubscriptionById call
          /*
          var subscriptionId = "subscriptionId_example";

          instance.deleteNetworkSubscriptionById(subscriptionId, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('getEventSubscription', function() {
        it('should call getEventSubscription successfully', function(done) {
          // TODO: uncomment getEventSubscription call and complete the assertions
          /*

          instance.getEventSubscription(function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.EventSubscriptionList);
            {
              let dataCtr = data.eventSubscription;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.EventSubscription);
                expect(data.subscriptionId).to.be.a('string');
                expect(data.subscriptionId).to.be("1.2556487E7");
                expect(data.clientCorrelator).to.be.a('string');
                expect(data.clientCorrelator).to.be("83");
                expect(data.callbackReference).to.be.a(AdvantEdgeMetricsServiceRestApi.EventsCallbackReference);
                      expect(data.callbackReference.notifyURL).to.be.a('string');
                  expect(data.callbackReference.notifyURL).to.be("http://clientApp.example.com/metric_event_notifications/123456");
                expect(data.resourceURL).to.be.a('string');
                expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/events/subscription123");
                expect(data.eventQueryParams).to.be.a(AdvantEdgeMetricsServiceRestApi.EventQueryParams);
                      {
                    let dataCtr = data.eventQueryParams.tags;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.Tag);
                      expect(data.name).to.be.a('string');
                      expect(data.name).to.be("src");
                      expect(data.value).to.be.a('string');
                      expect(data.value).to.be("ue1-iperf");
                    }
                  }
                  {
                    let dataCtr = data.eventQueryParams.fields;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a('string');
                      expect(data).to.be("event");
                    }
                  }
                  expect(data.eventQueryParams.scope).to.be.a(AdvantEdgeMetricsServiceRestApi.Scope);
                        expect(data.eventQueryParams.scope.limit).to.be.a('number');
                    expect(data.eventQueryParams.scope.limit).to.be(60);
                    expect(data.eventQueryParams.scope.duration).to.be.a('string');
                    expect(data.eventQueryParams.scope.duration).to.be("10s");
                expect(data.period).to.be.a('number');
                expect(data.period).to.be(1);
                expect(data.subscriptionType).to.be.a('string');
                expect(data.subscriptionType).to.be("period");
              }
            }
            expect(data.resourceURL).to.be.a('string');
            expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/event/subscription123");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('getEventSubscriptionById', function() {
        it('should call getEventSubscriptionById successfully', function(done) {
          // TODO: uncomment, update parameter values for getEventSubscriptionById call and complete the assertions
          /*
          var subscriptionId = "subscriptionId_example";

          instance.getEventSubscriptionById(subscriptionId, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.EventSubscription);
            expect(data.subscriptionId).to.be.a('string');
            expect(data.subscriptionId).to.be("1.2556487E7");
            expect(data.clientCorrelator).to.be.a('string');
            expect(data.clientCorrelator).to.be("83");
            expect(data.callbackReference).to.be.a(AdvantEdgeMetricsServiceRestApi.EventsCallbackReference);
                  expect(data.callbackReference.notifyURL).to.be.a('string');
              expect(data.callbackReference.notifyURL).to.be("http://clientApp.example.com/metric_event_notifications/123456");
            expect(data.resourceURL).to.be.a('string');
            expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/events/subscription123");
            expect(data.eventQueryParams).to.be.a(AdvantEdgeMetricsServiceRestApi.EventQueryParams);
                  {
                let dataCtr = data.eventQueryParams.tags;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.Tag);
                  expect(data.name).to.be.a('string');
                  expect(data.name).to.be("src");
                  expect(data.value).to.be.a('string');
                  expect(data.value).to.be("ue1-iperf");
                }
              }
              {
                let dataCtr = data.eventQueryParams.fields;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a('string');
                  expect(data).to.be("event");
                }
              }
              expect(data.eventQueryParams.scope).to.be.a(AdvantEdgeMetricsServiceRestApi.Scope);
                    expect(data.eventQueryParams.scope.limit).to.be.a('number');
                expect(data.eventQueryParams.scope.limit).to.be(60);
                expect(data.eventQueryParams.scope.duration).to.be.a('string');
                expect(data.eventQueryParams.scope.duration).to.be("10s");
            expect(data.period).to.be.a('number');
            expect(data.period).to.be(1);
            expect(data.subscriptionType).to.be.a('string');
            expect(data.subscriptionType).to.be("period");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('getNetworkSubscription', function() {
        it('should call getNetworkSubscription successfully', function(done) {
          // TODO: uncomment getNetworkSubscription call and complete the assertions
          /*

          instance.getNetworkSubscription(function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkSubscriptionList);
            {
              let dataCtr = data.networkSubscription;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkSubscription);
                expect(data.subscriptionId).to.be.a('string');
                expect(data.subscriptionId).to.be("1.2556487E7");
                expect(data.clientCorrelator).to.be.a('string');
                expect(data.clientCorrelator).to.be("83");
                expect(data.callbackReference).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkCallbackReference);
                      expect(data.callbackReference.notifyURL).to.be.a('string');
                  expect(data.callbackReference.notifyURL).to.be("http://clientApp.example.com/metric_network_notifications/123456");
                expect(data.resourceURL).to.be.a('string');
                expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/network/subscription123");
                expect(data.networkQueryParams).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkQueryParams);
                      {
                    let dataCtr = data.networkQueryParams.tags;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.Tag);
                      expect(data.name).to.be.a('string');
                      expect(data.name).to.be("src");
                      expect(data.value).to.be.a('string');
                      expect(data.value).to.be("ue1-iperf");
                    }
                  }
                  {
                    let dataCtr = data.networkQueryParams.fields;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a('string');
                      expect(data).to.be("lat");
                    }
                  }
                  expect(data.networkQueryParams.scope).to.be.a(AdvantEdgeMetricsServiceRestApi.Scope);
                        expect(data.networkQueryParams.scope.limit).to.be.a('number');
                    expect(data.networkQueryParams.scope.limit).to.be(60);
                    expect(data.networkQueryParams.scope.duration).to.be.a('string');
                    expect(data.networkQueryParams.scope.duration).to.be("10s");
                expect(data.period).to.be.a('number');
                expect(data.period).to.be(1);
                expect(data.subscriptionType).to.be.a('string');
                expect(data.subscriptionType).to.be("period");
              }
            }
            expect(data.resourceURL).to.be.a('string');
            expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/network/subscription123");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('getNetworkSubscriptionById', function() {
        it('should call getNetworkSubscriptionById successfully', function(done) {
          // TODO: uncomment, update parameter values for getNetworkSubscriptionById call and complete the assertions
          /*
          var subscriptionId = "subscriptionId_example";

          instance.getNetworkSubscriptionById(subscriptionId, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkSubscription);
            expect(data.subscriptionId).to.be.a('string');
            expect(data.subscriptionId).to.be("1.2556487E7");
            expect(data.clientCorrelator).to.be.a('string');
            expect(data.clientCorrelator).to.be("83");
            expect(data.callbackReference).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkCallbackReference);
                  expect(data.callbackReference.notifyURL).to.be.a('string');
              expect(data.callbackReference.notifyURL).to.be("http://clientApp.example.com/metric_network_notifications/123456");
            expect(data.resourceURL).to.be.a('string');
            expect(data.resourceURL).to.be("http://localhost:8291/v2/subscriptions/network/subscription123");
            expect(data.networkQueryParams).to.be.a(AdvantEdgeMetricsServiceRestApi.NetworkQueryParams);
                  {
                let dataCtr = data.networkQueryParams.tags;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a(AdvantEdgeMetricsServiceRestApi.Tag);
                  expect(data.name).to.be.a('string');
                  expect(data.name).to.be("src");
                  expect(data.value).to.be.a('string');
                  expect(data.value).to.be("ue1-iperf");
                }
              }
              {
                let dataCtr = data.networkQueryParams.fields;
                expect(dataCtr).to.be.an(Array);
                expect(dataCtr).to.not.be.empty();
                for (let p in dataCtr) {
                  let data = dataCtr[p];
                  expect(data).to.be.a('string');
                  expect(data).to.be("lat");
                }
              }
              expect(data.networkQueryParams.scope).to.be.a(AdvantEdgeMetricsServiceRestApi.Scope);
                    expect(data.networkQueryParams.scope.limit).to.be.a('number');
                expect(data.networkQueryParams.scope.limit).to.be(60);
                expect(data.networkQueryParams.scope.duration).to.be.a('string');
                expect(data.networkQueryParams.scope.duration).to.be("10s");
            expect(data.period).to.be.a('number');
            expect(data.period).to.be(1);
            expect(data.subscriptionType).to.be.a('string');
            expect(data.subscriptionType).to.be("period");

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
    });
  });

}));
