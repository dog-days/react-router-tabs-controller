import Controller from 'react-router-controller';
import LayoutComponent from '../view/layout/main';

export default class MainController extends Controller {
  LayoutComponent = LayoutComponent;
  indexView(params) {
    return this.render(
      {
        title: '主页',
        breadcrumbs: [],
      },
      params
    );
  }
  aboutView(
    params,
    {
      i18n: { t },
    }
  ) {
    if (!this.checkParams(params, ['id'])) {
      return false;
    }
    return this.render(
      {
        title: t('关于'),
        breadcrumbs: [
          {
            link: `/main/about/id/${params.id}`,
            label: t('关于'),
          },
        ],
      },
      params
    );
  }

  testView(
    params,
    {
      i18n: { t },
    }
  ) {
    return this.render(
      {
        title: t('test'),
        breadcrumbs: [
          {
            link: `/main/test/id/${params.id}`,
            label: t('test'),
          },
        ],
      },
      params
    );
  }
}
