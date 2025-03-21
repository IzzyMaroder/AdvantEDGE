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

import _ from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import * as YAML from 'yamljs';
import { Grid, GridCell, GridInner } from '@rmwc/grid';
import { Elevation } from '@rmwc/elevation';
import IDSelect from '../../components/helper-components/id-select';
import IDCMap from '../idc-map';
import IDCVis from '../idc-vis';
import CfgNetworkElementContainer from './cfg-network-element-container';
import CfgPageScenarioButtons from './cfg-page-scenario-buttons';

import HeadlineBar from '../../components/headline-bar';
import CfgTable from './cfg-table';
import IDOpenScenarioDialog from '../../components/dialogs/id-open-scenario-dialog';
import IDNewScenarioDialog from '../../components/dialogs/id-new-scenario-dialog';
import IDSaveScenarioDialog from '../../components/dialogs/id-save-scenario-dialog';
import IDDeleteScenarioDialog from '../../components/dialogs/id-delete-scenario-dialog';
import IDExportScenarioDialog from '../../components/dialogs/id-export-scenario-dialog';

import {
  cfgElemNew,
  cfgElemClone,
  cfgElemEdit,
  cfgElemClear,
  cfgElemSetErrMsg,
  cfgChangeScenario,
  cfgChangeScenarioList,
  cfgChangeState,
  CFG_ELEM_MODE_NEW
} from '../../state/cfg';

import {
  uiChangeCurrentDialog,
  uiCfgChangeView
} from '../../state/ui';

import {
  TYPE_CFG,
  CFG_STATE_LOADED,
  CFG_STATE_NEW,
  CFG_STATE_IDLE,
  CFG_VIEW_NETWORK,
  CFG_VIEW_MAP,
  CFG_VIEW_TYPE,
  PAGE_CONFIGURE,
  ELEMENT_TYPE_SCENARIO,
  IDC_DIALOG_OPEN_SCENARIO,
  IDC_DIALOG_NEW_SCENARIO,
  IDC_DIALOG_SAVE_SCENARIO,
  IDC_DIALOG_DELETE_SCENARIO,
  IDC_DIALOG_EXPORT_SCENARIO,
  ELEMENT_TYPE_POA_4G,
  ELEMENT_TYPE_POA_5G,
  ELEMENT_TYPE_POA_WIFI
} from '../../meep-constants';

import {
  FIELD_TYPE,
  FIELD_PARENT,
  FIELD_NAME,
  FIELD_INGRESS_SVC_MAP,
  FIELD_EXT_PORT,
  FIELD_GPU_COUNT,
  FIELD_GPU_TYPE,
  getElemFieldVal,
  resetElem,
  FIELD_CELL_ID,
  FIELD_NR_CELL_ID,
  FIELD_MAC_ID,
  FIELD_CPU_MIN,
  FIELD_CPU_MAX,
  FIELD_MEMORY_MIN,
  FIELD_MEMORY_MAX
} from '../../util/elem-utils';

import { pipe, filter } from '../../util/functional';

const firstElementIfPresent = val =>
  Array.isArray(val) ? (val.length ? val[0] : null) : val;
const notNull = x => x;
const extractPort = svcMapEntry =>
  Number(firstElementIfPresent(svcMapEntry.split(':')));

const externalPorts = elem => {
  return getElemFieldVal(elem, FIELD_INGRESS_SVC_MAP)
    .split(',')
    .map(extractPort)
    .filter(notNull)
    .concat([Number(getElemFieldVal(elem, FIELD_EXT_PORT))].filter(notNull));
};

const hasExtPortsInCommon = elem1 => elem2 => {
  const ports1 = externalPorts(elem1);
  const ports2 = externalPorts(elem2);
  const intersection = _.intersection(ports1, ports2);
  return intersection.length;
};

const hasDifferentName = elem1 => elem2 => elem1.name.val !== elem2.name.val;

