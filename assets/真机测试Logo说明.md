# 真机测试时使用 Logo 与登录背景的说明

## 📱 为什么开发工具显示 500 错误？

这是微信开发者工具的**已知问题**，即使图片文件正常，有时也会出现 500 错误。

**但是**：真机测试时通常能正常显示！

---

## ✅ 当前代码使用的资源

| 文件 | 用途 |
|------|------|
| `assets/company-logo.jpg` | 登录卡片顶部 Logo |
| `assets/login-bg.jpg` | 登录页全屏背景图 |

路径在 `pages/login/index.wxml` 中为 **`/assets/文件名`**。请将图片放在项目内 `assets` 目录，文件名与代码一致（全小写、无中文）。

---

## ✅ 方案 1：真机调试（推荐）

### 步骤：

1. **保持图片在 assets 文件夹**
   ```
   小程序/assets/company-logo.jpg ✓
   小程序/assets/login-bg.jpg ✓
   ```

2. **真机调试**
   ```
   微信开发者工具 → 真机调试 → 扫码
   ```

3. **在手机上查看效果**
   - 真机通常能正常加载本地图片
   - Logo 与背景应能正常显示

若仍显示异常：**清除缓存 → 全部清除** 后重新编译再真机预览。

---

## ✅ 方案 2：使用 Base64 图片（备选）

若极个别环境下本地路径仍异常，可将小图转为 Base64（更适合 Logo；背景图体积大不推荐）。

### 工具推荐：
- 在线转换：https://www.base64-image.de/

### 注意：

- 小程序对 `image` 的 `src` 使用 Base64 时需注意基础库与长度限制，优先仍使用本地 `assets` 文件。

---

## 🎨 Logo 加载失败时

代码已做回退：若 `company-logo.jpg` 加载失败，会显示 emoji（见 `pages/login/index.wxml` 中 `wx:if="{{!logoError}}"`）。

---

## 🖼 背景图加载失败时

若 `login-bg.jpg` 缺失或路径错误，会触发 `binderror`，隐藏背景图，仅保留 `pages/login/index.wxss` 中的深色渐变底，不影响登录流程。

---

## 🔗 相关文件

- 图片位置：`assets/company-logo.jpg`、`assets/login-bg.jpg`
- 页面结构：`pages/login/index.wxml`
- 样式：`pages/login/index.wxss`
- 逻辑：`pages/login/index.js`

更多调试步骤见同目录 [LOGO_GUIDE.md](LOGO_GUIDE.md)。
