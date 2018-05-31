import React from 'react';
import pureRenderDecorator from 'src/decorator/PureRenderWithLodash';

@pureRenderDecorator
class AboutView extends React.Component {
  render() {
    console.debug('about页面');
    const {
      i18n: { t },
    } = this.props;
    return <div>{t('关于页面')}</div>;
  }
}

export default AboutView;
