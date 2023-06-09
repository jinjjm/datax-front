/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
/**
 * 四个环境分别是：pro、   pre、    test、   dev环境，
 * 中文名字：  生产环境、灰度环境、测试环境、开发环境
 */
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  // dev: {
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   '/api/': {
  //     // 要代理的地址
  //     target: 'https://preview.pro.ant.design',
  //     // 配置了这个可以从 http 代理到 https
  //     // 依赖 origin 的功能可能需要这个，比如 cookie
  //     changeOrigin: true,
  //   },
  // },

  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/dataApis': {
      // 要代理的地址
      target: 'http://10.1.40.86:8612/data/market/dataApis',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '^/dataApis': '' },
      // // 接受无效的https 证书
      // secure: false,
    },
    '/sources': {
      target: 'http://10.1.40.86:8612/data/metadata/sources',
      changeOrigin: true,
      pathRewrite: { '^/sources': '' },
    },
    '/services': {
      target: 'http://10.1.40.86:8612/data/service/services',
      changeOrigin: true,
      pathRewrite: { '^/services': '' },
    },
  },
  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // 项目打包存放地址：10.1.40.85  /home/webPages/dist
  // 生产环境中，还需要在nginx中配置代理，否则会出现404问题
  // location /service {
  //     proxy_pass http://10.1.40.85:7778/service;
  // }
  // 修改后重新启动nginx命令
  // cd /usr/local/nginx/sbin/
  // ./nginx -t
  // ./nginx -s reload
  // service nginx restart

  pro: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/dataApis': {
      target: 'http://10.1.40.86:8612',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/sources': {
      target: 'http://10.1.40.86:8612/sources',
      changeOrigin: true,
      pathRewrite: { '^/sources': '' },
    },
    '/services': {
      target: 'http://10.1.40.86:8612/services',
      changeOrigin: true,
      pathRewrite: { '^/services': '' },
    },
  },
};
