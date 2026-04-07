const mock = require("./mock");
const { getLocale } = require("./i18n");
const { getCurrentProfile, switchProfile } = require("./session");

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

function loginAsRole(roleCode) {
  const profile = switchProfile(roleCode);
  return clone(profile);
}

function getTenantUsers(tenantId) {
  return clone(mock.users.filter((item) => item.tenantId === tenantId));
}

function getTenantDetail(tenantId) {
  return localizeTenant(clone(mock.tenants.find((item) => item.tenantId === tenantId)), currentLocale());
}

function getVisibleDevices(profile, filters = {}) {
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

  return clone(list).map((item) => localizeDevice(item, currentLocale()));
}

function getDeviceDetail(deviceId) {
  const profile = getCurrentProfile();
  const visibleIds = mock.devices
    .filter((item) => {
      if (profile.roleCode === "engineer") {
        return profile.deviceScope.includes(item.deviceId);
      }
      return item.tenantId === profile.tenantId && profile.deviceScope.includes(item.deviceId);
    })
    .map((item) => item.deviceId);
  const target = mock.devices.find((item) => item.deviceId === deviceId && visibleIds.includes(item.deviceId));
  return target ? localizeDevice(clone(target), currentLocale()) : null;
}

function getVisibleWorkOrders(profile, status = "all") {
  let list = mock.workOrders.filter((item) => {
    if (profile.roleCode === "engineer") {
      return item.assigneeId === profile.userId || item.creatorId === profile.userId || profile.deviceScope.includes(item.deviceId);
    }
    return item.tenantId === profile.tenantId;
  });

  if (status !== "all") {
    list = list.filter((item) => item.status === status);
  }

  return clone(list).map((item) => localizeWorkOrder(item, currentLocale()));
}

function getWorkOrderDetail(workOrderId) {
  const profile = getCurrentProfile();
  const visibleIds = mock.workOrders
    .filter((item) => {
      if (profile.roleCode === "engineer") {
        return item.assigneeId === profile.userId || item.creatorId === profile.userId || profile.deviceScope.includes(item.deviceId);
      }
      return item.tenantId === profile.tenantId;
    })
    .map((item) => item.workOrderId);
  const target = mock.workOrders.find((item) => item.workOrderId === workOrderId && visibleIds.includes(item.workOrderId));
  return target ? localizeWorkOrder(clone(target), currentLocale()) : null;
}

function createWorkOrder(payload) {
  const profile = getCurrentProfile();
  const locale = currentLocale();
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

function acceptWorkOrder(workOrderId) {
  const profile = getCurrentProfile();
  const locale = currentLocale();
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

function closeWorkOrder(workOrderId) {
  const profile = getCurrentProfile();
  const locale = currentLocale();
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

function getHomeSummary(profile) {
  const visibleDevices = getVisibleDevices(profile);
  const visibleOrders = getVisibleWorkOrders(profile);
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

function getMaterialSeries() {
  return clone(mock.MATERIAL_SERIES);
}

function getMaterialModels(seriesId) {
  return clone(mock.MATERIAL_MODELS[seriesId] || []);
}

function getMaterials(seriesId, modelId) {
  const materials = mock.MATERIALS[modelId] || [];
  const locale = currentLocale();
  return clone(materials).map((item) => localizeMaterial(item, locale));
}

function getMaterialCategories() {
  return clone(mock.MATERIAL_CATEGORIES);
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
