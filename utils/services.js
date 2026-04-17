const mock = require("./mock");
const { getLocale } = require("./i18n");
const { getCurrentProfile, switchProfile } = require("./session");
const request = require("./request");
const mappers = require("./mappers");
const config = require("./config");
const { getCache, setCache, invalidateCache } = require("./cache");

const DEVICE_TYPE_LABELS = {
  包装设备: { zh: "包装设备", en: "Packaging" },
  灌装设备: { zh: "灌装设备", en: "Filling" },
  贴标设备: { zh: "贴标设备", en: "Labeling" },
};

const WORKORDER_TYPE_LABELS = {
  维修工单: { zh: "维修工单", en: "Repair Order" },
  保养工单: { zh: "保养工单", en: "Maintenance Order" },
  安装工单: { zh: "安装工单", en: "Installation Order" },
  巡检工单: { zh: "巡检工单", en: "Inspection Order" },
};

const PRIORITY_LABELS = {
  低: { zh: "低", en: "Low" },
  中: { zh: "中", en: "Medium" },
  高: { zh: "高", en: "High" },
};

const NOTIFICATION_CATEGORY_LABELS = {
  系统通知: { zh: "系统通知", en: "System" },
  工单通知: { zh: "工单通知", en: "Orders" },
  告警通知: { zh: "告警通知", en: "Alerts" },
};

const PARAM_LABELS = {
  主轴温度: { zh: "主轴温度", en: "Spindle Temp" },
  线速度: { zh: "线速度", en: "Line Speed" },
  电流: { zh: "电流", en: "Current" },
  压力: { zh: "压力", en: "Pressure" },
  液位: { zh: "液位", en: "Level" },
  转速: { zh: "转速", en: "RPM" },
  主控版本: { zh: "主控版本", en: "Controller Ver." },
  标签精度: { zh: "标签精度", en: "Label Precision" },
  产能: { zh: "产能", en: "Output" },
};

const DEVICE_NAME_LABELS = {
  "DEV-1001": { zh: "包装线 A1", en: "Packaging Line A1" },
  "DEV-1002": { zh: "灌装线 B2", en: "Filling Line B2" },
  "DEV-2001": { zh: "贴标机 C3", en: "Labeler C3" },
};

const ALARM_TITLE_LABELS = {
  "AL-1001": { zh: "封口温度波动", en: "Sealing temperature drift" },
  "AL-1002": { zh: "进料压力异常", en: "Feed pressure anomaly" },
  "AL-1003": { zh: "维护周期将至", en: "Maintenance window approaching" },
  "AL-2001": { zh: "设备离线", en: "Device offline" },
};

const BANNER_TEXT = {
  "banner-1": {
    title: { zh: "季度保养计划已发布", en: "Quarterly maintenance plan released" },
    desc: { zh: "请在 4 月 10 日前完成重点设备巡检与照片回传。", en: "Complete priority inspections and photo uploads before April 10." },
    type: { zh: "通知", en: "Notice" },
  },
  "banner-2": {
    title: { zh: "售后培训内容更新", en: "Service training content updated" },
    desc: { zh: "新增包装线张紧模块调试课程，支持工程师与客户侧查看。", en: "A new packaging tension-module course is now available for engineers and customers." },
    type: { zh: "培训", en: "Training" },
  },
};

const NOTIFICATION_TEXT = {
  "NT-1": {
    title: { zh: "Beta 试运行开启", en: "Beta pilot is now live" },
    desc: { zh: "本周将开放华东食品工厂试点租户。", en: "The East Food Factory tenant will join the pilot this week." },
  },
  "NT-2": {
    title: { zh: "新工单 WO-2001 待处理", en: "New work order WO-2001 is pending" },
    desc: { zh: "包装线 A1 维修工单已创建，请及时跟进。", en: "A repair order for Packaging Line A1 was created. Please follow up soon." },
  },
  "NT-3": {
    title: { zh: "灌装线 B2 压力异常", en: "Pressure anomaly on Filling Line B2" },
    desc: { zh: "设备出现中级告警，建议尽快查看设备详情。", en: "A medium alert was triggered. Open the device detail soon." },
  },
};

const CONTENT_TEXT = {
  "CT-1": {
    title: { zh: "包装线 A1 封口模块校准教程", en: "Packaging Line A1 sealing module calibration" },
    summary: { zh: "适合工程师与租户管理员快速定位常见温控问题。", en: "A quick guide for engineers and tenant admins to diagnose common temperature-control issues." },
    duration: { zh: "视频 8 分钟", en: "Video · 8 min" },
  },
  "CT-2": {
    title: { zh: "灌装线压力波动的 5 个排查步骤", en: "5 checks for filling-line pressure fluctuation" },
    summary: { zh: "从进料、阀门、滤芯到参数校验的现场排查清单。", en: "A field checklist covering feed, valves, filters, and parameter validation." },
    duration: { zh: "阅读 5 分钟", en: "Read · 5 min" },
  },
  "CT-3": {
    title: { zh: "客户侧如何通过扫码快速报修", en: "How customers can report issues with a scan" },
    summary: { zh: "扫码后自动带入设备信息，减少人工填写。", en: "Device context is filled automatically after a scan to reduce manual input." },
    duration: { zh: "阅读 3 分钟", en: "Read · 3 min" },
  },
};

const KNOWLEDGE_TEXT = {
  "KN-1": {
    title: { zh: "作业指导书", en: "SOP Guide" },
    desc: { zh: "查看设备安装、维修与保养 SOP。", en: "Browse SOPs for installation, repair, and maintenance." },
  },
  "KN-2": {
    title: { zh: "售后培训视频", en: "Training Videos" },
    desc: { zh: "分角色查看培训课程与案例复盘。", en: "Watch role-based training and case reviews." },
  },
  "KN-3": {
    title: { zh: "常见问题", en: "FAQ" },
    desc: { zh: "现场常见报错与解决步骤汇总。", en: "A summary of common on-site issues and fixes." },
  },
};

