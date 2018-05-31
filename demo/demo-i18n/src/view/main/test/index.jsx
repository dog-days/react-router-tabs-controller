import React from 'react';
import pureRenderDecorator from 'src/decorator/PureRenderWithLodash';

@pureRenderDecorator
class IndexView extends React.Component {
  render() {
    return <div>test页面</div>;
  }
}

export default IndexView;
