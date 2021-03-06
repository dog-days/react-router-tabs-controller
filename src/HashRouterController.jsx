import React from 'react';
import { HashRouter } from 'react-router-dom';
import RouteController from './RouteController';

/**
 * HashRouter类型控制器
 */
class HashRouterController extends React.Component {
  displayName = 'HashRouterController';
  render() {
    const { basename, hot, preact } = this.props;
    return (
      <HashRouter {...this.props}>
        <RouteController historyType="hash" basename={basename} hot={hot} preact={preact} />
      </HashRouter>
    );
  }
}
export default HashRouterController;