// Validate new network element form field entries
export const validateNetworkElement = (element, entries, elemSetErrMsg) => {
  var data = entries;

  // Clear previous error message
  elemSetErrMsg('');

  // Verify that no field is in error
  var fieldsInError = 0;
  _.forOwn(element, val => (fieldsInError = val.err ? fieldsInError + 1 : fieldsInError));
  if (fieldsInError) {
    elemSetErrMsg(`${fieldsInError} fields in error`);
    return false;
  }

  // Verify element type
  var type = getElemFieldVal(element, FIELD_TYPE);
  if (type === null) {
    elemSetErrMsg('Missing element type');
    return false;
  }

  // Check for valid & unique network element name (except if editing)
  var name = getElemFieldVal(element, FIELD_NAME);
  if (name === null || name === '') {
    elemSetErrMsg('Missing element name');
    return false;
  }

  if (data[name] && data[name].id !== element.id) {
    elemSetErrMsg('Element name already exists');
    return false;
  }

  // Nothing else to validate for Scenario element
  if (type === ELEMENT_TYPE_SCENARIO) {
    return true;
  }

  // Make sure parent exists
  if (!data[getElemFieldVal(element, FIELD_PARENT)]) {
    elemSetErrMsg('Parent does not exist');
    return false;
  }

  // If GPU requested, make sure type is set
  var gpuCount = getElemFieldVal(element, FIELD_GPU_COUNT);
  if (gpuCount) {
    var gpuType = getElemFieldVal(element, FIELD_GPU_TYPE);
    if (gpuType === null || gpuType === '') {
      elemSetErrMsg('GPU type not selected');
      return false;
    }
  }

  // If CPU limitations is requested, making sure Min CPU <= Max CPU
  var cpuMin = getElemFieldVal(element, FIELD_CPU_MIN);
  var cpuMax = getElemFieldVal(element, FIELD_CPU_MAX);
  if (cpuMin !== null && cpuMax !== null) {
    if (parseFloat(cpuMin) > parseFloat(cpuMax)) {
      elemSetErrMsg('Min CPU > Max CPU');
      return false;
    }
  }

  // If Memory limitations is requested, making sure Min Memory <= Max Memory
  var memoryMin = getElemFieldVal(element, FIELD_MEMORY_MIN);
  var memoryMax = getElemFieldVal(element, FIELD_MEMORY_MAX);
  if (memoryMin !== null && memoryMax !== null) {
    if (parseInt(memoryMin) > parseInt(memoryMax)) {
      elemSetErrMsg('Min Memory > Max Memory');
      return false;
    }
  }

  // Verify cellid/mac address if required
  if (type === ELEMENT_TYPE_POA_4G) {
    var cellId = getElemFieldVal(element, FIELD_CELL_ID);
    if (!cellId) {
      elemSetErrMsg('Missing Cell ID');
      return false;
    }
  } else if (type === ELEMENT_TYPE_POA_5G) {
    var nrCellId = getElemFieldVal(element, FIELD_NR_CELL_ID);
    if (!nrCellId) {
      elemSetErrMsg('Missing NR Cell ID');
      return false;
    }
  } else if (type === ELEMENT_TYPE_POA_WIFI) {
    var macId = getElemFieldVal(element, FIELD_MAC_ID);
    if (!macId) {
      elemSetErrMsg('Missing MAC Address');
      return false;
    }
  }

  // TODO -- verify node port not already used
  const extPorts = externalPorts(element);

  if (extPorts.length) {
    const elemsWithSameExtPort = pipe(
      filter(hasDifferentName(element)),
      filter(hasExtPortsInCommon(element))
    )(Object.values(data));

    if (elemsWithSameExtPort.length) {
      const elemNames = elemsWithSameExtPort.map((e) =>getElemFieldVal(e, FIELD_NAME));
      elemSetErrMsg(`External port already used in ${elemNames}`);
      return false;
    }
  }

  return true;
};

class CfgPageContainer extends Component {
  constructor(props) {
    super(props);
  }

  // ----------------------------------------
  // NETWORK ELEMENT CONFIGURATION
  // ----------------------------------------

  // NEW
  onNewElement() {
    this.props.cfgElemNew();
  }

