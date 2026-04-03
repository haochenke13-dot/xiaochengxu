# 静态资源说明（assets）

## 登录页

| 文件 | 用途 |
|------|------|
| `company-logo.jpg` | 登录卡片顶部 Logo（加载失败时回退为 emoji） |
| `login-bg.jpg` | 登录页全屏背景，`mode="aspectFill"`（加载失败时仅显示深色渐变底） |

页面代码：`pages/login/index.wxml`、`pages/login/index.wxss`、`pages/login/index.js`。

详细排查与样式调节见 [LOGO_GUIDE.md](LOGO_GUIDE.md)，真机说明见 [真机测试Logo说明.md](真机测试Logo说明.md)。

## 底部导航 Tab

| 路径 | 用途 |
|------|------|
| `tabbar/home.png` / `home-active.png` | 首页 |
| `tabbar/workorder.png` / `workorder-active.png` | 工单 |
| `tabbar/device.png` / `device-active.png` | 设备 |
| `tabbar/discover.png` / `discover-active.png` | 发现 |
| `tabbar/profile.png` / `profile-active.png` | 我的 |

在 [app.json](../app.json) 的 `tabBar.list` 中引用。如需替换，保持文件名与 `app.json` 一致，或使用新文件名并同步修改配置。建议图标尺寸 **81×81 px**（或按微信文档当前要求）。

## 其他

- `logo.svg`：示例矢量图，可自行导出为 PNG 后替换 `company-logo.jpg`。