const WORKORDER_TEXT = {
  "WO-2001": {
    title: { zh: "包装线 A1 封口温度偏差", en: "Packaging Line A1 sealing temperature deviation" },
    desc: { zh: "封口温度波动导致合格率下降，请尽快排查加热模块。", en: "Sealing temperature drift is reducing yield. Please inspect the heating module." },
    logs: [
      {
        zh: { label: "工单创建", value: "陈操作员 于 2026-03-31 09:12 提交" },
        en: { label: "Created", value: "Submitted by Chen at 2026-03-31 09:12" },
      },
    ],
  },
  "WO-2002": {
    title: { zh: "灌装线 B2 例行保养", en: "Routine maintenance for Filling Line B2" },
    desc: { zh: "按季度保养计划执行滤芯更换与状态复检。", en: "Replace the filter core and run a status recheck as part of the quarterly plan." },
    logs: [
      {
        zh: { label: "工单创建", value: "王主管 于 2026-03-29 14:05 提交" },
        en: { label: "Created", value: "Submitted by Wang at 2026-03-29 14:05" },
      },
      {
        zh: { label: "已接单", value: "李工 于 2026-03-29 14:35 接单处理" },
        en: { label: "Accepted", value: "Accepted by Li at 2026-03-29 14:35" },
      },
    ],
  },
  "WO-2003": {
    title: { zh: "贴标机 C3 离线排查", en: "Offline diagnosis for Labeler C3" },
    desc: { zh: "排查网络模块掉线原因并确认恢复。", en: "Investigate the network-module disconnect and confirm recovery." },
    logs: [
      {
        zh: { label: "工单创建", value: "李工 于 2026-03-28 09:50 提交" },
        en: { label: "Created", value: "Submitted by Li at 2026-03-28 09:50" },
      },
      {
        zh: { label: "已接单", value: "李工 于 2026-03-28 10:02 接单处理" },
        en: { label: "Accepted", value: "Accepted by Li at 2026-03-28 10:02" },
      },
      {
        zh: { label: "已完结", value: "李工 于 2026-03-28 18:20 完成并上传报告" },
        en: { label: "Closed", value: "Closed by Li at 2026-03-28 18:20 with report uploaded" },
      },
    ],
  },
};