  // EDIT
  onEditElement(element) {
    if (element !== null) {
      if (!this.props.configuredElement || (element.id !== this.props.configuredElement.id)) {
        resetElem(element);
        this.props.cfgElemEdit(element);
      }
    } else {
      this.props.cfgElemClear();
    }
  }

  // SAVE
  onSaveElement(element) {
    // Validate network element
    if (!validateNetworkElement(element, this.props.cfg.table.entries, this.props.cfgElemSetErrMsg)) {
      return;
    }

    // Add/update element in scenario
    if (this.props.cfg.elementConfiguration.configurationMode === CFG_ELEM_MODE_NEW) {
      this.props.newScenarioElem(element, true);
    } else {
      this.props.updateScenarioElem(element);
    }

    // Reset Element configuration pane
    this.props.cfgElemClear();
  }

  // CLONE
  onCloneElement() {
    this.props.cfgElemClone();
  }

  // CLONE
  onApplyCloneElement(element) {
    // Validate network element
    if (!validateNetworkElement(element, this.props.cfg.table.entries, this.props.cfgElemSetErrMsg)) {
      return;
    }

    this.props.cloneScenarioElem(element);

    //force update on the visual aspect of the scenario
    //this.props.updateScenario();

    this.props.cfgElemClear();
  }

  // DELETE
  onDeleteElement(element) {
    this.props.deleteScenarioElem(element);
    this.props.cfgElemClear();
  }

  // CANCEL
  onCancelElement(e) {
    e.preventDefault();
    this.props.cfgElemClear();
  }

  // Edit Location
  onEditLocation() {
    this.toggleCfgView();
  }

  // Edit Path
  onEditPath() {
    this.toggleCfgView();
  }

  toggleCfgView() {
    if (this.props.cfgView === CFG_VIEW_NETWORK) {
      this.props.changeView(CFG_VIEW_MAP);
    } else {
      this.props.changeView(CFG_VIEW_NETWORK);
    }
  }

  findOtherThanSelfIndexByKeyValue(_array, key, value, exceptionId) {
    for (var i = 0; i < _array.length; i++) {
      if (getElemFieldVal(_array[i], key) === value) {
        if (_array[i].id !== exceptionId) {
          return i;
        }
      }
    }
    return -1;
  }

  // ----------------------------------------
  // SCENARIO CONFIGURATION
  // ----------------------------------------

  /**
   * Callback function to receive the result of the getScenario operation.
   * @callback module:api/ScenarioConfigurationApi~getScenarioCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Scenario} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */
  getScenarioLoadCb(error, data /*, response*/) {
    if (error !== null) {
      // TODO: consider showgina an alert
      return;
    }

    // Store & process loaded scenario
    this.props.setScenario(data);
    this.setPageState(CFG_STATE_LOADED);
  }

  /**
   * Callback function to receive the result of the getScenarioList operation.
   * @callback module:api/ScenarioConfigurationApi~getScenarioListCallback
   * @param {String} error Error message, if any.
   * @param {module:model/ScenarioList} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */
  getScenarioListLoadCb(error, data /*, response*/) {
    if (error !== null) {
      // TODO: consider showgina an alert
      return;
    }
    if (!data.scenarios) {
      return;
    }

    this.props.changeScenarioList(_.map(data.scenarios, 'name'));
  }

  /**
   * Callback function to receive the result of the getScenario operation.
   * @callback module:api/ScenarioConfigurationApi~getScenarioCallback
   * @param {String} error Error message, if any.
   * @param {module:model/Scenario} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */
  getScenarioImportCb(error /* data, response*/) {
    // Update configuration page state based on whether scenario already exists
    if (error === null) {
      // TODO: consider showgina an alert
      this.setPageState(CFG_STATE_LOADED);
    } else {
      this.setPageState(CFG_STATE_NEW);
    }
  }

