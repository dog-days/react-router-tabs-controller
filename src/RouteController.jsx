import React from 'react';

import PropTypes from 'prop-types';
import { getParams, stringAdapter, randomKey, pathnameAdapter } from './util';
import * as storage from './storage';
import { ControllerConfig } from './Controller';
import DefaultNotMatchComponent from './DefaultNotMatchComponent';

//controller实例化存储，已实例化的controller，从这里取出来，key值是controllerId
const controllerNewObjs = {};
/**
 * 路由控制器React组件，配合Router使用
 *@prop { string } historyType history类型hash、browser、memory，目前还没使用到，保留
 *@state { object } config 路由的一些配置
 *@this { string } pathname 相当与上个页面的pathname，切换页面会变化。
 *@this { boolean } hot 开启热替换，热替换跟生产环境的会有点不一样
 *@this { boolean } preact preact和react的热替换有点不一样
 */
class RouteController extends React.Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired,
      staticContext: PropTypes.object,
    }).isRequired,
  };
  displayName = 'RouteController';
  state = {};
  history = this.context.router.history;
  /**
   * 根据history的值获取pathname
   */
  getPathNameByHistory() {
    const history = this.history;
    var pathname = history.location.pathname;
    if (pathname === '') {
      pathname = '/';
    }
    return pathname;
  }
  /**
   * 获取controlerId、viewId和参数
   */
  get pathnameParams() {
    return getParams(this.history.location.pathname);
  }
  /**
   * 获取页面配置提供给react-router使用，这里是关键的一部。
   *@param {string} pathanme react-router中的history的location.pathname || location.hash，不是浏览器的location
   *@param { object } pluginsConfig 插件配置
   */
  getViewConfig(pathname, pluginsConfig = {}) {
    var params = getParams(pathname);
    var controllerId = params.controllerId;
    var viewId = params.viewId;
    var funcName = stringAdapter(viewId) + 'View';
    return ControllerConfig.readControllerFile(controllerId).then(controller => {
      if (!controller) {
        return false;
      }
      //这里同一个controller只实例化一次
      var controllerObj;
      const { hot } = this.props;
      if (controllerNewObjs[controllerId] && !hot) {
        controllerObj = controllerNewObjs[controllerId];
      } else {
        controllerObj = new controller();
        controllerNewObjs[controllerId] = controllerObj;
      }
      if (!controllerObj[funcName]) {
        return false;
      }
      var config = controllerObj[funcName](params, pluginsConfig);
      return config;
    });
  }
  /**
   * @param { object } pluginsConfig 插件配置
   */
  setConfig(pluginsConfig) {
    if (!pluginsConfig) {
      pluginsConfig = this.state.pluginsConfig;
    }
    var pathname = this.getPathNameByHistory();
    return this.getViewConfig(pathname, pluginsConfig).then(config => {
      if (!config && pathname === '/') {
        const history = this.history;
        //这里围绕着主页重定向导致的一些问题，做了一些处理。
        //这里需要赋值，不赋值重定向有问题。
        this.pathname = '/';
        //防止pathname='/'，重定向时，导致this.state.pluginsConfig为undefined问题。
        this.setState({
          pluginsConfig,
        });
        //这里进行了重定向
        if (Object.prototype.toString.apply(ControllerConfig.indexPath) === '[object Function]') {
          history.replace(ControllerConfig.indexPath());
        } else {
          history.replace(ControllerConfig.indexPath);
        }
        //输入域名访问，重定向到设定主页
        this.indexRedirect = true;
        return false;
      }
      var lastConfig;
      if (config && config.component) {
        lastConfig = config;
      } else {
        //如果config为false，为404页面
        lastConfig = {
          component: ControllerConfig.NotMatchComponent || DefaultNotMatchComponent,
        };
        document.title = '404 not found';
      }
      this.setState({
        config: lastConfig,
        pluginsConfig,
      });
      return lastConfig;
    });
  }
  /**
   * 这里的判断基本都是相等了才会返回通过
   * this.hot和this.pathname都是这样，
   * 因为切换页面时，会首先运行一次以前的页面，然后才会切换至新的页面，
   * 这里就是为了解决切换时重复渲染的问题。
   */
  shouldComponentUpdate(nextProps, nextState) {
    //begin--热替换开启处理
    const { hot, preact } = nextProps;
    if (hot !== this.hot) {
      if (preact) {
        //preact热替换跟react有点不一样
        return true;
      }
      //hot不相等时，不渲染上个未变化的页面
      this.hot = hot;
      return false;
    }
    //begin--热替换开启处理
    var pathname = this.getPathNameByHistory();
    //整个页面重载，this.pathname为undefined
    if (this.pathname === undefined) {
      //这里也必须赋值
      this.pathname = pathname;
      return true;
    } else if (this.pathname === pathname) {
      //切换页面时，首先会触发一次componentWillReceiveProps，不需要重渲染
      //然后componentWillReceiveProps相应的触发setConfig
      //setConfig里面触发了setState，改变了state中config的值，这个时候才需要渲染
      //pathname要相等才渲染，因为this.pathname在下面被重新赋值了
      return true;
    } else {
      //页面切换componentWillReceiveProps运行过后，这里也会运行一次，但是不需要重新渲染，
      //然后componentWillReceiveProps里运行的setConfig触发state变化后，
      //这个函数还会运行一遍，然后返回true，render函数就渲染出切换的页面。
      //这里this.pathname赋了新值，跟当前页面的pathname相等了，是否渲染切换后的页面就根据this.pathname来判断了
      this.pathname = pathname;
      return false;
    }
  }
  componentDidMount() {
    var configPromises =
      ControllerConfig.plugins &&
      ControllerConfig.plugins.reduce((ret, v) => {
        var result = v(this);
        //如果不是promie对象
        if (!result.then && !result.catch) {
          result = new Promise(function(resolve, reject) {
            resolve(result);
          });
        }
        ret.push(result);
        return ret;
      }, []);
    Promise.all(configPromises || []).then(configs => {
      var config = configs.reduce((ret, v) => {
        if (!v.displayName) {
          console.error('Controller Plugin 必须要设置displayName');
        } else {
          ret[v.displayName] = v;
        }
        return ret;
      }, {});
      this.setConfig(config).then(lastConfig => {
        this.setTabs(lastConfig);
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.pathname === undefined) {
      //兼容react-router中页面重载，在safari中这里会运行多一次的问题
      //BrowserHistory有bug，safari中会刷新页面不应该触发监听的。
      return;
    }
    const { hot } = nextProps;
    //是否开启热替换，这里做了热替换处理兼容处理
    if (this.hot !== hot) {
      this.setConfig();
    } else {
      //点击链接时，这函数会触发运行
      this.setConfig().then(lastConfig => {
        this.setTabs(lastConfig);
      });
    }
  }
  /**
   * 重新渲染Router下的所有React组件。
   * @return { Promise } 返回promise函数。
   */
  reRender() {
    return this.setConfig();
  }
  //index为tabId的存储
  pageTabsObj = {};
  activedTab = 0;
  tabsProps = {};
  get tabIds() {
    const ids = [];
    for (let k in this.pageTabsObj) {
      ids.push(k);
    }
    return ids;
  }
  /**
   * getTabProps 获取指定tabProps
   * @return {object} tabProps对象
   */
  getTabProps() {
    return {
      //pageTabsObj转换过来的数组
      get pageTabs() {
        const pageTabs = [];
        const tabListsConfig = {};
        //转换成数组
        for (let k in this.pageTabsObj) {
          const tabConfig = this.pageTabsObj[k];
          pageTabs.push(tabConfig);
          tabListsConfig[k] = {
            pathname: tabConfig.pathname,
            title: tabConfig.title,
            tabId: k,
          };
        }
        storage.set('tabListsConfig', JSON.stringify(tabListsConfig));
        return pageTabs;
      },
      pageTabsObj: this.pageTabsObj,
      //没错新增tab的时候都是最新的一个被高亮
      activedTab: this.activedTab,
      switchTab: tabId => {
        const history = this.context.router.history;
        this.activedTab = tabId;
        const tab = this.pageTabsObj[tabId];
        history.push(pathnameAdapter(tab.pathname.split('/_tabid_')[0]) + '/_tabid_/' + tabId);
      },
      deleteTab: tabId => {
        //先赋值，避免重新计算
        const tabIds = this.tabIds;
        let tabIdsIndex = tabIds.indexOf(tabId) - 1;
        let lastTabId = tabIds[tabIdsIndex];
        delete this.pageTabsObj[tabId];
        if (tabIdsIndex < 0) {
          lastTabId = tabIds[1];
        }
        const tab = this.pageTabsObj[lastTabId];
        this.history.replace(
          pathnameAdapter(tab.pathname.split('/_tabid_')[0]) + '/_tabid_/' + lastTabId
        );
      },
    };
  }
  /**
   * 设置this.pageTabsObj
   * @param {string} tabId  tab唯一标识id
   * @param {object} config this.setConfig传出的this.state.config
   */
  setPageTabsObj(tabId, config) {
    if (config) {
      if (this.firstRender) {
        //这里要先于this.pageTabsObj[tabId]赋值之前执行，要不会被localStorage存储的配置覆盖
        //页面刷新，首次渲染
        const pageTabsObjStorage = JSON.parse(storage.get('tabListsConfig'));
        this.pageTabsObj = {
          ...this.pageTabsObj,
          ...pageTabsObjStorage,
        };
        this.firstRender = false;
      }
      //输入域名，会重定向到主页，这个时候config=false
      this.pageTabsObj[tabId] = {
        component: config.component,
        params: config.viewConfig.params,
        title: config.viewConfig.title,
        viewConfig: config.viewConfig,
        pathname: this.history.location.pathname,
        tabId,
      };
    }
  }
  switchedTabsRendered = {};
  /**
   * [setTabs description]
   * @param  {object} config [description]
   */
  setTabs(config) {
    if (this.indexRedirect) {
      //主页重定向，不做处理
      this.indexRedirect = false;
      return false;
    }
    const queryParams = this.pathnameParams;
    //使用url已有tabid或者随机生成tabId
    const tabId = queryParams._tabid_ || randomKey();
    //当前显示的tab，当react节点key使用
    this.activedTab = tabId;
    const pathname = this.getPathNameByHistory();
    if (!queryParams._tabid_) {
      //更换url，带上_tabid_参数
      this.history.replace(pathnameAdapter(pathname.split('/_tabid_')[0]) + '/_tabid_/' + tabId);
    }
    if (!this.tabsProps[tabId]) {
      this.activedTab = tabId;
      this.setPageTabsObj(tabId, config);
      //前进或者后退，当前链接_tabid_的tab的组件还没渲染，需要先获取的tabProps。
      //存放每个tab的props，会传递到layout中使用
      this.tabsProps[tabId] = this.getTabProps();
    }
    this.setState({
      tabProps: this.tabsProps[tabId],
    });
  }
  firstRender = true;
  render() {
    const { config, pluginsConfig, tabProps } = this.state;
    if (!config || !pluginsConfig) {
      return false;
    }
    var pathname = this.getPathNameByHistory();
    var layoutProps = {};
    if (config && config.viewConfig) {
      var viewConfig = config.viewConfig;
      var newViewProps = {
        reRender: this.reRender.bind(this),
      };
      if (tabProps && !tabProps.component) {
        tabProps.component = config.component;
        tabProps.params = viewConfig.params;
        tabProps.viewConfig = viewConfig;
      }
      config.component.defaultProps = {
        ...(config.component.defaultProps || {}),
        ...newViewProps,
        ...pluginsConfig,
      };

      layoutProps = {
        reRender: this.reRender.bind(this),
        viewConfig,
        params: viewConfig.params,
        breadcrumbs: viewConfig.breadcrumbs,
      };
      layoutProps = {
        ...layoutProps,
        ...pluginsConfig,
        ...tabProps,
      };
    }
    if (pathname !== '/' && config && config.LayoutComponent) {
      return <config.LayoutComponent {...layoutProps} />;
    } else if (pathname !== '/' && config && !config.LayoutComponent) {
      console.error('多页签模式必须定义layout!');
    }
  }
}
export default RouteController;
