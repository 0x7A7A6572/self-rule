## 律已介绍
现在不管什么软件都塞了短视频，社区，让人眼花缭乱，一刷就是几个小时，所以写了个工具来"管一管"自己，通过无障碍权限监听前台Activity来判断是否为禁用列表，根据相应策略阻止使用。

![界面1](https://zzerx.cn/blogimages/sl-002.png)

- 开发工具 Autojs pro 9.1.20
- 方式: 部分使用安卓资源特性方式进行开发
- 应用下载界面: https://zzerx.cn/apps

## 目录说明

└── autolayout      (autojs布局xml)

└── components     (一些dialog组件)

└── images       (转为安卓资源前的图片)

└── res                (安卓资源)

└── util                (一些工具类)

├── config.js        (配置控制)

├── main.js          (ui主界面)

├── service.js      (后台服务)

├── setting.js      (ui设置界面)

应用下载页面开源地址:https://github.com/0x7A7A6572/apps-download-page

## 正在进行的工作

- 引导操作丶授权界面
- 名单item描述编辑功能
- 手动添加名单功能
- 紧急情况下的弹窗策略(微信 qq 钉钉电话响铃和摘机时)
- 更自由的警告弹窗显示


强烈欢迎PR! 