  /**
   * Callback function to receive the result of the createScenario operation.
   * @callback module:api/ScenarioConfigurationApi~createScenarioCallback
   * @param {String} error Error message, if any.
   * @param data This operation does not return a value.
   * @param {String} response The complete HTTP response.
   */
  createScenarioCb(error /*data, response*/) {
    // Update configuration page state based on whether scenario was successfully created
    if (error === null) {
      // TODO: consider showgina an alert
      this.setPageState(CFG_STATE_LOADED);
    } else {
      // TODO: consider showgina an alert
      this.setPageState(CFG_STATE_NEW);
    }
  }

  /**
   * Callback function to receive the result of the setScenario operation.
   * @callback module:api/ScenarioConfigurationApi~setScenarioCallback
   * @param {String} error Error message, if any.
   * @param data This operation does not return a value.
   * @param {String} response The complete HTTP response.
   */
  setScenarioCb(error /* data, response*/) {
    // Update configuration page state based on whether scenario was successfully saved
    if (error === null) {
      // TODO: consider showgina an alert
      this.setPageState(CFG_STATE_LOADED);
    } else {
      // TODO: consider showgina an alert
      this.setPageState(CFG_STATE_NEW);
    }
  }

  /**
   * Callback function to receive the result of the deleteScenario operation.
   * @callback module:api/ScenarioConfigurationApi~deleteScenarioCallback
   * @param {String} error Error message, if any.
   * @param data This operation does not return a value.
   * @param {String} response The complete HTTP response.
   */
  deleteScenarioCb(error /* data, response*/) {
    if (error !== null) {
      // TODO: consider showgina an alert
    }
    // TODO: consider showing an alert

    // Delete scenario
    this.props.deleteScenario();
    this.setPageState(CFG_STATE_IDLE);
  }

  // Update configuration page state
  setPageState(state) {
    this.props.changeState(state);
    this.props.cfgElemClear();
  }

  // Create & Process new scenario
  createScenario(name) {
    this.props.createScenario(name);
    this.setPageState(CFG_STATE_NEW);
  }

  // Save currently configured scenario
  saveScenario(name) {
    var cfg = this.props.cfg;

    const scenarioName = name || cfg.scenario.name;
    const scenarioCopy = JSON.parse(JSON.stringify(cfg.scenario));
    scenarioCopy.name = scenarioName;

    // Create new scenario if scenario is new
    if (cfg.state === CFG_STATE_NEW || scenarioName !== cfg.scenario.name) {
      this.props.api.createScenario(
        scenarioName,
        scenarioCopy,
        (error, data, response) => this.createScenarioCb(error, data, response)
      );
    } else {
      this.props.api.setScenario(
        scenarioName,
        scenarioCopy,
        (error, data, response) => this.setScenarioCb(error, data, response)
      );
    }

    this.props.changeScenario(scenarioCopy);
  }

  // Delete saved scenario
  deleteScenario() {
    var cfg = this.props.cfg;

    this.props.api.deleteScenario(cfg.scenario.name, (error, data, response) =>
      this.deleteScenarioCb(error, data, response)
    );
  }

  // CLOSE DIALOG
  closeDialog() {
    this.props.changeCurrentDialog(Math.random());
  }

  // SAVE SCENARIO DIALOG
  onSaveScenario() {
    this.props.changeCurrentDialog(IDC_DIALOG_SAVE_SCENARIO);
  }

  // DELETE SCENARIO DIALOG
  onDeleteScenario() {
    this.props.changeCurrentDialog(IDC_DIALOG_DELETE_SCENARIO);
  }

  // NEW SCENARIO DIALOG
  onNewScenario() {
    this.props.changeCurrentDialog(IDC_DIALOG_NEW_SCENARIO);
  }

  // OPEN SCENARIO DIALOG
  onOpenScenario() {
    // Retrieve list of available scenarios
    this.props.api.getScenarioList((error, data, response) => {
      this.getScenarioListLoadCb(error, data, response);
    });
    this.props.changeCurrentDialog(IDC_DIALOG_OPEN_SCENARIO);
  }

  // EXPORT SCENARIO DIALOG
  onExportScenario() {
    this.props.changeCurrentDialog(IDC_DIALOG_EXPORT_SCENARIO);
  }

