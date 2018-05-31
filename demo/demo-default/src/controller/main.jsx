import Controller from 'react-router-controller';
import LayoutComponent from '../view/layout/main';

export default class MainController extends Controller {
  LayoutComponent = LayoutComponent;
  suffixTitle = '-羚羊云';
  indexView(params) {
    return this.render(
      {
        title: '主页',
      },
      params
    );
  }
  aboutView(params) {
    return this.render(
      {
        title: '关于',
      },
      params
    );
  }
}
