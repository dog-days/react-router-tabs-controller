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
    const {
      pageTabs,
      activedTab,
      switchTab,
      deleteTab,
      i18n: { t, switchLanguage },
    } = this.props;
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
                <Link to="/main/index">{t('主页')}</Link>
              </li>
              <li>
                <Link to="/main/about/id/1003">{t('关于')}</Link>
              </li>
              <li>
                <Link to="/main/test">{t('test')}</Link>
              </li>
              <li
                onClick={e => {
                  switchLanguage('zh_CN');
                }}
                className="language"
              >
                <a>中文</a>
              </li>
              <li
                onClick={e => {
                  switchLanguage('en_US');
                }}
                className="language"
              >
                <a>英文</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="main-contents" style={{ paddingTop: 10 }}>
          {pageTabs && (
            <Tabs
              hideAdd
              activeKey={activedTab}
              onChange={targetKey => {
                switchTab(targetKey);
              }}
              onEdit={(targetKey, action) => {
                if (action === 'remove') {
                  deleteTab(targetKey);
                }
              }}
              type={pageTabs.length === 1 ? 'card' : 'editable-card'}
            >
              {pageTabs.map((v, k) => {
                return (
                  <TabPane tab={v.title} key={v.tabId} closable={true}>
                    {v.component && <v.component />}
                  </TabPane>
                );
              })}
            </Tabs>
          )}
        </div>
      </div>
    );
  }
}

export default MainLayout;
