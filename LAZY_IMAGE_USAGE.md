# 懒加载图片组件使用指南

## 📦 组件位置
`components/lazy-image/`

## 🚀 快速开始

### 1. 在页面JSON中引入组件
```json
{
  "usingComponents": {
    "lazy-image": "/components/lazy-image/index"
  }
}
```

### 2. 在WXML中使用组件
```xml
<!-- 基础用法 -->
<lazy-image
  src="{{device.imageUrl}}"
  type="device"
  width="300rpx"
  height="200rpx"
  bind:load="onImageLoad"
  bind:error="onImageError"
/>

<!-- 设备图片 -->
<lazy-image
  src="{{item.imageUrls?.models}}"
  type="device"
  mode="aspectFill"
  lazy-load="{{true}}"
/>

<!-- 物料图片 -->
<lazy-image
  src="{{material.imageUrl}}"
  type="material"
  width="200rpx"
  height="200rpx"
/>

<!-- 头像 -->
<lazy-image
  src="{{user.avatar}}"
  type="avatar"
  width="100rpx"
  height="100rpx"
  mode="aspectFill"
  show-menu-by-longpress="{{true}}"
/>
```

### 3. 在JS中处理事件
```javascript
Page({
  onImageLoad(e) {
    console.log('图片加载成功', e.detail);
    const { src, width, height } = e.detail;
  },

  onImageError(e) {
    console.log('图片加载失败', e.detail);
    const { src, fallback } = e.detail;
  }
});
```

## 🎨 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | String | '' | 图片URL |
| type | String | 'general' | 图片类型：general/device/material/avatar |
| width | String | '100%' | 宽度，支持rpx/px/% |
| height | String | '200rpx' | 高度，支持rpx/px/% |
| mode | String | 'aspectFill' | 显示模式，同小程序image组件 |
| lazyLoad | Boolean | true | 是否懒加载 |
| showErrorText | Boolean | false | 是否显示错误文字 |
| showMenuByLongpress | Boolean | false | 是否长按显示菜单 |

## 📝 事件说明

| 事件名 | 说明 | 返回参数 |
|--------|------|----------|
| bind:load | 图片加载成功 | { src, width, height } |
| bind:error | 图片加载失败 | { src, fallback, error } |

## 🎯 使用场景

### 设备列表页
```xml
<view class="device-item" wx:for="{{devices}}" wx:key="deviceId">
  <lazy-image
    src="{{item.imageUrls?.models}}"
    type="device"
    width="100%"
    height="300rpx"
    mode="aspectFill"
  />
  <view class="device-info">{{item.name}}</view>
</view>
```

### 物料展示页
```xml
<view class="material-grid">
  <view class="material-item" wx:for="{{materials}}" wx:key="materialId">
    <lazy-image
      src="{{item.imageUrl}}"
      type="material"
      width="200rpx"
      height="200rpx"
    />
    <text class="material-name">{{item.name}}</text>
  </view>
</view>
```

### 用户头像
```xml
<view class="user-avatar">
  <lazy-image
    src="{{profile.avatar}}"
    type="avatar"
    width="100rpx"
    height="100rpx"
    mode="aspectFill"
    show-menu-by-longpress="{{true}}"
  />
</view>
```

## 🔧 高级用法

### 动态更新图片
```javascript
Page({
  data: {
    deviceImage: ''
  },

  loadDeviceImage(deviceId) {
    const imageUrl = this.getDeviceImageUrl(deviceId);
    this.setData({ deviceImage: imageUrl });
  }
});
```

### 预加载图片
```javascript
const { preloadImages } = require('../../utils/image-helper');

Page({
  async onLoad() {
    // 预加载首屏图片
    const images = this.data.devices.map(d => d.imageUrl);
    await preloadImages(images, 3);
  }
});
```

### 清除错误缓存
```javascript
const { clearFailed } = require('../../utils/image-helper');

Page({
  retryLoadImage(url) {
    clearFailed(url);
    this.setData({ imageUrl: url });
  }
});
```

## 📊 性能优化建议

1. **使用懒加载**：列表页图片都应开启lazy-load
2. **预加载关键图片**：首页关键图片可以在onLoad时预加载
3. **设置合适尺寸**：根据实际显示尺寸设置width和height
4. **选择正确的type**：不同类型使用不同的错误处理策略
5. **避免频繁更新src**：尽量减少图片URL的变化

## 🐛 常见问题

### Q: 图片显示不出来？
A: 检查src是否为有效URL，type是否正确，网络是否正常。

### Q: 懒加载不生效？
A: 确保lazyLoad属性为true，图片在可视区域附近。

### Q: 如何自定义占位图？
A: 修改`utils/image-helper.js`中的DEFAULT_PLACEHOLDERS。

### Q: 如何处理CDN图片？
A: 组件会自动处理CDN URL，无需额外配置。

---

**更新时间**：2026-04-23
**版本**：1.0.0