const LOCALE_TEXT = {
  zh: {
    createdLabel: "工单创建",
    createdValue: "{name} 于 2026-03-31 10:00 提交",
    acceptedLabel: "已接单",
    acceptedValue: "{name} 于 2026-03-31 10:10 接单处理",
    closedLabel: "已完结",
    closedValue: "{name} 于 2026-03-31 10:25 完成并提交结果",
    scanEmpty: "未识别到二维码内容",
    scanDeviceMissing: "设备不存在或无权限访问",
    scanOrderMissing: "工单不存在或已失效",
    scanUnsupported: "二维码内容暂不支持",
  },
  en: {
    createdLabel: "Created",
    createdValue: "{name} submitted at 2026-03-31 10:00",
    acceptedLabel: "Accepted",
    acceptedValue: "{name} accepted at 2026-03-31 10:10",
    closedLabel: "Closed",
    closedValue: "{name} completed and submitted results at 2026-03-31 10:25",
    scanEmpty: "QR content was not recognized",
    scanDeviceMissing: "Device not found or access denied",
    scanOrderMissing: "Work order not found or expired",
    scanUnsupported: "This QR content is not supported yet",
  },
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function localeValue(dictionary, locale, fallback) {
  if (!dictionary) {
    return fallback;
  }
  return dictionary[locale] || dictionary.zh || fallback;
}

function currentLocale() {
  return getLocale();
}

function t(key, params = {}, locale = currentLocale()) {
  const template = LOCALE_TEXT[locale][key] || LOCALE_TEXT.zh[key] || "";
  return Object.keys(params).reduce((result, name) => result.replace(new RegExp(`\\{${name}\\}`, "g"), params[name]), template);
}

function localizeBanner(item, locale) {
  const text = BANNER_TEXT[item.id];
  return {
    ...item,
    title: text ? localeValue(text.title, locale, item.title) : item.title,
    desc: text ? localeValue(text.desc, locale, item.desc) : item.desc,
    type: text ? localeValue(text.type, locale, item.type) : item.type,
  };
}

function localizeKnowledgeItem(item, locale) {
  const text = KNOWLEDGE_TEXT[item.id];
  return {
    ...item,
    title: text ? localeValue(text.title, locale, item.title) : item.title,
    desc: text ? localeValue(text.desc, locale, item.desc) : item.desc,
  };
}

function localizeNotification(item, locale) {
  const text = NOTIFICATION_TEXT[item.id];
  return {
    ...item,
    title: text ? localeValue(text.title, locale, item.title) : item.title,
    desc: text ? localeValue(text.desc, locale, item.desc) : item.desc,
    categoryLabel: localeValue(NOTIFICATION_CATEGORY_LABELS[item.category], locale, item.category),
  };
}

function localizeContent(item, locale) {
  const text = CONTENT_TEXT[item.contentId];
  return {
    ...item,
    title: text ? localeValue(text.title, locale, item.title) : item.title,
    summary: text ? localeValue(text.summary, locale, item.summary) : item.summary,
    duration: text ? localeValue(text.duration, locale, item.duration) : item.duration,
  };
}

function localizeDevice(item, locale) {
  return {
    ...item,
    name: localeValue(DEVICE_NAME_LABELS[item.deviceId], locale, item.name),
    type: localeValue(DEVICE_TYPE_LABELS[item.type], locale, item.type),
    runtime: locale === "en" ? String(item.runtime).replace(" 小时", "h") : item.runtime,
    params: (item.params || []).map((param) => ({
      ...param,
      label: localeValue(PARAM_LABELS[param.label], locale, param.label),
    })),
    alarms: (item.alarms || []).map((alarm) => ({
      ...alarm,
      title: localeValue(ALARM_TITLE_LABELS[alarm.id], locale, alarm.title),
    })),
  };
}

function localizeWorkOrder(item, locale) {
  const text = WORKORDER_TEXT[item.workOrderId];
  return {
    ...item,
    title: text ? localeValue(text.title, locale, item.title) : item.title,
    deviceName: localeValue(DEVICE_NAME_LABELS[item.deviceId], locale, item.deviceName),
    type: localeValue(WORKORDER_TYPE_LABELS[item.type], locale, item.type),
    priority: localeValue(PRIORITY_LABELS[item.priority], locale, item.priority),
    desc: text ? localeValue(text.desc, locale, item.desc) : item.desc,
    logs: (item.logs || []).map((log, index) => {
      const preset = text && text.logs ? text.logs[index] : null;
      if (preset) {
        const localized = preset[locale] || preset.zh;
        return {
          label: localized.label,
          value: localized.value,
        };
      }
      return { ...log };
    }),
  };
}

function localizeTenant(tenant, locale) {
  if (!tenant) {
    return tenant;
  }
  const typeMap = {
    客户租户: { zh: "客户租户", en: "Customer Tenant" },
    内部租户: { zh: "内部租户", en: "Internal Tenant" },
  };
  return {
    ...tenant,
    type: localeValue(typeMap[tenant.type], locale, tenant.type),
  };
}

function getProfile() {
  return clone(getCurrentProfile());
}

async function loginAsRole(roleCode) {
  try {
    // 使用真实 API 登录
    const profile = await switchProfile(roleCode);
    return clone(profile);
  } catch (error) {
    console.error('登录失败，降级到 mock 数据:', error);
    // 降级到 mock 数据
    const profile = switchProfile(roleCode);
    return clone(profile);
  }
}

function getTenantUsers(tenantId) {
  return clone(mock.users.filter((item) => item.tenantId === tenantId));
}

function getTenantDetail(tenantId) {
  return localizeTenant(clone(mock.tenants.find((item) => item.tenantId === tenantId)), currentLocale());
}

async function getVisibleDevices(profile, filters = {}) {
  const locale = currentLocale();

  // 检查 profile 参数是否有效
  if (!profile) {
    console.error('getVisibleDevices: profile 参数无效');
    return [];
  }

  // 尝试从缓存获取数据
  const cacheKey = { ...filters, roleCode: profile.roleCode, tenantId: profile.tenantId };
  const cachedData = getCache('devices', cacheKey);
  if (cachedData) {
    console.log('使用缓存的设备列表');
    return cachedData;
  }

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');

    // 确保 deviceScope 是数组
    const deviceScope = Array.isArray(profile.deviceScope) ? profile.deviceScope : [];

    // 直接返回 mock 数据，不抛出错误
    let list = mock.devices.filter((item) => {
      if (profile.roleCode === "engineer") {
        return deviceScope.includes(item.deviceId);
      }
      return item.tenantId === profile.tenantId && deviceScope.includes(item.deviceId);
    });

    if (filters.status && filters.status !== "all") {
      list = list.filter((item) => item.status === filters.status);
    }

    if (filters.type && filters.type !== "all") {
      list = list.filter((item) => item.type === filters.type);
    }

    const result = clone(list).map((item) => localizeDevice(item, locale));

    // 缓存结果
    setCache('devices', result, cacheKey);

    return result;
  }

  try {
    // 构建查询参数
    const params = {};

    // 根据用户角色过滤
    if (profile.roleCode === "admin") {
      // 系统管理员可以看到所有设备，不传递 my_devices 参数
      console.log('系统管理员，获取所有设备');
    } else if (profile.roleCode === "engineer") {
      params.my_devices = true; // 只看我的设备
    } else {
      // TODO: 后端需要添加 company_id 过滤参数
      // params.company_id = profile.tenantId;
    }

    // 状态过滤
    if (filters.status && filters.status !== "all") {
      params.status = filters.status;
    }

    // 型号过滤
    if (filters.model_id) {
      params.model_id = filters.model_id;
    }

    // 调用后端 API
    const backendDevices = await request.get('/api/v1/devices/', params);

    // 映射数据
    const devices = mappers.mapDeviceList(backendDevices, locale);

    // 客户端额外过滤（如果后端不支持某些过滤条件）
    let filteredDevices = devices;

    // 类型过滤（如果需要）
    if (filters.type && filters.type !== "all") {
      filteredDevices = filteredDevices.filter((item) => {
        const deviceType = item.type.toLowerCase();
        const filterType = filters.type.toLowerCase();
        return deviceType.includes(filterType) || filterType.includes(deviceType);
      });
    }

    // 权限过滤（基于用户的设备范围）
    if (profile.deviceScope && profile.deviceScope.length > 0) {
      filteredDevices = filteredDevices.filter((item) =>
        profile.deviceScope.includes(item.deviceId)
      );
    }

    // 缓存结果
    setCache('devices', filteredDevices, cacheKey);

    return filteredDevices;
  } catch (error) {
    console.log('获取设备列表失败，使用 mock 数据:', error.message);
    // 降级到 mock 数据
    let list = mock.devices.filter((item) => {
      if (profile.roleCode === "engineer") {
        return profile.deviceScope.includes(item.deviceId);
      }
      return item.tenantId === profile.tenantId && profile.deviceScope.includes(item.deviceId);
    });

    if (filters.status && filters.status !== "all") {
      list = list.filter((item) => item.status === filters.status);
    }

    if (filters.type && filters.type !== "all") {
      list = list.filter((item) => item.type === filters.type);
    }

    const result = clone(list).map((item) => localizeDevice(item, locale));

    // 缓存结果
    setCache('devices', result, cacheKey);

    return result;
  }
}

