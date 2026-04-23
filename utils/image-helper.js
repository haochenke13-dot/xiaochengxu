/**
 * 图片加载辅助工具
 * 提供图片懒加载、错误处理、占位图等功能
 */

// 默认占位图
const DEFAULT_PLACEHOLDERS = {
  device: 'https://via.placeholder.com/300x200/0EA5E9/FFFFFF?text=Device',
  material: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Material',
  avatar: 'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=Avatar',
  general: 'https://via.placeholder.com/300x300/6B7280/FFFFFF?text=No+Image'
};

// 错误图片（当图片加载失败时使用）
const ERROR_IMAGES = {
  device: '/assets/images/error-device.png',
  material: '/assets/images/error-material.png',
  avatar: '/assets/images/error-avatar.png',
  general: '/assets/images/error-general.png'
};

/**
 * 图片加载状态管理
 */
class ImageHelper {
  constructor() {
    this.loadingImages = new Map(); // 正在加载的图片
    this.failedImages = new Map(); // 加载失败的图片
    this.loadedImages = new Map(); // 已加载的图片
  }

  /**
   * 处理图片加载成功
   */
  handleImageLoad(url, component) {
    this.loadedImages.set(url, Date.now());
    this.loadingImages.delete(url);

    if (component && component.setData) {
      component.setData({
        [`imageStates.${this._urlToKey(url)}.loaded`]: true,
        [`imageStates.${this._urlToKey(url)}.loading`]: false,
        [`imageStates.${this._urlToKey(url)}.error`]: false
      });
    }
  }

  /**
   * 处理图片加载失败
   */
  handleImageError(url, type = 'general', component) {
    this.failedImages.set(url, Date.now());
    this.loadingImages.delete(url);

    const fallbackUrl = ERROR_IMAGES[type] || ERROR_IMAGES.general;

    if (component && component.setData) {
      component.setData({
        [`imageStates.${this._urlToKey(url)}.error`]: true,
        [`imageStates.${this._urlToKey(url)}.loaded`]: false,
        [`imageStates.${this._urlToKey(url)}.loading`]: false,
        [`imageStates.${this._urlToKey(url)}.fallback`]: fallbackUrl
      });
    }

    return fallbackUrl;
  }

  /**
   * 开始加载图片
   */
  startLoading(url, component) {
    if (this.failedImages.has(url)) {
      // 如果之前加载失败，直接返回错误状态
      return {
        loaded: false,
        loading: false,
        error: true,
        fallback: ERROR_IMAGES.general
      };
    }

    this.loadingImages.set(url, Date.now());

    if (component && component.setData) {
      component.setData({
        [`imageStates.${this._urlToKey(url)}.loading`]: true,
        [`imageStates.${this._urlToKey(url)}.loaded`]: false,
        [`imageStates.${this._urlToKey(url)}.error`]: false
      });
    }

    return {
      loaded: false,
      loading: true,
      error: false
    };
  }

  /**
   * 检查图片是否已加载
   */
  isLoaded(url) {
    return this.loadedImages.has(url);
  }

  /**
   * 检查图片是否加载失败
   */
  isFailed(url) {
    return this.failedImages.has(url);
  }

  /**
   * 清除加载失败的记录（重试）
   */
  clearFailed(url) {
    this.failedImages.delete(url);
  }

  /**
   * 清除所有失败的记录
   */
  clearAllFailed() {
    this.failedImages.clear();
  }

  /**
   * 将URL转换为安全的key
   */
  _urlToKey(url) {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  /**
   * 获取图片URL（处理CDN和相对路径）
   */
  getImageUrl(url, type = 'general') {
    if (!url) {
      return DEFAULT_PLACEHOLDERS[type] || DEFAULT_PLACEHOLDERS.general;
    }

    // 如果是相对路径，转换为绝对路径
    if (url.startsWith('/')) {
      return url;
    }

    // 如果是完整URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // 其他情况，视为相对路径
    return `/${url}`;
  }

  /**
   * 预加载图片
   */
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = wx.createImage();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`图片加载失败: ${url}`));
      img.src = url;
    });
  }

  /**
   * 批量预加载图片
   */
  async preloadImages(urls, concurrency = 3) {
    const results = [];
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map(url => this.preloadImage(url))
      );
      results.push(...batchResults);
    }
    return results;
  }

  /**
   * 获取图片加载统计
   */
  getStats() {
    return {
      loaded: this.loadedImages.size,
      loading: this.loadingImages.size,
      failed: this.failedImages.size,
      total: this.loadedImages.size + this.loadingImages.size + this.failedImages.size
    };
  }
}

// 创建单例实例
const imageHelper = new ImageHelper();

module.exports = {
  imageHelper,
  DEFAULT_PLACEHOLDERS,
  ERROR_IMAGES,

  // 便捷方法
  handleImageLoad: (url, component) => imageHelper.handleImageLoad(url, component),
  handleImageError: (url, type, component) => imageHelper.handleImageError(url, type, component),
  getImageUrl: (url, type) => imageHelper.getImageUrl(url, type),
  isLoaded: (url) => imageHelper.isLoaded(url),
  isFailed: (url) => imageHelper.isFailed(url),
  clearFailed: (url) => imageHelper.clearFailed(url),
  preloadImage: (url) => imageHelper.preloadImage(url),
  preloadImages: (urls, concurrency) => imageHelper.preloadImages(urls, concurrency),
  getStats: () => imageHelper.getStats()
};
