﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/testLogin',
      },
    ],
  },
  {
    path: '/homepage',
    name: '首页',
    icon: 'icon-weiwangguanicon-defuben-',
    routes: [
      {
        name: '首页',
        path:'/homepage',
        icon: 'icon-bianjiwenjian',
        component: './HomePage',
      },
    ],
  },
  {
    path: '/data-source',
    name: '数据源',
    icon: 'icon-weiwangguanicon-defuben-',
    routes: [
      {
        path: '/data-source',
        redirect: '/data-source/service-source',
      },
      {
        path: '/data-source/service-source',
        name: '数据源',
        icon: 'icon-Tab_shujujiankong',
        component: './DataMarket/DataSource',
      },
    ],
  },
  {
    path: '/data-assets',
    name: '数据资产',
    icon: 'icon-weiwangguanicon-defuben-',
    routes: [
      {
        path: '/data-assets',
        redirect: '/data-assets/directory',
      },
      {
        path: '/data-assets/directory',
        name: '资产目录',
        icon: 'icon-bianjiwenjian',
        component: './DataAssets/Directory',
      },
      {
        path: '/data-assets/assetsDetails',
        icon: 'icon-bianjiwenjian',
        component: './DataAssets/Directory/components/AssetsDetails',
      },
    ],
  },
  {
    path: '/datamarket',
    name: '数据服务',
    icon: 'icon-weiwangguanicon-defuben-',
    access: 'canAdmin',
    routes: [
      {
        path: '/datamarket',
        redirect: '/datamarket/data-service',
      },
      {
        path: '/datamarket/data-service',
        name: '服务管理',
        icon: 'icon-bianjiwenjian',
        component: './DataMarket/DataService',
      },
      {
        path: '/datamarket/data-service/create-new',
        component: './DataMarket/DataService/components/CreateNewApiService',
      },
      {
        path: '/datamarket/data-service/api-details',
        component: './DataMarket/DataService/components/CreateNewApiService',
      },
      {
        path: '/datamarket/data-service/upload',
        component: './DataMarket/DataService/components/UpLoadApiService',
      },
      {
        path: '/datamarket/data-service/read-api-details',
        component: './DataMarket/DataService/components/ReadApiDetails',
      },
      {
        path: '/datamarket/data-monitoring',
        name: '服务监控',
        icon: 'icon-Tab_shujujiankong',
        component: './DataMarket/DataMonitoring',
      },
      {
        path: '/datamarket/data-log',
        name: '服务日志',
        icon: 'icon-Tab_shujujiankong',
        component: './DataMarket/DataLog',
      },
      // {
      //   path: '/datamarket/data-integration',
      //   name: '服务集成',
      //   icon: 'icon-Tab_shujujiankong',
      //   component: './DataMarket/DataIntegration',
      // },
      {
        path: '/datamarket/data-integration/service-details/*',
        component: './DataMarket/DataIntegration/components/ServiceDetails',
      },
    ],
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       path: '/admin',
  //       redirect: '/admin/sub-page',
  //     },
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       component: './Admin',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
