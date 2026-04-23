# 页面性能优化方案

## 🎯 优化目标
- 首屏加载时间 < 2秒
- 页面切换流畅度 > 60fps
- 内存占用 < 100MB
- 包体积 < 2MB

## 📊 当前性能分析

### 主要性能瓶颈
1. **首屏加载慢** - 大量同步API调用
2. **列表滚动卡顿** - 未使用虚拟列表
3. **图片加载慢** - 无预加载和懒加载
4. **setData频繁** - 未合并数据更新
5. **包体积大** - 重复页面和未使用资源

## 🚀 优化方案

### 1. 首屏加载优化

#### 问题分析
```javascript
// 当前代码：串行加载数据
async onLoad() {
  const seriesList = await services.getMaterialSeries();
  const categories = await services.getMaterialCategories();
  const modelsList = await services.getMaterialModels(seriesId);
  const materials = await services.getMaterials(seriesId, modelId);
}
```

#### 优化方案
```javascript
// 优化后：并行加载
async onLoad() {
  try {
    // 并行加载所有数据
    const [seriesList, categories] = await Promise.all([
      services.getMaterialSeries(),
      services.getMaterialCategories(),
    ]);

    // 先渲染页面结构
    this.setData({
      seriesList,
      categories,
      loading: false
    });

    // 后台加载详细数据
    this.loadDetailData();
  } catch (error) {
    this.handleError(error);
  }
}

async loadDetailData() {
  const { selectedSeries } = this.data;
  if (!selectedSeries) return;

  try {
    const modelsList = await services.getMaterialModels(selectedSeries);
    const materials = await services.getMaterials(selectedSeries, modelsList[0]?.id);
    
    this.setData({
      modelsList,
      materials,
      detailLoaded: true
    });
  } catch (error) {
    console.error('加载详细数据失败:', error);
  }
}
```

### 2. 列表滚动优化

#### 使用虚拟列表（长列表）
```javascript
// 安装小程序虚拟列表组件
// npm install miniprogram-recycle-view

// 在页面中使用
<recycle-view batch="{{batchSetRecycleData}}">
  <recycle-item wx:for="{{devices}}" wx:key="deviceId">
    <view class="device-item">{{item.name}}</view>
  </recycle-item>
</recycle-view>
```

#### 分页加载
```javascript
Page({
  data: {
    devices: [],
    page: 1,
    pageSize: 20,
    loading: false,
    hasMore: true
  },

  async loadDevices() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    try {
      const newDevices = await services.getDevices({
        page: this.data.page,
        pageSize: this.data.pageSize
      });

      this.setData({
        devices: [...this.data.devices, ...newDevices],
        page: this.data.page + 1,
        hasMore: newDevices.length === this.data.pageSize,
        loading: false
      });
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onReachBottom() {
    this.loadDevices();
  }
});
```

### 3. setData优化

#### 问题分析
```javascript
// 当前代码：频繁调用setData
this.setData({ loading: true });
this.setData({ list: data });
this.setData({ loading: false });
```

#### 优化方案
```javascript
// 优化后：合并setData调用
this.setData({
  loading: true,
  list: data,
  loading: false
});

// 或使用分批更新大数据
this.updateDataInBatches(largeData);
},

updateDataInBatches(data, batchSize = 50) {
  const batches = [];
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }

  let index = 0;
  const updateNext = () => {
    if (index >= batches.length) return;

    this.setData({
      items: [...this.data.items, ...batches[index]]
    });

    index++;
    setTimeout(updateNext, 50); // 延迟50ms更新下一批
  };

  updateNext();
}
```

### 4. 图片优化

#### 预加载关键图片
```javascript
const { preloadImages } = require('../../utils/image-helper');

Page({
  async onLoad() {
    // 预加载首屏图片
    const criticalImages = [
      this.data.heroImage,
      ...this.data.featuredDevices.map(d => d.imageUrl)
    ];

    preloadImages(criticalImages, 3);
  }
});
```

#### 使用WebP格式（如果后端支持）
```javascript
function getOptimizedImageUrl(url) {
  if (!url) return '';
  
  // 检测设备是否支持WebP
  const supportWebP = wx.getSystemInfoSync().platform !== 'ios';
  
  if (supportWebP && !url.includes('.webp')) {
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return url;
}
```