async function getDeviceDetail(deviceId) {
  const locale = currentLocale();
  const profile = getCurrentProfile();

  console.log('=== getDeviceDetail 调用 ===');
  console.log('传入的 deviceId:', deviceId);
  console.log('deviceId 类型:', typeof deviceId);

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    // 降级到 mock 数据
    const visibleIds = mock.devices
      .filter((item) => {
        if (profile.roleCode === "engineer") {
          return profile.deviceScope.includes(item.deviceId);
        }
        return item.tenantId === profile.tenantId && profile.deviceScope.includes(item.deviceId);
      })
      .map((item) => item.deviceId);
    const target = mock.devices.find((item) => item.deviceId === deviceId && visibleIds.includes(item.deviceId));
    return target ? localizeDevice(clone(target), locale) : null;
  }

  try {
    // 调用后端 API
    console.log('准备调用后端API:', `/api/v1/devices/${deviceId}`);
    const backendDevice = await request.get(`/api/v1/devices/${deviceId}`);
    console.log('后端返回的设备数据:', backendDevice);

    // 映射数据
    const device = mappers.mapDevice(backendDevice, locale);

    // 权限检查
    // 系统管理员可以看到所有设备
    if (profile.roleCode === "admin") {
      console.log('系统管理员，允许查看设备详情');
      return device;
    }

    // engineer可以查看设备权限范围内的设备
    if (profile.roleCode === "engineer") {
      if (profile.deviceScope.includes(deviceId)) {
        console.log('engineer权限检查通过，允许查看设备详情');
        return device;
      } else {
        console.log('engineer权限检查失败，无权查看此设备');
        return null;
      }
    }

    // 其他角色只能查看同一租户的设备
    if (profile.deviceScope.includes(deviceId)) {
      console.log('租户权限检查通过，允许查看设备详情');
      return device;
    }

    console.log('权限检查失败，无权查看此设备');
    return null;
  } catch (error) {
    // 详细的错误日志
    console.error('获取设备详情失败，使用 mock 数据');
    console.error('设备ID:', deviceId);
    console.error('状态码:', error.response?.status);
    console.error('响应数据:', JSON.stringify(error.response?.data, null, 2));
    console.error('完整错误:', error);
    // 降级到 mock 数据
    const visibleIds = mock.devices
      .filter((item) => {
        if (profile.roleCode === "engineer") {
          return profile.deviceScope.includes(item.deviceId);
        }
        return item.tenantId === profile.tenantId && profile.deviceScope.includes(item.deviceId);
      })
      .map((item) => item.deviceId);
    const target = mock.devices.find((item) => item.deviceId === deviceId && visibleIds.includes(item.deviceId));
    return target ? localizeDevice(clone(target), locale) : null;
  }
}

