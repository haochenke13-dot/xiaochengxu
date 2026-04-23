// components/lazy-image/index.js
const { getImageUrl, handleImageLoad, handleImageError } = require('../../utils/image-helper');

Component({
  properties: {
    // 图片URL
    src: {
      type: String,
      value: ''
    },
    // 图片类型（用于错误处理）
    type: {
      type: String,
      value: 'general' // general, device, material, avatar
    },
    // 宽度
    width: {
      type: String,
      value: '100%'
    },
    // 高度
    height: {
      type: String,
      value: '200rpx'
    },
    // 显示模式
    mode: {
      type: String,
      value: 'aspectFill'
    },
    // 是否懒加载
    lazyLoad: {
      type: Boolean,
      value: true
    },
    // 是否显示错误文字
    showErrorText: {
      type: Boolean,
      value: false
    },
    // 长按显示菜单
    showMenuByLongpress: {
      type: Boolean,
      value: false
    }
  },

  data: {
    loaded: false,
    loading: true,
    error: false,
    fallback: ''
  },

  observers: {
    'src': function(newSrc) {
      if (newSrc) {
        this.setData({
          loaded: false,
          loading: true,
          error: false,
          fallback: ''
        });
      }
    }
  },

  methods: {
    onLoad(e) {
      const { src, type } = this.properties;
      const processedSrc = getImageUrl(src, type);

      this.setData({
        loaded: true,
        loading: false,
        error: false
      });

      handleImageLoad(processedSrc, this);

      this.triggerEvent('load', {
        src: processedSrc,
        width: e.detail.width,
        height: e.detail.height
      });
    },

    onError(e) {
      const { src, type } = this.properties;
      const fallback = handleImageError(src, type, this);

      this.setData({
        loaded: false,
        loading: false,
        error: true,
        fallback
      });

      this.triggerEvent('error', {
        src,
        fallback,
        error: e.detail
      });
    },

    onFallbackError() {
      // 占位图也加载失败，不做处理
      console.warn('占位图加载失败');
    }
  }
});
