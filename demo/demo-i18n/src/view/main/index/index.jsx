import React from 'react';
import pureRenderDecorator from 'src/decorator/PureRenderWithLodash';

@pureRenderDecorator
class IndexView extends React.Component {
  render() {
    console.debug('index页面');
    return <div>主页页面</div>;
  }
}

export default IndexView;
