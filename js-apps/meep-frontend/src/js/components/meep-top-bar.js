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
import React, { Component }  from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';

import { Toolbar, ToolbarRow, ToolbarSection } from '@rmwc/toolbar';
import { Elevation } from '@rmwc/elevation';
import { TabBar, Tab } from '@rmwc/tabs';
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';
import { Icon } from '@rmwc/icon';
import { IconButton } from '@rmwc/icon-button';
import { Menu, MenuItem, MenuSurfaceAnchor } from '@rmwc/menu';

import {
  uiChangeCurrentPage,
  uiChangeUserMenuDisplay,
  uiChangeCurrentTab
} from '@/js/state/ui';

import {
  MEEP_TAB_EXEC,
  MEEP_TAB_MON,
  MEEP_TAB_SET,
  MEEP_TAB_CFG,
  MEEP_TAB_HOME,
  PAGE_EXECUTE,
  PAGE_MONITOR,
  PAGE_SETTINGS,
  PAGE_CONFIGURE,
  PAGE_HOME,
  STATUS_SIGNED_IN,
  STATUS_SIGNED_OUT,
  STATUS_SIGNIN_NOT_SUPPORTED,
  PAGE_HOME_INDEX,
  PAGE_CONFIGURE_INDEX,
  PAGE_EXECUTE_INDEX,
  PAGE_MONITOR_INDEX,
  PAGE_SETTINGS_INDEX,
  MEEP_HELP_GUI_URL
} from '@/js/meep-constants';

const CorePodsLed = props => {
  /*eslint-disable */
  const greenLed = require('@/img/green-led.png');
  const redLed = require('@/img/red-led.png');
  /* eslint-enable */
  const tooltipType = props.corePodsRunning ? 'success' : 'error';
  const marginLeft = { marginLeft: -35 };
  return (
    <div>
      { props.signInStatus === STATUS_SIGNED_IN || props.signInStatus === STATUS_SIGNIN_NOT_SUPPORTED ?
        <>
          <a data-tip data-for='led'>
            <img
              src={props.corePodsRunning ? greenLed : redLed}
              height={30}
              width={30}
              style={{ marginRight: 15, marginTop: 3 }}
            />
          </a>
          <ReactTooltip
            id='led'
            aria-haspopup='true'
            role='example'
            place='left'
            type={tooltipType}
          >
            <ul style={{ listStyle: 'none' }}>
              {props.corePodsErrors.length ? (
                _.map(props.corePodsErrors, e => {
                  return (
                    <li key={e.name} style={marginLeft}>
                      {`${e.name}: ${e.status}`}
                    </li>
                  );
                })
              ) : (
                <span style={marginLeft}>All systems GO!</span>
              )}
            </ul>
          </ReactTooltip>
        </>
        : null
      }
    </div>
  );
};

class MeepTopBar extends Component {
  constructor(props) {
    super(props);
    /*eslint-disable */
    this.logo = require('@/img/ID-Icon-01-idcc.svg');
    this.advantEdge = require('@/img/AdvantEDGE-logo-NoTagline_White_RGB.png');
    /* eslint-enable */
  }

  componentWillMount() {
    this.props.changeUserMenuDisplay(false);
  }

  handleItemClick(page, tabIndex) {
    this.props.changeUserMenuDisplay(false);
    if (this.props.currentPage !== page) {
      this.props.changeCurrentPage(page);
      this.props.changeTabIndex(tabIndex);
    }
  }