async function getVisibleWorkOrders(profile, status = "all") {
  const locale = currentLocale();

  console.log('=== getVisibleWorkOrders 调用 ===');
  console.log('status参数:', status);
  console.log('profile:', profile);

  // 尝试从缓存获取数据
  const cacheKey = { status, roleCode: profile.roleCode, tenantId: profile.tenantId };
  const cachedData = getCache('workOrders', cacheKey);
  if (cachedData) {
    console.log('使用缓存的工单列表，数量:', cachedData.length);
    return cachedData;
  }

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    // 直接返回 mock 数据，不抛出错误
    let list = mock.workOrders.filter((item) => {
      if (profile.roleCode === "engineer") {
        return item.assigneeId === profile.userId || item.creatorId === profile.userId || profile.deviceScope.includes(item.deviceId);
      }
      return item.tenantId === profile.tenantId;
    });

    if (status !== "all") {
      list = list.filter((item) => item.status === status);
    }

    const result = clone(list).map((item) => localizeWorkOrder(item, locale));

    // 缓存结果
    setCache('workOrders', result, cacheKey);

    return result;
  }

  try {
    // 构建查询参数
    const params = {};

    // 状态过滤
    if (status && status !== "all") {
      // 前端状态转后端状态
      const statusMap = {
        'pending': 'pending',
        'processing': 'in_progress',
        'completed': 'completed',
        'closed': 'closed'
      };
      params.status = statusMap[status] || status;
    }

    // 调用后端 API
    console.log('准备调用后端API: /api/v1/tickets/', '参数:', params);
    const backendTickets = await request.get('/api/v1/tickets/', params);
    console.log('后端返回的工单列表:', backendTickets);
    console.log('工单数量:', backendTickets?.length || 0);
    console.log('第一个工单对象 (JSON):', JSON.stringify(backendTickets[0], null, 2));

    // 获取关联数据（设备和用户信息）
    const deviceIds = [...new Set(backendTickets.filter(t => t.device_id).map(t => t.device_id))];
    const userIds = [...new Set([
      ...backendTickets.filter(t => t.creator_id).map(t => t.creator_id),
      ...backendTickets.filter(t => t.assignee_id).map(t => t.assignee_id)
    ])];

    // 批量获取设备信息
    const deviceCache = {};
    for (const deviceId of deviceIds) {
      try {
        const device = await request.get(`/api/v1/devices/${deviceId}`);
        deviceCache[deviceId] = device;
      } catch (e) {
        console.warn(`获取设备 ${deviceId} 信息失败:`, e);
      }
    }

    // 批量获取用户信息
    const userCache = {};
    for (const userId of userIds) {
      try {
        const user = await request.get(`/api/v1/users/${userId}`);
        userCache[userId] = user;
      } catch (e) {
        console.warn(`获取用户 ${userId} 信息失败:`, e);
      }
    }

    // 映射数据
    const tickets = mappers.mapTicketList(backendTickets, locale, deviceCache, userCache);
    console.log('映射后的工单列表（未过滤）:', tickets);
    console.log('映射后工单数量:', tickets.length);
    console.log('第一个工单对象的ID字段:', {
      workOrderId: tickets[0]?.workOrderId,
      workOrderNum: tickets[0]?.workOrderNum,
      id: tickets[0]?._raw?.id
    });

    // 客户端过滤（基于用户角色和权限）
    let filteredTickets = tickets;
    console.log('=== 开始权限过滤 ===');
    console.log('用户角色:', profile.roleCode);
    console.log('用户ID:', profile.userId);
    console.log('用户设备权限:', profile.deviceScope);

    // 系统管理员可以看到所有工单
    if (profile.roleCode === "admin") {
      console.log('系统管理员，跳过权限过滤，显示所有工单');
      filteredTickets = tickets;
    } else if (profile.roleCode === "engineer") {
      console.log('执行engineer角色权限过滤');
      filteredTickets = tickets.filter((item) => {
        const canSee = item.assigneeId === profile.userId ||
          item.creatorId === profile.userId ||
          (item.deviceId && profile.deviceScope.includes(item.deviceId));
        console.log(`工单 ${item.workOrderId}:`, {
          assigneeId: item.assigneeId,
          creatorId: item.creatorId,
          deviceId: item.deviceId,
          canSee
        });
        return canSee;
      });
    } else if (profile.tenantId) {
      // TODO: 后端需要添加 company_id 过滤
      // filteredTickets = tickets.filter((item) => item.tenantId === profile.tenantId);
    }

    console.log('过滤后工单数量:', filteredTickets.length);

    // 缓存结果
    setCache('workOrders', filteredTickets, cacheKey);

    return filteredTickets;
  } catch (error) {
    console.log('获取工单列表失败，使用 mock 数据:', error.message);
    // 降级到 mock 数据
    let list = mock.workOrders.filter((item) => {
      if (profile.roleCode === "engineer") {
        return item.assigneeId === profile.userId || item.creatorId === profile.userId || profile.deviceScope.includes(item.deviceId);
      }
      return item.tenantId === profile.tenantId;
    });

    if (status !== "all") {
      list = list.filter((item) => item.status === status);
    }

    const result = clone(list).map((item) => localizeWorkOrder(item, locale));

    // 缓存结果
    setCache('workOrders', result, cacheKey);

    return result;
  }
}

async function getWorkOrderDetail(workOrderId) {
  const locale = currentLocale();
  const profile = getCurrentProfile();

  console.log('=== getWorkOrderDetail 调用 ===');
  console.log('传入的 workOrderId:', workOrderId);
  console.log('workOrderId 类型:', typeof workOrderId);

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    // 直接返回 mock 数据，不抛出错误
    const visibleIds = mock.workOrders
      .filter((item) => {
        if (profile.roleCode === "engineer") {
          return item.assigneeId === profile.userId || item.creatorId === profile.userId || profile.deviceScope.includes(item.deviceId);
        }
        return item.tenantId === profile.tenantId;
      })
      .map((item) => item.workOrderId);
    const target = mock.workOrders.find((item) => item.workOrderId === workOrderId && visibleIds.includes(item.workOrderId));
    return target ? localizeWorkOrder(clone(target), locale) : null;
  }

  try {
    // 调用后端 API
    console.log('准备调用后端API:', `/api/v1/tickets/${workOrderId}`);
    const backendTicket = await request.get(`/api/v1/tickets/${workOrderId}`);
    console.log('后端返回的工单数据:', backendTicket);

    // 获取关联数据
    const deviceCache = {};
    const userCache = {};

    if (backendTicket.device_id) {
      try {
        const device = await request.get(`/api/v1/devices/${backendTicket.device_id}`);
        deviceCache[backendTicket.device_id] = device;
      } catch (e) {
        console.warn('获取设备信息失败:', e);
      }
    }

    if (backendTicket.creator_id) {
      try {
        const creator = await request.get(`/api/v1/users/${backendTicket.creator_id}`);
        userCache[backendTicket.creator_id] = creator;
      } catch (e) {
        console.warn('获取创建者信息失败:', e);
      }
    }

    if (backendTicket.assignee_id) {
      try {
        const assignee = await request.get(`/api/v1/users/${backendTicket.assignee_id}`);
        userCache[backendTicket.assignee_id] = assignee;
      } catch (e) {
        console.warn('获取处理人信息失败:', e);
      }
    }

    // 映射数据
    const ticket = mappers.mapTicket(backendTicket, locale, deviceCache, userCache);

    // 权限检查
    // 系统管理员可以看到所有工单
    if (profile.roleCode === "admin") {
      console.log('系统管理员，允许查看工单详情');
      return ticket;
    }

    // engineer可以查看自己创建的、分配给自己的、或者设备权限范围内的工单
    if (profile.roleCode === "engineer") {
      const canSee = ticket.assigneeId === profile.userId ||
                     ticket.creatorId === profile.userId ||
                     (ticket.deviceId && profile.deviceScope.includes(ticket.deviceId));
      if (canSee) {
        console.log('engineer权限检查通过，允许查看工单详情');
        return ticket;
      } else {
        console.log('engineer权限检查失败，无权查看此工单');
        return null;
      }
    }

    // 其他角色只能查看同一租户的工单
    if (profile.tenantId === ticket.tenantId) {
      console.log('租户权限检查通过，允许查看工单详情');
      return ticket;
    }

    console.log('权限检查失败，无权查看此工单');
    return null;
  } catch (error) {
    // 详细的错误日志
    console.error('获取工单详情失败，降级到 mock 数据');
    console.error('工单ID:', workOrderId);
    console.error('状态码:', error.response?.status);
    console.error('响应数据:', JSON.stringify(error.response?.data, null, 2));
    console.error('完整错误:', error);
    // 降级到 mock 数据
    const visibleIds = mock.workOrders
      .filter((item) => {
        if (profile.roleCode === "engineer") {
          return item.assigneeId === profile.userId || item.creatorId === profile.userId || profile.deviceScope.includes(item.deviceId);
        }
        return item.tenantId === profile.tenantId;
      })
      .map((item) => item.workOrderId);
    const target = mock.workOrders.find((item) => item.workOrderId === workOrderId && visibleIds.includes(item.workOrderId));
    return target ? localizeWorkOrder(clone(target), locale) : null;
  }
}

