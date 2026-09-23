# JEV Demo

可直接上传 GitHub 的静态网站，不需要安装依赖或编译。

## 上传和部署

1. 解压 ZIP，将里面的全部文件及文件夹上传到 GitHub 仓库根目录，不要只上传 ZIP，也不要再套一层文件夹。
2. 在仓库中启用 GitHub Pages，选择保存这些文件的分支及根目录作为发布来源。
3. 自定义域名已在 CNAME 文件中配置为 jev-demo.com；仍需在域名服务商处配置 GitHub Pages 要求的 DNS，并在 GitHub 验证域名和 HTTPS。

## 已包含

- 英文首页：/。
- 简体中文页面：/zh/。
- 分类、搜索、浏览量筛选与视频弹窗。
- 在线使用内页：/playground/ 和 /zh/playground/，嵌入 jevai.info 的中文工具。
- Google Analytics：G-N5SY53Y1WL。
- 两种语言的 Title、Description、canonical、hreflang。
- robots.txt、sitemap.xml、404.html、新标志和分享图片。

## 发布说明

本包针对 https://jev-demo.com 部署，静态资源使用根路径。在没有绑定域名的 GitHub 项目子路径下，资源路径可能不正确。

英文和中文正式页面已允许索引，404 页面保留 noindex。域名绑定、DNS、HTTPS、线上状态码、GA 数据接收尚未在真实环境验证。

视频和封面引用外部来源，没有把视频下载到仓库。正式使用需确认媒体引用许可；外部媒体可能失效。部分案例没有封面，使用分类文字展示。浏览量是来源快照，不是实时数据。

不要将源表格、内部采集脚本、凭证或 .openai 目录上传为网站内容。本包未包含这些文件。

tokens calculator：/calculator/ 和 /zh/calculator/。纯浏览器计算，无需 API；单价及节省比例为用户可调整的估算输入。