  render() {
    let hideTabs = !(this.props.signInStatus === STATUS_SIGNED_IN ||
      this.props.signInStatus === STATUS_SIGNIN_NOT_SUPPORTED);
    return (
      <div>
        <Toolbar fixed style={{ zIndex: 9000 }}>
          <Elevation z={2}>
            <ToolbarRow>
              <ToolbarSection alignStart style={{display:'contents'}}>
                <div style={styles.flex}>
                  <img
                    id='idcc-logo'
                    className='idcc-toolbar-menu mdc-top-app-bar__navigation-icon'
                    src={this.logo}
                    alt=''
                    onClick={() => this.handleItemClick(PAGE_HOME, PAGE_HOME_INDEX)}
                  />

                  <img id='AdvantEdgeLogo' height={50} src={this.advantEdge} alt='' />

                  <TabBar
                    className='menu-tabs'
                    activeTabIndex={this.props.activeTabIndex}
                    onActivate={evt => this.props.changeTabIndex(evt.detail.index)}
                  >
                    <Tab
                      data-cy={MEEP_TAB_HOME}
                      label="Home"
                      onClick={() => { this.handleItemClick(PAGE_HOME, PAGE_HOME_INDEX); }}
                    />
                    <Tab
                      hidden={hideTabs}
                      data-cy={MEEP_TAB_CFG}
                      style={{visibility:hideTabs?'hidden':null}}
                      label="Configure"
                      onClick={() => { this.handleItemClick(PAGE_CONFIGURE, PAGE_CONFIGURE_INDEX); }}
                    />
                    <Tab
                      data-cy={MEEP_TAB_EXEC}
                      style={{visibility:hideTabs?'hidden':null}}
                      label="Execute"
                      onClick={() => { this.handleItemClick(PAGE_EXECUTE, PAGE_EXECUTE_INDEX); }}
                    />
                    <Tab
                      data-cy={MEEP_TAB_MON}
                      style={{visibility:hideTabs?'hidden':null}}
                      label="Monitor"
                      onClick={() => { this.handleItemClick(PAGE_MONITOR, PAGE_MONITOR_INDEX); }}
                    />
                    <Tab
                      data-cy={MEEP_TAB_SET}
                      style={{visibility:hideTabs?'hidden':null}}
                      label="Settings"
                      onClick={() => { this.handleItemClick(PAGE_SETTINGS, PAGE_SETTINGS_INDEX); }}
                    />
                  </TabBar>
                </div>
              </ToolbarSection>

              <ToolbarSection alignEnd>
                <div style={styles.flex}>
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      window.open(MEEP_HELP_GUI_URL,'_blank');
                    }}
                  >
                    <Icon
                      title="GUI Help Page"
                      icon="help_outline"
                      iconOptions={{ size: 'large', strategy: 'ligature' }}
                      style={styles.helpIcon}
                    />
                  </Button>

                  <CorePodsLed
                    corePodsRunning={this.props.corePodsRunning}
                    corePodsErrors={this.props.corePodsErrors}
                    signInStatus={this.props.signInStatus}
                  />

                  { this.props.signInStatus === STATUS_SIGNED_IN ?
                    <MenuSurfaceAnchor style={{ height: 48 }}>
                      <Menu
                        open={this.props.userMenuDisplay}
                        onSelect={() => {}}
                        onClose={() => this.props.changeUserMenuDisplay(false)}
                        anchorCorner={'bottomLeft'}
                        align={'left'}
                        style={{ whiteSpace: 'nowrap', marginTop: 15, marginRight: 15}}
                      >
                        <MenuItem>
                          <Typography use="body1">Signed in as <b>{this.props.signInUsername}</b></Typography>
                        </MenuItem>
                        <div style={{ width: '100%', borderTop: '1px solid #e4e4e4'}} />
                        <MenuItem onClick={() => {
                          this.props.onClickSignIn();
                          this.props.changeUserMenuDisplay(false);
                        }}>
                          <Typography use="body1">Sign out</Typography>
                        </MenuItem>
                      </Menu>
                      <IconButton
                        icon="account_circle"
                        className='user-icon'
                        style={styles.icon}
                        onClick={() => this.props.changeUserMenuDisplay(true)}
                      />
                    </MenuSurfaceAnchor>
                    : null
                  }

                  { this.props.signInStatus === STATUS_SIGNED_OUT ?
                    <Button
                      style={styles.btnSignin}
                      onClick={() => this.props.onClickSignIn()}
                    >
                    SIGN IN
                    </Button>
                    : null 
                  } 
                </div>
              </ToolbarSection>
            </ToolbarRow>
          </Elevation>
        </Toolbar>
      </div>
    );
  }
}

const styles = {
  helpIcon: {
    color: '#ffffff'
  },
  icon: {
    color: '#ffffff',
    padding: 5,
    marginRight: 10
  },
  btnSignin: {
    color: 'white',
    border: 'none',
    borderRadius: 0
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48
  }
};

const mapDispatchToProps = dispatch => {
  return {
    changeCurrentPage: page => dispatch(uiChangeCurrentPage(page)),
    changeTabIndex: index => dispatch(uiChangeCurrentTab(index)),
    changeUserMenuDisplay: val => dispatch(uiChangeUserMenuDisplay(val))
  };
};

const mapStateToProps = state => {
  return {
    currentPage: state.ui.page,
    userMenuDisplay: state.ui.userMenuDisplay,
    signInStatus: state.ui.signInStatus,
    signInUsername: state.ui.signInUsername,
    activeTabIndex: state.ui.activeTabIndex
  };
};

const ConnectedMeepTopBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeepTopBar);

export default ConnectedMeepTopBar;