async function createWorkOrder(payload) {
  const profile = getCurrentProfile();
  const locale = currentLocale();

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    // 直接返回 mock 数据，不抛出错误
    const newOrder = {
      workOrderId: `WO-${Date.now().toString().slice(-5)}`,
      tenantId: profile.tenantId,
      title: payload.title,
      deviceId: payload.deviceId,
      deviceName: payload.deviceName,
      type: payload.type,
      status: "pending",
      assigneeId: "",
      assigneeName: "",
      creatorId: profile.userId,
      creatorName: profile.name,
      createdAt: "2026-03-31 10:00",
      priority: payload.priority,
      desc: payload.desc,
      logs: [
        {
          label: LOCALE_TEXT[locale].createdLabel,
          value: t("createdValue", { name: profile.name }, locale),
        },
      ],
    };
    mock.workOrders.unshift(newOrder);
    return clone(newOrder);
  }

  try {
    // 前端类型转后端类型
    const typeMap = {
      '维修工单': 'fault',
      '保养工单': 'maintenance',
      '安装工单': 'installation',
      '巡检工单': 'repair'
    };

    // 前端优先级转后端优先级
    const priorityMap = {
      '高': 'high',
      '中': 'medium',
      '低': 'low'
    };

    // 构建后端数据
    const backendData = {
      title: payload.title,
      description: payload.desc,
      type: typeMap[payload.type] || payload.type,
      priority: priorityMap[payload.priority] || payload.priority,
      device_id: payload.deviceId ? parseInt(payload.deviceId) : null
    };

    // 调用后端 API
    const backendTicket = await request.post('/api/v1/tickets/', backendData);

    // 获取设备和创建者信息
    const deviceCache = {};
    const userCache = {};

    if (backendTicket.device_id) {
      try {
        const device = await request.get(`/api/v1/devices/${backendTicket.device_id}`);
        deviceCache[backendTicket.device_id] = device;
      } catch (e) {
        console.warn('获取设备信息失败:', e);
      }
    }

    if (backendTicket.creator_id) {
      try {
        const creator = await request.get(`/api/v1/users/${backendTicket.creator_id}`);
        userCache[backendTicket.creator_id] = creator;
      } catch (e) {
        console.warn('获取创建者信息失败:', e);
      }
    }

    // 映射返回数据
    const ticket = mappers.mapTicket(backendTicket, locale, deviceCache, userCache);

    // 清除工单相关缓存
    invalidateCache('workorder');

    return ticket;
  } catch (error) {
    console.error('创建工单失败，降级到 mock 数据:', error);
    // 降级到 mock 数据
    const newOrder = {
      workOrderId: `WO-${Date.now().toString().slice(-5)}`,
      tenantId: profile.tenantId,
      title: payload.title,
      deviceId: payload.deviceId,
      deviceName: payload.deviceName,
      type: payload.type,
      status: "pending",
      assigneeId: "",
      assigneeName: "",
      creatorId: profile.userId,
      creatorName: profile.name,
      createdAt: "2026-03-31 10:00",
      priority: payload.priority,
      desc: payload.desc,
      logs: [
        {
          label: LOCALE_TEXT[locale].createdLabel,
          value: t("createdValue", { name: profile.name }, locale),
        },
      ],
    };
    mock.workOrders.unshift(newOrder);

    // 清除工单相关缓存
    invalidateCache('workorder');

    return clone(newOrder);
  }
}

