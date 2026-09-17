# 巨野揽月红樽 · 线上会员商城原型（一期 + 二期）

交互原型，UI 壳层对齐 [锐涞经销商管理系统](../锐涞经销商管理系统)（顶栏 / 侧栏 / 表格 / 小程序手机框 / 绿主色）。

## 本地预览

需要静态服务器（ES Module）：

```bash
python -m http.server 8080
```

打开 http://localhost:8080/

演示账号密码均为 `demo`：`admin` / `ops` / `finance` / `cs` / `painter` / `craftshop` / `corp` / `store`。C 端小程序顶栏可切换四级会员。

## 工程结构

```
assets/js/
  main.js            启动
  lib/               存储、转义、命名
  data/              常量 + 种子数据
  components/        全局 UI 组件（表格/页签/弹窗/指标卡/手机货架）
  domain/            领域服务（下单锁库、核销、候补、询价转单、排期冲突）
  pages/             按端拆分的页面模块
  actions/           用户操作
  shell/             登录与布局
  app/               路由、渲染、事件委托
```

单页不堆业务。点击全部走 `data-action` / `data-go` 事件委托。

## GitHub Pages

https://cryangle0.github.io/juye/
