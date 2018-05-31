import React from 'react';
import pureRenderDecorator from 'src/decorator/PureRenderWithLodash';

@pureRenderDecorator
class AboutView extends React.Component {
  componentDidMount() {
    // console.log(2222);
  }
  render() {
    console.debug('about页面');
    return <div>关于页面</div>;
  }
}

export default AboutView;
