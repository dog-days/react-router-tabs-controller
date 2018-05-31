import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';

import logo from 'src/style/img/logo.svg';
import 'antd/dist/antd.css';
import 'src/style/css/bootstrap.css';
import 'src/style/css/layout-main.css';

const TabPane = Tabs.TabPane;

class MainLayout extends React.Component {
  render() {
    const { pageTabs, activedTab, switchTab } = this.props;
    return (
      <div className="layout-container">
        <nav className="navbar navbar-inverse ">
          <div className="navbar-header">
            <ul className="nav navbar-nav">
              <li className="logo-con">
                <a>
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
              </li>
              <li>
                <Link to="/main/index">主页</Link>
              </li>
              <li>
                <Link to="/main/about/id/1003">关于</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="main-contents">
          <Tabs
            activeKey={activedTab}
            onChange={value => {
              switchTab(value);
            }}
          >
            {pageTabs &&
              pageTabs.map((v, k) => {
                return (
                  <TabPane tab={v.title} key={v.tabId}>
                    {v.component && <v.component />}
                  </TabPane>
                );
              })}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default MainLayout;
