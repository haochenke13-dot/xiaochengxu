/**
 * API 配置文件
 * 用于管理后端 API 的基础配置
 */

module.exports = {
  // 后端 API 基础地址
  baseURL: 'http://cd-1.frp.one:20441',

  // API 版本
  apiVersion: 'v1',

  // 请求超时时间（毫秒）
  timeout: 30000,

  // Token 存储的 key
  tokenKey: 'kcloud_access_token',

  // 用户信息存储的 key
  userKey: 'kcloud_user_info',

  // 是否开启调试模式（生产环境建议关闭）
  debug: true,

  // 设备状态映射
  deviceStatus: {
    running: { zh: '运行中', en: 'Running', color: '#10B981' },
    warning: { zh: '告警', en: 'Warning', color: '#F59E0B' },
    offline: { zh: '离线', en: 'Offline', color: '#6B7280' },
    error: { zh: '故障', en: 'Error', color: '#EF4444' }
  },

  // 工单类型映射（后端 → 前端）
  ticketTypeMap: {
    'fault': { zh: '维修工单', en: 'Repair Order' },
    'maintenance': { zh: '保养工单', en: 'Maintenance Order' },
    'installation': { zh: '安装工单', en: 'Installation Order' },
    'repair': { zh: '巡检工单', en: 'Inspection Order' }
  },

  // 工单状态映射（后端 → 前端）
  ticketStatusMap: {
    'pending': 'pending',
    'in_progress': 'processing',
    'completed': 'completed',
    'closed': 'closed'
  },

  // 工单优先级映射
  priorityMap: {
    'high': { zh: '高', en: 'High' },
    'medium': { zh: '中', en: 'Medium' },
    'low': { zh: '低', en: 'Low' }
  },

  // 物料分类映射
  materialCategoryMap: {
    'parts': { zh: '零件', en: 'Parts', icon: 'part', color: '#0EA5E9' },
    'accessories': { zh: '配件', en: 'Accessories', icon: 'accessory', color: '#8B5CF6' },
    'consumables': { zh: '耗材', en: 'Consumables', icon: 'consumable', color: '#10B981' }
  },

  // 用户角色映射（后端 → 前端）
  roleMap: {
    'admin': 'engineer',
    'manager': 'tenantAdmin',
    'employee': 'customer'
  },

  // 设备系列枚举
  deviceSeries: {
    'venus': 'venus',
    'smart': 'smart',
    'other': 'other'
  }
};
