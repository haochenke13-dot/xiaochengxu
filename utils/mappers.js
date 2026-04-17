/**
 * 数据映射工具
 * 用于将后端 API 返回的数据转换为前端期望的格式
 */

const config = require('./config');

/**
 * 格式化时间
 */
function formatTime(dateString, locale = 'zh') {
  if (!dateString) return '';

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  if (locale === 'en') {
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * 设备数据映射：后端 → 前端
 */
function mapDevice(backendDevice, locale = 'zh') {
  if (!backendDevice) return null;

  const { deviceStatus, ticketTypeMap } = config;

  // 提取遥测数据
  const telemetry = backendDevice.telemetries && backendDevice.telemetries[0] || {};

  // 将遥测数据转换为参数列表
  const params = [];
  if (telemetry.temperature !== undefined && telemetry.temperature !== null) {
    params.push({
      label: locale === 'en' ? 'Temperature' : '温度',
      value: `${telemetry.temperature}℃`
    });
  }
  if (telemetry.cpu_usage !== undefined && telemetry.cpu_usage !== null) {
    params.push({
      label: locale === 'en' ? 'CPU Usage' : 'CPU使用率',
      value: `${telemetry.cpu_usage}%`
    });
  }
  if (telemetry.memory_usage !== undefined && telemetry.memory_usage !== null) {
    params.push({
      label: locale === 'en' ? 'Memory Usage' : '内存使用率',
      value: `${telemetry.memory_usage}%`
    });
  }
  if (telemetry.uptime !== undefined && telemetry.uptime !== null) {
    params.push({
      label: locale === 'en' ? 'Uptime' : '运行时间',
      value: `${telemetry.uptime}h`
    });
  }

  // 智能生成告警（基于遥测数据）
  const alarms = [];
  if (telemetry.error_code || telemetry.error_message) {
    alarms.push({
      id: `AL-${backendDevice.id}`,
      level: telemetry.error_code ? 'danger' : 'warning',
      title: telemetry.error_message || (locale === 'en' ? 'Device Error' : '设备异常'),
      time: formatTime(telemetry.recorded_at || backendDevice.updated_at, locale)
    });
  }

  // 根据状态生成告警
  if (backendDevice.status === 'warning' && alarms.length === 0) {
    alarms.push({
      id: `AL-${backendDevice.id}-warning`,
      level: 'warning',
      title: locale === 'en' ? 'Device Warning' : '设备告警',
      time: formatTime(backendDevice.updated_at, locale)
    });
  }

  return {
    deviceId: String(backendDevice.id),
    deviceNum: backendDevice.id,  // 保存数字ID用于API调用
    deviceName: backendDevice.name,
    model: backendDevice.model?.model_name || '',
    type: backendDevice.model?.model_name || backendDevice.model?.series_code || '',
    status: backendDevice.status,
    runtime: telemetry.uptime ? `${telemetry.uptime} ${locale === 'en' ? 'hrs' : '小时'}` : '0',
    lastHeartbeat: formatTime(backendDevice.updated_at, locale),
    location: backendDevice.location || '',
    params: params,
    alarms: alarms,
    // 保存原始数据
    _raw: backendDevice
  };
}

/**
 * 工单数据映射：后端 → 前端
 */
function mapTicket(backendTicket, locale = 'zh', deviceCache = {}, userCache = {}) {
  if (!backendTicket) return null;

  const { ticketTypeMap, ticketStatusMap, priorityMap } = config;

  // 获取设备名称
  let deviceName = '';
  if (backendTicket.device_id) {
    if (deviceCache[backendTicket.device_id]) {
      deviceName = deviceCache[backendTicket.device_id].name;
    }
  }

  // 获取用户名称
  let assigneeName = '';
  let creatorName = '';
  if (backendTicket.assignee_id && userCache[backendTicket.assignee_id]) {
    assigneeName = userCache[backendTicket.assignee_id].full_name || userCache[backendTicket.assignee_id].username;
  }
  if (backendTicket.creator_id && userCache[backendTicket.creator_id]) {
    creatorName = userCache[backendTicket.creator_id].full_name || userCache[backendTicket.creator_id].username;
  }

  // 转换评论为日志格式
  const logs = [];
  if (backendTicket.comments && backendTicket.comments.length > 0) {
    backendTicket.comments.forEach(comment => {
      const userName = userCache[comment.user_id]?.full_name || userCache[comment.user_id]?.username || 'Unknown';
      logs.push({
        label: locale === 'en' ? 'Comment' : '评论',
        value: `${userName} ${locale === 'en' ? 'commented at' : '于'} ${formatTime(comment.created_at, locale)}: ${comment.content}`
      });
    });
  }

  // 添加初始日志
  logs.unshift({
    label: locale === 'en' ? 'Created' : '工单创建',
    value: `${creatorName} ${locale === 'en' ? 'submitted at' : '于'} ${formatTime(backendTicket.created_at, locale)} ${locale === 'en' ? 'submitted' : '提交'}`
  });

  // 获取翻译后的类型名称
  const typeInfo = ticketTypeMap[backendTicket.type] || { zh: backendTicket.type, en: backendTicket.type };
  const priorityInfo = priorityMap[backendTicket.priority] || { zh: backendTicket.priority, en: backendTicket.priority };

  return {
    workOrderId: backendTicket.ticket_no || String(backendTicket.id),
    // 保存数字ID用于调用详情接口
    workOrderNum: backendTicket.id,
    title: backendTicket.title,
    deviceId: backendTicket.device_id ? String(backendTicket.device_id) : '',
    deviceName: deviceName,
    type: typeInfo[locale] || typeInfo.zh,
    status: ticketStatusMap[backendTicket.status] || backendTicket.status,
    priority: priorityInfo[locale] || priorityInfo.zh,
    assigneeId: backendTicket.assignee_id ? String(backendTicket.assignee_id) : '',
    assigneeName: assigneeName,
    creatorId: backendTicket.creator_id ? String(backendTicket.creator_id) : '',
    creatorName: creatorName,
    createdAt: formatTime(backendTicket.created_at, locale),
    desc: backendTicket.description || '',
    logs: logs,
    // 保存原始数据
    _raw: backendTicket
  };
}

/**
 * 物料数据映射：后端 → 前端
 */
function mapMaterial(backendMaterial, locale = 'zh') {
  if (!backendMaterial) return null;

  const { materialCategoryMap } = config;

  // 获取分类信息
  const categoryInfo = materialCategoryMap[backendMaterial.category] || {
    zh: backendMaterial.category || '',
    en: backendMaterial.category || ''
  };

  // 格式化价格
  const formattedPrice = backendMaterial.price !== undefined ?
    `¥${backendMaterial.price.toLocaleString()}` : '';

  return {
    materialId: String(backendMaterial.id).padStart(6, '0'),
    name: backendMaterial.name,
    spec: backendMaterial.sku || '',
    category: backendMaterial.category || '',
    categoryName: categoryInfo[locale] || categoryInfo.zh,
    price: formattedPrice,
    stockQuantity: backendMaterial.stock_quantity || 0,
    unit: backendMaterial.unit || 'pcs',
    minStock: backendMaterial.min_stock || 0,
    maxStock: backendMaterial.max_stock || 0,
    description: backendMaterial.description || '',
    imageUrl: backendMaterial.image_url || '',
    // 保存原始数据
    _raw: backendMaterial
  };
}

/**
 * 设备系列映射：后端 → 前端
 */
function mapDeviceSeries(backendSeries) {
  if (!backendSeries) return null;

  return {
    id: backendSeries.series_code,
    seriesNum: backendSeries.id,  // 保存数字ID用于API调用
    name: backendSeries.name,
    nameEn: backendSeries.name, // TODO: 后端需要添加英文名称字段
    description: backendSeries.description || '',
    // 保存原始数据
    _raw: backendSeries
  };
}

/**
 * 设备型号映射：后端 → 前端
 */
function mapDeviceModel(backendModel) {
  if (!backendModel) return null;

  return {
    id: String(backendModel.id),
    name: backendModel.model_name,
    nameEn: backendModel.model_name, // TODO: 后端需要添加英文名称字段
    seriesId: String(backendModel.series_id),
    code: backendModel.model_code,
    isCustom: backendModel.is_custom || false,
    customBrand: backendModel.custom_brand || '',
    imageUrl: backendModel.image_url || '',
    specs: backendModel.specs || '',
    description: backendModel.description || '',
    // 保存原始数据
    _raw: backendModel
  };
}

/**
 * 用户信息映射：后端 → 前端
 */
function mapUser(backendUser, locale = 'zh') {
  if (!backendUser) return null;

  const { roleMap } = config;

  return {
    userId: String(backendUser.id),
    name: backendUser.full_name || backendUser.username,
    roleCode: roleMap[backendUser.role] || 'customer',
    tenantId: backendUser.company_id ? String(backendUser.company_id) : '',
    tenantName: backendUser.company?.name || '',
    mobile: backendUser.phone || '',
    email: backendUser.email || '',
    isActive: backendUser.is_active || false,
    // 保存原始数据
    _raw: backendUser
  };
}

/**
 * 批量映射设备列表
 */
function mapDeviceList(backendDeviceList, locale = 'zh') {
  if (!Array.isArray(backendDeviceList)) return [];
  return backendDeviceList.map(device => mapDevice(device, locale));
}

/**
 * 批量映射工单列表
 */
function mapTicketList(backendTicketList, locale = 'zh', deviceCache = {}, userCache = {}) {
  if (!Array.isArray(backendTicketList)) return [];
  return backendTicketList.map(ticket => mapTicket(ticket, locale, deviceCache, userCache));
}

/**
 * 批量映射物料列表
 */
function mapMaterialList(backendMaterialList, locale = 'zh') {
  if (!Array.isArray(backendMaterialList)) return [];
  return backendMaterialList.map(material => mapMaterial(material, locale));
}

module.exports = {
  formatTime,
  mapDevice,
  mapTicket,
  mapMaterial,
  mapDeviceSeries,
  mapDeviceModel,
  mapUser,
  mapDeviceList,
  mapTicketList,
  mapMaterialList
};
