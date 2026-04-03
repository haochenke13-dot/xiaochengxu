# Logo 图片使用指南

## 🚨 图片看不到？按以下步骤排查

### 第一步：确认图片文件存在

**检查路径**：
```
小程序/
├── assets/
│   ├── company-logo.jpg    ← 登录页 Logo（当前代码使用）
│   └── login-bg.jpg        ← 登录页全屏背景（可替换为你的照片）
```

**在微信开发者工具中**：
1. 查看左侧文件树
2. 找到 `assets` 文件夹
3. 确认 `company-logo.jpg`、`login-bg.jpg` 是否存在

### 第二步：尝试不同的路径格式

当前使用的路径：
- Logo：`/assets/company-logo.jpg`
- 登录背景：`/assets/login-bg.jpg`

**如果不行，试试这些**：

1. **绝对路径**（推荐）：
```xml
<image src="/assets/company-logo.jpg" />
```

2. **相对路径**：
```xml
<image src="../../assets/company-logo.jpg" />
```

3. **不带前导斜杠**：
```xml
<image src="assets/company-logo.jpg" />
```

### 第三步：检查图片文件

**图片要求**：
- ✅ 格式：PNG 或 JPG
- ✅ 文件名：小写字母，无空格
- ✅ 大小：< 1MB
- ❌ 避免中文字符

**常见问题**：
- 文件名大小写不匹配 → 改为全小写
- 图片在子文件夹中 → 调整路径
- 图片被隐藏文件 → 检查文件属性

### 第四步：重新编译

```
微信开发者工具 → 
1. 清除缓存 → 全部清除
2. 编译
```

---

## 🖼 登录页背景图（login-bg.jpg）

登录页使用 **全屏 `<image>` + 半透明遮罩**，避免与全局 `page-shell` 渐变叠在一起发灰。

| 项目 | 说明 |
|------|------|
| 文件位置 | `assets/login-bg.jpg` |
| 代码 | `pages/login/index.wxml` 中 `class="login-bg"`，`mode="aspectFill"` |
| 加载失败 | 自动隐藏图片，仅显示深色渐变底（`pages/login/index.js` 中 `onBgError`） |
| 建议 | 横图或竖图均可；体积尽量压缩（如一两百 KB 内）；避免中文文件名 |

替换背景：用你的 JPG 覆盖 `assets/login-bg.jpg`，重新编译；若真机仍缓存旧图，可在开发者工具中 **清除缓存 → 全部清除** 后再试。

---

## ✨ 已添加的半透明效果

### 当前配置

**透明度**：`opacity: 0.85` (85%不透明)

**视觉效果**：
- 💫 柔和的蓝色光晕背景
- 🔵 圆形边框装饰
- 🌟 与背景完美融合

**调节透明度**：

如果太透明：
```css
.logo-img {
  opacity: 1.0;  /* 完全不透明 */
}
```

如果还是看不清：
```css
.logo-img {
  opacity: 0.95; /* 95%不透明 */
}
```

---

## 🎨 调整 Logo 样式

### 修改大小

编辑 `pages/login/index.wxss`：

```css
.logo-img {
  width: 160rpx;   /* 当前值 */
  height: 160rpx;  /* 当前值 */
}
```

**建议尺寸**：
- 小型：100-120rpx
- 中型：140-160rpx（当前）
- 大型：180-200rpx

### 调整光晕

**让光晕更明显**：
```css
.card-logo::before {
  opacity: 0.3;  /* 增加 */
}
```

**移除光晕**：
```css
.card-logo::before {
  display: none;
}
```

### 调整边框

**让边框更明显**：
```css
.card-logo::after {
  border: 3rpx solid rgba(59, 130, 246, 0.4);
}
```

**移除边框**：
```css
.card-logo::after {
  display: none;
}
```

---

## 🔍 调试模式

### 查看控制台

**如果图片加载失败，会看到**：
```
Logo加载失败
```

**如果加载成功，会看到**：
```
Logo加载成功
```

### 临时使用文字代替

如果暂时没有图片，可以用 emoji：

修改 `pages/login/index.wxml`，删除 image 标签：
```xml
<view class="card-logo">
  <text class="logo-fallback">🏢</text>
</view>
```

---

## 💡 最佳实践

### 推荐的 Logo 设置

1. **尺寸**：400x400px 或更大
2. **格式**：PNG（支持透明背景）
3. **文件大小**：< 500KB
4. **命名**：全小写，用连字符（如 `company-logo.jpg`）

### 如果 Logo 是深色

由于登录卡片是浅色，深色 logo 可能不明显。可以：

**方案1：添加白色背景**
```css
.logo-img {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 10rpx;
}
```

**方案2：添加阴影**
```css
.logo-img {
  filter: drop-shadow(0 2rpx 8rpx rgba(0, 0, 0, 0.15));
}
```

---

## 🚀 快速测试

**1. 使用网络图片测试**（确认代码没问题）

在 `pages/login/index.wxml` 中临时改为（需配置合法下载域名）：
```xml
<image 
  class="logo-img" 
  src="https://example.com/your-logo.png" 
  mode="aspectFit"
></image>
```

**2. 如果能看到占位图**

说明代码没问题，只需要：
- 把你的图片放到正确位置
- 或使用正确的路径

**3. 如果还是看不到**

检查：
- 图片文件是否真的在 `assets/` 文件夹
- 文件名拼写是否正确
- 图片是否损坏

---

## 📞 还是不行？

提供以下信息：
1. 控制台显示什么？
2. `assets/company-logo.jpg` 文件是否存在？
3. 文件大小是多少？
4. 图片格式是什么？
