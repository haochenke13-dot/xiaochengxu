const ROLE_META = {
  engineer: {
    code: "engineer",
    name: {
      zh: "内部工程师",
      en: "Field Engineer",
    },
    homeTitle: {
      zh: "现场服务工作台",
      en: "Field Service Board",
    },
    color: "#0ea5e9",
  },
  tenantAdmin: {
    code: "tenantAdmin",
    name: {
      zh: "租户管理员",
      en: "Tenant Admin",
    },
    homeTitle: {
      zh: "企业设备运营台",
      en: "Operations Console",
    },
    color: "#0f766e",
  },
  customer: {
    code: "customer",
    name: {
      zh: "客户员工",
      en: "Customer User",
    },
    homeTitle: {
      zh: "设备与报修入口",
      en: "Service Access",
    },
    color: "#2563eb",
  },
  platformAdmin: {
    code: "platformAdmin",
    name: {
      zh: "平台管理员",
      en: "Platform Admin",
    },
    homeTitle: {
      zh: "平台运营中心",
      en: "Operations Center",
    },
    color: "#1d4ed8",
  },
};

const WORK_ORDER_STATUS = {
  pending: {
    zh: "待处理",
    en: "Pending",
  },
  processing: {
    zh: "进行中",
    en: "In Progress",
  },
  closed: {
    zh: "已结束",
    en: "Closed",
  },
};

const DEVICE_STATUS = {
  running: {
    zh: "运行中",
    en: "Running",
  },
  warning: {
    zh: "告警中",
    en: "Alert",
  },
  offline: {
    zh: "离线",
    en: "Offline",
  },
  maintenance: {
    zh: "维护中",
    en: "Maintenance",
  },
};

module.exports = {
  ROLE_META,
  WORK_ORDER_STATUS,
  DEVICE_STATUS,
};
