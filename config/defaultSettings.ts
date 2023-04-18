import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  // mix 菜单于顶部和左侧混合展示，需要注意，
  // 当 mix 模式时，需要添加splitMenus: true，顶部才可以正确展示一级菜单
  splitMenus: true,
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  menu: {
    locale: false,
  },
  colorWeak: false,
  title: ' TJGL  OpenAPI', //系统名称
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '//at.alicdn.com/t/c/font_4004148_z37kwitxu2g.js',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    header: {
      colorBgHeader: '#001529',
      colorHeaderTitle: '#fff',
      colorTextMenu: '#dfdfdf',
      colorTextMenuSecondary: '#dfdfdf',
      colorTextMenuSelected: '#fff',
      colorBgMenuItemSelected: '#22272b',
      colorTextMenuActive: 'rgba(255,255,255,0.85)',//menuItem hover 的选中字体颜色
      colorTextRightActionsItem: '#fff', // 右上角字体颜色
      // colorBgRightActionsItemHover:'#fff',
      heightLayoutHeader:60,
    },
    colorTextAppListIconHover: '#fff',
    colorTextAppListIcon: '#fff',
    sider: {
      colorMenuBackground: '#001529',
      colorMenuItemDivider: '#dfdfdf',
      colorBgMenuItemHover: '#f6f6f6',
      colorTextMenu: '#dfdfdf',
      colorTextMenuSelected: '#1890FF',
      colorTextMenuActive: '#dfdfdf',
      colorBgMenuItemCollapsedHover: '#242424',
    },
  },
};

export default Settings;