async function acceptWorkOrder(workOrderId) {
  const profile = getCurrentProfile();
  const locale = currentLocale();

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    // 直接返回 mock 数据，不抛出错误
    const order = mock.workOrders.find((item) => item.workOrderId === workOrderId);
    if (!order) {
      return null;
    }
    order.status = "processing";
    order.assigneeId = profile.userId;
    order.assigneeName = profile.name;
    order.logs.push({
      label: LOCALE_TEXT[locale].acceptedLabel,
      value: t("acceptedValue", { name: profile.name }, locale),
    });
    return clone(order);
  }

  try {
    // 构建后端数据
    const backendData = {
      status: 'in_progress',
      assignee_id: profile._raw?.id || parseInt(profile.userId)
    };

    // 调用后端 API
    const backendTicket = await request.put(`/api/v1/tickets/${workOrderId}`, backendData);

    // 获取关联信息
    const deviceCache = {};
    const userCache = {};

    if (backendTicket.device_id) {
      try {
        const device = await request.get(`/api/v1/devices/${backendTicket.device_id}`);
        deviceCache[backendTicket.device_id] = device;
      } catch (e) {
        console.warn('获取设备信息失败:', e);
      }
    }

    if (backendTicket.assignee_id) {
      try {
        const assignee = await request.get(`/api/v1/users/${backendTicket.assignee_id}`);
        userCache[backendTicket.assignee_id] = assignee;
      } catch (e) {
        console.warn('获取处理人信息失败:', e);
      }
    }

    // 映射返回数据
    const ticket = mappers.mapTicket(backendTicket, locale, deviceCache, userCache);

    // 清除工单相关缓存
    invalidateCache('workorder');

    return ticket;
  } catch (error) {
    console.error('接单失败，降级到 mock 数据:', error);
    // 降级到 mock 数据
    const order = mock.workOrders.find((item) => item.workOrderId === workOrderId);
    if (!order) {
      return null;
    }
    order.status = "processing";
    order.assigneeId = profile.userId;
    order.assigneeName = profile.name;
    order.logs.push({
      label: LOCALE_TEXT[locale].acceptedLabel,
      value: t("acceptedValue", { name: profile.name }, locale),
    });

    // 清除工单相关缓存
    invalidateCache('workorder');

    return clone(order);
  }
}

async function closeWorkOrder(workOrderId) {
  const profile = getCurrentProfile();
  const locale = currentLocale();

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    // 直接返回 mock 数据，不抛出错误
    const order = mock.workOrders.find((item) => item.workOrderId === workOrderId);
    if (!order) {
      return null;
    }
    order.status = "closed";
    order.logs.push({
      label: LOCALE_TEXT[locale].closedLabel,
      value: t("closedValue", { name: profile.name }, locale),
    });
    return clone(order);
  }

  try {
    // 构建后端数据
    const backendData = {
      status: 'closed'
    };

    // 调用后端 API
    const backendTicket = await request.put(`/api/v1/tickets/${workOrderId}`, backendData);

    // 获取关联信息
    const deviceCache = {};
    const userCache = {};

    if (backendTicket.device_id) {
      try {
        const device = await request.get(`/api/v1/devices/${backendTicket.device_id}`);
        deviceCache[backendTicket.device_id] = device;
      } catch (e) {
        console.warn('获取设备信息失败:', e);
      }
    }

    // 映射返回数据
    const ticket = mappers.mapTicket(backendTicket, locale, deviceCache, userCache);

    // 清除工单相关缓存
    invalidateCache('workorder');

    return ticket;
  } catch (error) {
    console.error('完结工单失败，降级到 mock 数据:', error);
    // 降级到 mock 数据
    const order = mock.workOrders.find((item) => item.workOrderId === workOrderId);
    if (!order) {
      return null;
    }
    order.status = "closed";
    order.logs.push({
      label: LOCALE_TEXT[locale].closedLabel,
      value: t("closedValue", { name: profile.name }, locale),
    });

    // 清除工单相关缓存
    invalidateCache('workorder');

    return clone(order);
  }
}

async function getHomeSummary(profile) {
  const visibleDevices = await getVisibleDevices(profile);
  const visibleOrders = await getVisibleWorkOrders(profile);
  const pendingOrders = visibleOrders.filter((item) => item.status === "pending").length;
  const activeAlarms = visibleDevices.reduce((sum, item) => sum + item.alarms.length, 0);
  return {
    deviceCount: visibleDevices.length,
    pendingOrders,
    activeAlarms,
    unreadNotifications: getNotifications(profile).filter((item) => !item.read).length,
  };
}

function getBanners() {
  const locale = currentLocale();
  return clone(mock.banners).map((item) => localizeBanner(item, locale));
}

function getNotifications(profile) {
  const locale = currentLocale();
  return clone(mock.notifications.filter((item) => item.audience.includes(profile.roleCode))).map((item) => localizeNotification(item, locale));
}

function markNotificationRead(id) {
  const target = mock.notifications.find((item) => item.id === id);
  if (target) {
    target.read = true;
  }
  return clone(target);
}

function getDiscoverContent(profile, category = "all") {
  let list = mock.contents.filter((item) => item.audience.includes(profile.roleCode));
  if (category !== "all") {
    list = list.filter((item) => item.category === category);
  }
  const locale = currentLocale();
  return clone(list).map((item) => localizeContent(item, locale));
}

function getKnowledgeItems() {
  const locale = currentLocale();
  return clone(mock.knowledgeItems).map((item) => localizeKnowledgeItem(item, locale));
}

function parseScanCode(rawCode) {
  const profile = getCurrentProfile();
  const locale = currentLocale();
  if (!rawCode) {
    return { targetType: "unknown", message: LOCALE_TEXT[locale].scanEmpty };
  }
  if (rawCode.indexOf("device:") === 0) {
    const deviceId = rawCode.replace("device:", "");
    const visibleIds = mock.devices
      .filter((item) => {
        if (profile.roleCode === "engineer") {
          return profile.deviceScope.includes(item.deviceId);
        }
        return item.tenantId === profile.tenantId && profile.deviceScope.includes(item.deviceId);
      })
      .map((item) => item.deviceId);
    const device = mock.devices.find((item) => item.deviceId === deviceId && visibleIds.includes(item.deviceId));
    if (!device) {
      return { targetType: "unknown", message: LOCALE_TEXT[locale].scanDeviceMissing };
    }
    return { targetType: "device", targetId: deviceId, action: "openDevice" };
  }
  if (rawCode.indexOf("workorder:") === 0) {
    const workOrderId = rawCode.replace("workorder:", "");
    const visibleIds = mock.workOrders
      .filter((item) => {
        if (profile.roleCode === "engineer") {
          return item.assigneeId === profile.userId || item.creatorId === profile.userId || profile.deviceScope.includes(item.deviceId);
        }
        return item.tenantId === profile.tenantId;
      })
      .map((item) => item.workOrderId);
    const workOrder = mock.workOrders.find((item) => item.workOrderId === workOrderId && visibleIds.includes(item.workOrderId));
    if (!workOrder) {
      return { targetType: "unknown", message: LOCALE_TEXT[locale].scanOrderMissing };
    }
    return { targetType: "workorder", targetId: workOrderId, action: "openWorkOrder" };
  }
  return { targetType: "unknown", message: LOCALE_TEXT[locale].scanUnsupported };
}

