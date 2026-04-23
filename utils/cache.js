/**
 * 数据缓存管理器
 * 用于减少重复API调用，提升应用性能
 * 支持stale-while-revalidate策略
 */

// 缓存配置
const CACHE_CONFIG = {
  // 设备列表缓存5分钟，stale期间可以返回旧数据
  devices: { duration: 5 * 60 * 1000, staleWhileRevalidate: 2 * 60 * 1000 },
  // 设备详情缓存10分钟，stale期间可以返回旧数据
  deviceDetail: { duration: 10 * 60 * 1000, staleWhileRevalidate: 5 * 60 * 1000 },
  // 工单列表缓存3分钟，stale期间可以返回旧数据
  workOrders: { duration: 3 * 60 * 1000, staleWhileRevalidate: 1 * 60 * 1000 },
  // 工单详情缓存10分钟，stale期间可以返回旧数据
  workOrderDetail: { duration: 10 * 60 * 1000, staleWhileRevalidate: 5 * 60 * 1000 },
  // 物料列表缓存10分钟，stale期间可以返回旧数据
  materials: { duration: 10 * 60 * 1000, staleWhileRevalidate: 5 * 60 * 1000 },
  // 物料系列缓存30分钟
  materialSeries: { duration: 30 * 60 * 1000, staleWhileRevalidate: 15 * 60 * 1000 },
  // 物料型号缓存30分钟
  materialModels: { duration: 30 * 60 * 1000, staleWhileRevalidate: 15 * 60 * 1000 },
  // 用户信息缓存15分钟
  userProfile: { duration: 15 * 60 * 1000, staleWhileRevalidate: 5 * 60 * 1000 },
};

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.maxCacheSize = 50; // 最大缓存条目数
  }

  /**
   * 生成缓存key
   */
  _generateKey(type, params = {}) {
    const paramStr = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('&');
    return paramStr ? `${type}:${paramStr}` : type;
  }

  /**
   * 设置缓存
   */
  set(type, data, params = {}) {
    const key = this._generateKey(type, params);
    const now = Date.now();

    // 检查缓存大小，如果超过限制则删除最旧的缓存
    if (this.cache.size >= this.maxCacheSize) {
      this._cleanupOldest();
    }

    this.cache.set(key, data);
    this.timestamps.set(key, now);

    console.log(`[缓存设置] ${key} - 缓存时长: ${CACHE_CONFIG[type]?.duration || '永久'}`);
  }

  /**
   * 获取缓存（支持stale-while-revalidate）
   * @returns {Object|null} 返回 { data: any, isStale: boolean } 或 null
   */
  get(type, params = {}) {
    const key = this._generateKey(type, params);
    const now = Date.now();

    // 检查缓存是否存在
    if (!this.cache.has(key)) {
      console.log(`[缓存未命中] ${key}`);
      return null;
    }

    const timestamp = this.timestamps.get(key);
    const config = CACHE_CONFIG[type];
    const age = now - timestamp;

    // 检查缓存是否在stale期间
    if (config && config.staleWhileRevalidate) {
      if (age > config.duration && age <= config.duration + config.staleWhileRevalidate) {
        console.log(`[缓存Stale] ${key} - 缓存年龄: ${Math.round(age / 1000)}s，可使用旧数据`);
        return {
          data: this.cache.get(key),
          isStale: true,
          age: age
        };
      }
    }

    // 检查缓存是否完全过期
    if (config && age > config.duration + (config.staleWhileRevalidate || 0)) {
      console.log(`[缓存过期] ${key} - 过期时间: ${Math.round(age / 1000)}s`);
      this.delete(type, params);
      return null;
    }

    console.log(`[缓存命中] ${key} - 缓存年龄: ${Math.round(age / 1000)}s`);

    return {
      data: this.cache.get(key),
      isStale: false,
      age: age
    };
  }

  /**
   * 删除缓存
   */
  delete(type, params = {}) {
    const key = this._generateKey(type, params);
    this.cache.delete(key);
    this.timestamps.delete(key);
    console.log(`[缓存删除] ${key}`);
  }

  /**
   * 清除指定类型的所有缓存
   */
  clearType(type) {
    const keysToDelete = [];

    for (const key of this.cache.keys()) {
      if (key.startsWith(type + ':') || key === type) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.timestamps.delete(key);
    });

    console.log(`[缓存清除] ${type} - 清除了 ${keysToDelete.length} 条缓存`);
  }

  /**
   * 清除所有缓存
   */
  clearAll() {
    const size = this.cache.size;
    this.cache.clear();
    this.timestamps.clear();
    console.log(`[缓存清除] 所有缓存 - 清除了 ${size} 条缓存`);
  }

  /**
   * 清理最旧的缓存条目
   */
  _cleanupOldest() {
    let oldestKey = null;
    let oldestTimestamp = Infinity;

    for (const [key, timestamp] of this.timestamps.entries()) {
      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.timestamps.delete(oldestKey);
      console.log(`[缓存清理] ${oldestKey} - 清理最旧缓存`);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const stats = {
      totalEntries: this.cache.size,
      maxSize: this.maxCacheSize,
      usage: `${this.cache.size}/${this.maxCacheSize}`,
      entries: []
    };

    for (const [key, timestamp] of this.timestamps.entries()) {
      const age = Date.now() - timestamp;
      stats.entries.push({
        key,
        age: `${Math.round(age / 1000)}s`,
        ageMs: age
      });
    }

    return stats;
  }

  /**
   * 强制刷新缓存（用于数据更新后清除相关缓存）
   */
  invalidateRelatedCache(dataType) {
    // 当设备数据更新时，清除设备相关缓存
    if (dataType === 'device') {
      this.clearType('devices');
      this.clearType('deviceDetail');
    }

    // 当工单数据更新时，清除工单相关缓存
    if (dataType === 'workorder') {
      this.clearType('workOrders');
      this.clearType('workOrderDetail');
    }

    // 当物料数据更新时，清除物料相关缓存
    if (dataType === 'material') {
      this.clearType('materials');
    }
  }
}

// 创建单例实例
const cacheManager = new CacheManager();

module.exports = {
  cacheManager,
  CACHE_CONFIG,

  // 便捷方法（向后兼容）
  setCache: (type, data, params) => cacheManager.set(type, data, params),

  // 新的getCache方法，支持stale-while-revalidate
  getCache: (type, params) => {
    const result = cacheManager.get(type, params);
    // 向后兼容：如果返回null或直接数据，返回原格式
    if (!result) return null;
    // 如果是stale格式，返回data字段
    if (typeof result === 'object' && 'data' in result) {
      return result.data; // 向后兼容，只返回data
    }
    return result;
  },

  // 新方法：获取完整的缓存信息（包括stale状态）
  getCacheWithInfo: (type, params) => cacheManager.get(type, params),

  deleteCache: (type, params) => cacheManager.delete(type, params),
  clearType: (type) => cacheManager.clearType(type),
  clearAll: () => cacheManager.clearAll(),
  getStats: () => cacheManager.getStats(),
  invalidateCache: (dataType) => cacheManager.invalidateRelatedCache(dataType)
};