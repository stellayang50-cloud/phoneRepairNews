# 个人网站编辑器

这是一个可实时预览的个人网站编辑器。你可以修改姓名、简介、联系方式、主题颜色，上传头像、首页图片和作品图片，右侧会即时显示生成效果。

首页第一板块会自动聚合 DIY 手机维修零件市场雷达，优先展示同行维修视频、同行博客、手机硬件新闻和零售零件需求信号。当前来源包括 Phone Repair Guru、DIYPhoneFix、iDoctor UK、REWA Technology、iFixit News、GSMArena、TechRadar Phones、iPhone Repair Base 和 XFix。

每次成功获取到的资讯会保存到浏览器本地历史库，并在 `#news` 资讯列表页面按最近获取时间从新到旧展示。

首页还包含 `Competitor product board` 竞品产品表，按品牌追踪竞品链接、产品、价格、状态和最近获取时间。当前 ReplaceBase 公开页面会返回 403，因此表格会保留 iPhone、Samsung、Google Pixel、Huawei、Xiaomi 的监控链接并标记为 `Manual review required`，不会伪造价格。后续可在 `lib/competitorProducts.mjs` 里添加更多可公开抓取的竞品品牌链接或接入授权 API。

## 本地预览

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:5173`。

## 构建发布包

```bash
npm run build
```

构建结果在 `dist` 文件夹，可部署到 Vercel、Netlify、Cloudflare Pages 或任意静态网站托管服务。

如果需要自动行业资讯，推荐优先使用 Vercel 或 Netlify，因为项目已经包含对应的云端新闻接口配置。

## 部署参数

- 构建命令：`npm run build`
- 发布目录：`dist`
- Node 版本：`24`

## 绑定代理域名

部署成功后，在云平台添加自定义域名，例如 `www.yourdomain.com`。然后到你的域名 DNS 面板添加平台要求的 `CNAME` 或 `A` 记录。DNS 生效后，云平台会自动签发 HTTPS 证书。