function getAssignableDevices(tenantId) {
  return clone(mock.devices.filter((item) => item.tenantId === tenantId)).map((item) => localizeDevice(item, currentLocale()));
}

/**
 * 物料相关服务函数
 */

async function getMaterialSeries() {
  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    return clone(mock.MATERIAL_SERIES);
  }

  try {
    // 调用后端 API
    const backendSeries = await request.get('/api/v1/devices/series/');

    // 映射数据
    const series = backendSeries.map(s => mappers.mapDeviceSeries(s));

    return series;
  } catch (error) {
    console.log('获取设备系列失败，使用 mock 数据:', error.message);
    // 降级到 mock 数据
    return clone(mock.MATERIAL_SERIES);
  }
}

async function getMaterialModels(seriesId) {
  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    const models = clone(mock.MATERIAL_MODELS[seriesId] || []);
    // 为每个型号添加 seriesId 和 shortName 字段
    return models.map(model => ({
      ...model,
      seriesId: seriesId,
      shortName: model.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase()
    }));
  }

  try {
    // 构建查询参数
    const params = {};
    if (seriesId) {
      params.series_id = seriesId;
    }

    // 调用后端 API
    const backendModels = await request.get('/api/v1/devices/models/', params);
    console.log('后端返回的型号列表 (原始数据):', backendModels);

    // 映射数据
    const models = backendModels.map(m => mappers.mapDeviceModel(m));
    console.log('映射后的型号列表:', models);

    // 打印每个型号的详细信息
    models.forEach(model => {
      console.log(`型号 ${model.id}: name="${model.name}", code="${model.code}"`);
    });

    return models;
  } catch (error) {
    console.log('获取设备型号失败，使用 mock 数据');
    console.log('seriesId:', seriesId);
    console.log('错误详情:', JSON.stringify(error.response?.data, null, 2));
    // 降级到 mock 数据
    return clone(mock.MATERIAL_MODELS[seriesId] || []);
  }
}

async function getMaterials(seriesId, modelId) {
  console.log('=== getMaterials 调用 ===');
  console.log('seriesId:', seriesId, 'modelId:', modelId);

  const locale = currentLocale();

  // 检查是否有有效的 token，如果没有就直接使用 mock 数据
  const hasToken = request.getToken();
  if (!hasToken) {
    console.log('没有有效 token，使用 mock 数据');
    const materials = mock.MATERIALS[modelId] || [];
    return clone(materials).map((item) => localizeMaterial(item, locale));
  }

  try {
    // 构建查询参数
    const params = {};

    // TODO: 后端需要支持按型号筛选物料
    // 目前后端的物料接口没有 model_id 参数，暂时获取所有物料后在前端过滤

    // 调用后端 API
    console.log('调用物料API，参数:', params);
    const backendMaterials = await request.get('/api/v1/materials/', params);
    console.log('后端返回的物料列表:', backendMaterials);
    console.log('物料数量:', backendMaterials?.length || 0);

    // 映射数据
    let materials = mappers.mapMaterialList(backendMaterials, locale);
    console.log('映射后的物料数量:', materials.length);

    // 前端过滤（如果后端不支持按型号过滤）
    if (modelId) {
      // TODO: 根据实际业务逻辑过滤
      // materials = materials.filter(m => m.modelId === modelId);
    }

    return materials;
  } catch (error) {
    console.log('获取物料列表失败，使用 mock 数据:', error.message);
    // 降级到 mock 数据
    const materials = mock.MATERIALS[modelId] || [];
    return clone(materials).map((item) => localizeMaterial(item, locale));
  }
}

async function getMaterialCategories() {
  try {
    // 物料分类直接从配置获取，不需要 API 调用
    // 返回对象格式，而不是数组格式
    const categories = {};

    Object.entries(config.materialCategoryMap).forEach(([key, value]) => {
      categories[key] = {
        name: value.zh,
        nameEn: value.en,
        icon: value.icon,
        color: value.color
      };
    });

    return categories;
  } catch (error) {
    console.log('获取物料分类失败，使用 mock 数据:', error.message);
    // 降级到 mock 数据
    return clone(mock.MATERIAL_CATEGORIES);
  }
}

function localizeMaterial(material, locale) {
  const categoryInfo = mock.MATERIAL_CATEGORIES[material.category];
  return {
    ...material,
    categoryName: categoryInfo ? (locale === 'en' ? categoryInfo.nameEn : categoryInfo.name) : material.category,
  };
}

module.exports = {
  acceptWorkOrder,
  closeWorkOrder,
  createWorkOrder,
  getAssignableDevices,
  getBanners,
  getCurrentProfile: getProfile,
  getDeviceDetail,
  getDiscoverContent,
  getHomeSummary,
  getKnowledgeItems,
  getNotifications,
  getTenantDetail,
  getTenantUsers,
  getVisibleDevices,
  getVisibleWorkOrders,
  getWorkOrderDetail,
  loginAsRole,
  markNotificationRead,
  parseScanCode,
  getMaterialSeries,
  getMaterialModels,
  getMaterials,
  getMaterialCategories,
};