  // IMPORT SCENARIO
  onScenarioInputChange(elem) {
    const props = this.props;
    const self = this;

    if (elem.value) {
      var reader = new FileReader();
      reader.onload = function(event) {
        // Parse imported Scenario
        var importedScenario;
        try {
          importedScenario = YAML.parse(
            event.target.result.replace(/\bNaN\b/g, 'null')
          );
          // importedScenario = JSON.parse(event.target.result);
        } catch (e) {
          // TODO: consider showing an alert
          return;
        }

        // Store & Process imported scenario
        props.setScenario(importedScenario);

        // Retrieve list of stored scenarios
        props.api.getScenario(
          importedScenario.name,
          (error, data, response) => {
            self.getScenarioImportCb(error, data, response);
          }
        );
      };
      reader.readAsText(elem.files[0]);
      elem.value = null;
    }
  }

  renderDialogs() {
    return (
      <>
        <IDNewScenarioDialog
          title='Create New Scenario'
          open={this.props.currentDialog === IDC_DIALOG_NEW_SCENARIO}
          onClose={() => {
            this.closeDialog();
          }}
          api={this.props.api}
          createScenario={name => this.createScenario(name)}
        />

        <IDSaveScenarioDialog
          title='Save Scenario'
          open={this.props.currentDialog === IDC_DIALOG_SAVE_SCENARIO}
          onClose={() => {
            this.closeDialog();
          }}
          api={this.props.api}
          scenarioName={this.props.scenarioName}
          saveScenario={name => this.saveScenario(name)}
        />

        <IDOpenScenarioDialog
          title='Open Scenario'
          open={this.props.currentDialog === IDC_DIALOG_OPEN_SCENARIO}
          options={this.props.scenarios}
          onClose={() => {
            this.closeDialog();
          }}
          api={this.props.api}
          getScenarioLoadCb={(error, data, response) =>
            this.getScenarioLoadCb(error, data, response)
          }
        />

        <IDDeleteScenarioDialog
          title='Delete Scenario'
          open={this.props.currentDialog === IDC_DIALOG_DELETE_SCENARIO}
          onClose={() => {
            this.closeDialog();
          }}
          api={this.props.api}
          deleteScenario={() => this.deleteScenario()}
        />

        <IDExportScenarioDialog
          title='Export Current Configuration'
          open={this.props.currentDialog === IDC_DIALOG_EXPORT_SCENARIO}
          onClose={() => {
            this.closeDialog();
          }}
          scenario={this.props.cfg.scenario}
          scenarioName={this.props.scenarioName}
        />
      </>
    );
  }

