进行中...
# 介绍

基于[Ant Design Pro](https://pro.ant.design)框架模板二次开发；

对开源工具 datax 的前端使用[React](https://react.dev/)进行重写，并按需求添加新功能；

## 环境配置

安装依赖 `node_modules`

```bash
yarn
# yarn add xxx
```

### 项目启动

```bash
yarn start
```

## 提交 Git 仓库

```bash
git add .
git commit -m '描述' --no-verify # --no-verify忽略检查
git pull
git push
```

### 打包

```bash
yarn build
```

项目打包生成 dist 文件，当前打包文件放置在服务器/home/webpages 目录中，服务器采用 nginx 做请求代理

### 代码规范化检查

```bash
npm run lint
```

### Test code

```bash
npm test
```

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jinjjm/datax-front&type=Date)](https://star-history.com/#jinjjm/datax-front&Date)