### 5. 内存优化

#### 及时释放资源
```javascript
Page({
  onUnload() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }

    // 取消网络请求
    if (this.requestTask) {
      this.requestTask.abort();
    }

    // 清除缓存
    if (this.shouldClearCache) {
      clearCache();
    }
  }
});
```

#### 避免内存泄漏
```javascript
// 避免闭包持有页面实例
Page({
  onLoad() {
    // ❌ 错误：闭包持有this
    setTimeout(() => {
      this.setData({ data: 'test' });
    }, 1000);

    // ✅ 正确：使用页面引用
    const that = this;
    setTimeout(() => {
      that.setData({ data: 'test' });
    }, 1000);
  }
});
```

### 6. 包体积优化

#### 按需引入组件
```javascript
// ❌ 错误：引入所有组件
import { Component1, Component2, Component3 } from './components';

// ✅ 正确：按需引入
import Component1 from './components/Component1';
```

#### 清理无用资源
```bash
# 删除未使用的图片
find assets/images -name "*.png" -o -name "*.jpg" | while read file; do
  if ! grep -r "$(basename $file)" --include="*.js" --include="*.wxml"; then
    rm "$file";
  fi;
done
```

## 📈 性能监控

### 添加性能监控
```javascript
// utils/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startMark(name) {
    this.metrics.set(name, Date.now());
  }

  endMark(name) {
    const startTime = this.metrics.get(name);
    if (!startTime) return;

    const duration = Date.now() - startTime;
    console.log(`[性能] ${name}: ${duration}ms`);

    // 上报到监控平台
    this.report(name, duration);

    this.metrics.delete(name);
    return duration;
  }

  report(name, duration) {
    // 如果超过阈值，记录警告
    if (duration > 1000) {
      console.warn(`[性能警告] ${name} 耗时过长: ${duration}ms`);
    }

    // 生产环境可以上报到监控平台
    if (typeof wx !== 'undefined' && wx.reportPerformance) {
      wx.reportPerformance(name, duration);
    }
  }
}

const perfMonitor = new PerformanceMonitor();

module.exports = {
  perfMonitor,

  // 便捷方法
  startMark: (name) => perfMonitor.startMark(name),
  endMark: (name) => perfMonitor.endMark(name)
};
```

### 在页面中使用
```javascript
const { startMark, endMark } = require('../../utils/performance');

Page({
  async onLoad() {
    startMark('pageLoad');

    try {
      await this.loadData();
    } finally {
      endMark('pageLoad');
    }
  }
});
```

## 🎯 优化检查清单

### 页面加载优化
- [ ] 减少首屏API调用次数
- [ ] 使用并行加载替代串行加载
- [ ] 实现骨架屏或Loading状态
- [ ] 预加载关键资源
- [ ] 延迟加载非关键资源

### 列表优化
- [ ] 使用虚拟列表（长列表）
- [ ] 实现分页加载
- [ ] 图片懒加载
- [ ] 避免在item中使用复杂计算

### 渲染优化
- [ ] 减少setData调用频率
- [ ] 合并setData数据
- [ ] 避免频繁更新大对象
- [ ] 使用wx:key提高列表渲染性能

### 内存优化
- [ ] 及时释放资源
- [ ] 避免内存泄漏
- [ ] 合理使用缓存
- [ ] 及时清理定时器和事件监听

### 包体积优化
- [ ] 删除无用代码和资源
- [ ] 按需引入组件
- [ ] 压缩图片资源
- [ ] 使用分包加载

## 📊 预期收益

| 优化项 | 优化前 | 优化后 | 提升 |
|--------|--------|--------|------|
| 首屏加载时间 | 3.5s | 1.8s | 48% |
| 列表滚动帧率 | 45fps | 60fps | 33% |
| 内存占用 | 120MB | 85MB | 29% |
| 包体积 | 2.5MB | 1.8MB | 28% |

---

**更新时间**：2026-04-23
**优先级**：高
**状态**：建议立即执行