  render() {
    if (this.props.page !== PAGE_CONFIGURE) {
      return null;
    }

    return (
      <div style={styles.page}>
        {this.renderDialogs()}

        <Grid style={styles.headlineGrid}>
          <GridCell span={12}>
            <Elevation
              className='idcc-elevation'
              z={2}
              style={styles.headline}
            >
              <GridInner>
                <IDSelect
                  label='View'
                  span={2}
                  options={[CFG_VIEW_NETWORK, CFG_VIEW_MAP]}
                  onChange={(e) => this.props.changeView(e.target.value)}
                  value={this.props.cfgView}
                  disabled={false}
                  cydata={CFG_VIEW_TYPE}
                />
                <GridCell align={'middle'} span={3}>
                  <GridInner style={{ marginLeft: 10, height: '100%', borderLeft: '2px solid #e4e4e4'}}>
                    <GridCell align={'middle'} style={{ marginLeft: 20}} span={12}>
                      <HeadlineBar
                        titleLabel='Scenario'
                        scenarioName={this.props.scenarioName}
                      />
                    </GridCell>
                  </GridInner>
                </GridCell>
                <GridCell align={'middle'} span={7}>
                  <GridInner align={'right'}>
                    <GridCell span={12}>
                      <CfgPageScenarioButtons
                        {...this.props}
                        onDeleteScenario={() => {
                          this.onDeleteScenario();
                        }}
                        onSaveScenario={() => {
                          this.onSaveScenario();
                        }}
                        onNewScenario={() => {
                          this.onNewScenario();
                        }}
                        onOpenScenario={() => {
                          this.onOpenScenario();
                        }}
                        onInputScenario={elem =>
                          this.onScenarioInputChange(elem)
                        }
                        onExportScenario={() => this.onExportScenario()}
                      />
                    </GridCell>
                  </GridInner>
                </GridCell>
              </GridInner>
            </Elevation>
          </GridCell>
        </Grid>

        {this.props.cfgState !== CFG_STATE_IDLE && (
          <>
            <Grid style={{ width: '100%'}}>
              <GridInner>
                <GridCell span={8}>
                  <Elevation className='idcc-elevation' z={2}>
                    <div style={styles.vis}>
                      {this.props.cfgView === CFG_VIEW_NETWORK && (
                        <IDCVis
                          type={TYPE_CFG}
                          width='100%'
                          height='100%'
                          onEditElement={elem => this.onEditElement(elem)}
                        />
                      )}
                      {this.props.cfgView === CFG_VIEW_MAP && (
                        <IDCMap
                          type={TYPE_CFG}
                          onEditElement={elem => this.onEditElement(elem)}
                        />
                      )}
                    </div>
                  </Elevation>
                </GridCell>
                <GridCell span={4} style={styles.inner}>
                  <Elevation className='idcc-elevation' z={2}>
                    <CfgNetworkElementContainer
                      style={{ height: '100%' }}
                      onNewElement={() => this.onNewElement()}
                      onSaveElement={elem => this.onSaveElement(elem)}
                      onDeleteElement={elem => this.onDeleteElement(elem)}
                      onApplyCloneElement={elem => this.onApplyCloneElement(elem)}
                      onCancelElement={e => this.onCancelElement(e)}
                      onEditLocation={elem => this.onEditLocation(elem)}
                      onEditPath={elem => this.onEditPath(elem)}
                      type={TYPE_CFG}
                    />
                  </Elevation>
                </GridCell>
              </GridInner>
            </Grid>

            <div style={{ width: '100%' }}>
              <CfgTable
                type={TYPE_CFG}
                onNewElement={() => this.onNewElement()}
                onEditElement={elem => this.onEditElement(elem)}
                onDeleteElement={() => this.onDeleteElement()}
                onApplyCloneElement={elem => this.onApplyCloneElement(elem)}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

const styles = {
  headlineGrid: {
    marginBottom: 10
  },
  headline: {
    padding: 10
  },
  inner: {
    height: '100%'
  },
  page: {
    height: '100%',
    marginBottom: 10,
    width: '100%',
    marginRight: 100
  },
  cfgTable: {
    marginTop: 20,
    padding: 10
  },
  vis: {
    padding: 10,
    height: '70vh',
    minHeight: 600
  }
};

const mapStateToProps = state => {
  return {
    cfg: state.cfg,
    cfgState: state.cfg.state,
    cfgView: state.ui.cfgView,
    configuredElement: state.cfg.elementConfiguration.configuredElement,
    table: state.cfg.table,
    selectedElements: state.cfg.table.selected,
    currentDialog: state.ui.currentDialog,
    scenarios: state.cfg.apiResults.scenarios,
    page: state.ui.page,
    scenarioName: state.cfg.scenario.name
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cfgElemNew: elem => dispatch(cfgElemNew(elem)),
    cfgElemClone: elem => dispatch(cfgElemClone(elem)),
    cfgElemEdit: elem => dispatch(cfgElemEdit(elem)),
    cfgElemClear: elem => dispatch(cfgElemClear(elem)),
    cfgElemSetErrMsg: msg => dispatch(cfgElemSetErrMsg(msg)),
    changeCurrentDialog: type => dispatch(uiChangeCurrentDialog(type)),
    changeScenarioList: scenarios => dispatch(cfgChangeScenarioList(scenarios)),
    changeState: s => dispatch(cfgChangeState(s)),
    changeScenario: scenario => dispatch(cfgChangeScenario(scenario)),
    changeView: view => dispatch(uiCfgChangeView(view))
  };
};

const ConnectedCfgPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CfgPageContainer);

export default ConnectedCfgPageContainer;
