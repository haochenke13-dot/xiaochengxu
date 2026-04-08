const { ROLE_META } = require("./constants");

const LOCALE_KEY = "locale";
const DEFAULT_LOCALE = "zh";

const PAGE_TEXTS = {
  login: {
    zh: {
      nav: "登录",
      title: "设备服务协同平台",
      desc: "请选择您的身份登录",
      placeholder: "请选择身份",
      enter: "进入系统",
      footer: "登录后可在“我的”页面切换身份",
      chooseRole: "请选择身份",
      welcome: "欢迎，{name}",
      roleHintIcon: "i",
    },
    en: {
      nav: "Login",
      title: "Device Service Hub",
      desc: "Choose your role to continue",
      placeholder: "Select a role",
      enter: "Enter",
      footer: "You can switch roles later in Profile",
      chooseRole: "Please choose a role",
      welcome: "Welcome, {name}",
      roleHintIcon: "i",
    },
  },
  home: {
    zh: {
      nav: "首页",
      message: "消息",
      signal: "信号",
      grid: "矩阵",
      kit: "资料",
      feed: "动态",
      board: "实时面板",
      emptyFeed: "当前暂无需要关注的消息",
    },
    en: {
      nav: "Home",
      message: "Inbox",
      signal: "Signal",
      grid: "Grid",
      kit: "Kit",
      feed: "Feed",
      board: "Live Board",
      emptyFeed: "No messages to focus on now",
    },
  },
  workorders: {
    zh: {
      nav: "工单协同",
      title: "工单协同",
      desc: "待办优先，信息从简。",
      workflow: "流程",
      create: "新建",
      empty: "当前状态下暂无工单",
      time: "时间",
      by: "创建人",
      priorityPrefix: "优先级",
    },
    en: {
      nav: "Work Orders",
      title: "Work Orders",
      desc: "Focus on the queue, keep the data light.",
      workflow: "Workflow",
      create: "New",
      empty: "No work orders in this status",
      time: "TIME",
      by: "BY",
      priorityPrefix: "P",
    },
  },
  devices: {
    zh: {
      nav: "设备总览",
      title: "设备总览",
      desc: "先看状态，再看细节。",
      filter: "筛选",
      type: "类型",
      total: "总数",
      alert: "告警",
      offline: "离线",
      loc: "位置",
      run: "运行",
      hb: "心跳",
      empty: "暂无符合当前筛选条件的设备",
    },
    en: {
      nav: "Devices",
      title: "Device Board",
      desc: "Read status first, then drill into detail.",
      filter: "Filter",
      type: "Type",
      total: "ALL",
      alert: "ALT",
      offline: "OFF",
      loc: "LOC",
      run: "RUN",
      hb: "HB",
      empty: "No devices match the current filters",
    },
  },
  discover: {
    zh: {
      nav: "发现",
      title: "发现频道",
      desc: "内容更像展板，不像信息列表。",
      empty: "当前分类暂无可展示内容",
    },
    en: {
      nav: "Discover",
      title: "Content Board",
      desc: "Curated like a gallery, not a feed list.",
      empty: "No content in this category",
    },
  },
  materials: {
    zh: {
      nav: "物料",
      title: "物料中心",
      series: "仪器系列",
      desc: "选择仪器型号，查看零件、配件与耗材",
      selectSeries: "选择系列",
      selectModel: "选择型号",
      materials: "物料清单",
      all: "全部",
      parts: "零件",
      accessories: "配件",
      consumables: "耗材",
      empty: "暂无物料数据"
    },
    en: {
      nav: "Materials",
      title: "Material Center",
      series: "Series",
      desc: "Select model to view parts, accessories & consumables",
      selectSeries: "Select Series",
      selectModel: "Select Model",
      materials: "Material List",
      all: "All",
      parts: "Parts",
      accessories: "Accessories",
      consumables: "Consumables",
      empty: "No materials available"
    }
  },
  profile: {
    zh: {
      nav: "我的",
      role: "角色",
      admin: "管理",
      flow: "业务",
      system: "系统",
      enter: "进入",
      switched: "已切换为{name}",
    },
    en: {
      nav: "Profile",
      role: "Role",
      admin: "Admin",
      flow: "Flow",
      system: "System",
      enter: "Open",
      switched: "Switched to {name}",
    },
  },
  notifications: {
    zh: {
      nav: "通知中心",
      title: "通知中心",
      desc: "系统通知、工单动态和设备告警统一收口。",
      read: "标记已读",
      empty: "当前没有可展示的通知",
    },
    en: {
      nav: "Notifications",
      title: "Notifications",
      desc: "System, work order, and alert messages in one place.",
      read: "Mark Read",
      empty: "No notifications available",
    },
  },
  settings: {
    zh: {
      nav: "程序设置",
      title: "程序设置",
      desc: "统一管理语言、首页模块和入口显示。",
      language: "语言设置",
      showBanner: "首页显示重点提醒",
      showBannerDesc: "控制 Banner 区块是否展示",
      showWorkbench: "首页显示工作台",
      showWorkbenchDesc: "控制快捷操作区是否展示",
      showScan: "首页显示扫码入口",
      showScanDesc: "控制扫码快捷入口是否展示",
      showKnowledge: "首页显示知识支持",
      showKnowledgeDesc: "控制资料区块是否展示",
      save: "保存设置",
      saved: "设置已保存",
      languages: ["简体中文", "English"],
    },
    en: {
      nav: "Settings",
      title: "Settings",
      desc: "Manage language, home modules, and entry visibility.",
      language: "Language",
      showBanner: "Show signal card on Home",
      showBannerDesc: "Toggle the focus banner block",
      showWorkbench: "Show action grid on Home",
      showWorkbenchDesc: "Toggle the quick actions block",
      showScan: "Show scan shortcut on Home",
      showScanDesc: "Toggle the scan entry block",
      showKnowledge: "Show knowledge kit on Home",
      showKnowledgeDesc: "Toggle the support materials block",
      save: "Save",
      saved: "Settings saved",
      languages: ["简体中文", "English"],
    },
  },
  feedback: {
    zh: {
      nav: "意见反馈",
      title: "意见反馈",
      desc: "记录页面问题、交互建议和联调异常。",
      label: "反馈内容",
      placeholder: "请输入你的反馈内容",
      submit: "提交反馈",
      required: "请填写反馈内容",
      submitted: "反馈已提交",
    },
    en: {
      nav: "Feedback",
      title: "Feedback",
      desc: "Share UI issues, interaction ideas, and sync blockers.",
      label: "Feedback",
      placeholder: "Write your feedback here",
      submit: "Submit",
      required: "Please enter your feedback",
      submitted: "Feedback submitted",
    },
  },
  about: {
    zh: {
      nav: "关于产品",
      title: "设备服务协同平台 Beta",
      desc: "当前版本聚焦登录与权限、设备查看、扫码、工单闭环、内容分发和用户中心。",
      version: "版本号",
      tone: "界面基调",
      capability: "当前能力",
      next: "下一步",
      toneValue: "浅色冷静科技风",
      capabilityValue: "设备监控、工单闭环、内容分发",
      nextValue: "真实接口、消息推送、巡检计划",
    },
    en: {
      nav: "About",
      title: "Device Service Hub Beta",
      desc: "This beta focuses on auth, devices, scan, work orders, content, and profile flows.",
      version: "Version",
      tone: "Visual Tone",
      capability: "Current Scope",
      next: "Next Step",
      toneValue: "Light calm tech aesthetic",
      capabilityValue: "Device monitor, work order loop, content feed",
      nextValue: "Real APIs, push messages, inspection plans",
    },
  },
  workorderDetail: {
    zh: {
      nav: "工单详情",
      createdAt: "创建于",
      info: "工单信息",
      priority: "优先级",
      creator: "创建人",
      assignee: "当前处理人",
      unassigned: "待分配",
      descLabel: "问题描述",
      relatedDevice: "关联设备",
      view: "查看",
      logs: "处理记录",
      accept: "接单处理",
      close: "完结工单",
      missing: "工单不存在",
      accepted: "已接单",
      closed: "工单已完结",
    },
    en: {
      nav: "Work Order",
      createdAt: "Created",
      info: "Order Info",
      priority: "Priority",
      creator: "Creator",
      assignee: "Assignee",
      unassigned: "Unassigned",
      descLabel: "Description",
      relatedDevice: "Related Device",
      view: "Open",
      logs: "Logs",
      accept: "Accept",
      close: "Close",
      missing: "Work order not found",
      accepted: "Accepted",
      closed: "Work order closed",
    },
  },
  workorderForm: {
    zh: {
      nav: "新建工单",
      title: "新建工单",
      desc: "将设备、工单类型、优先级和问题描述整理成标准化输入。",
      formTitle: "工单标题",
      type: "工单类型",
      priority: "优先级",
      device: "关联设备",
      description: "问题描述",
      titlePlaceholder: "请输入工单标题",
      devicePlaceholder: "请选择设备",
      descPlaceholder: "请输入故障现象、影响范围和现场情况",
      submit: "提交工单",
      incomplete: "请完善工单信息",
      created: "工单已创建",
    },
    en: {
      nav: "New Work Order",
      title: "New Work Order",
      desc: "Standardize device, type, priority, and issue notes into one entry.",
      formTitle: "Title",
      type: "Type",
      priority: "Priority",
      device: "Device",
      description: "Description",
      titlePlaceholder: "Enter a work order title",
      devicePlaceholder: "Choose a device",
      descPlaceholder: "Describe the symptom, impact, and on-site context",
      submit: "Submit",
      incomplete: "Please complete the work order form",
      created: "Work order created",
    },
  },
  deviceDetail: {
    zh: {
      nav: "设备详情",
      runtime: "累计运行时长",
      heartbeat: "最近心跳",
      params: "关键参数",
      alarms: "报警记录",
      alarmHigh: "高优先",
      alarmHint: "提醒",
      alarmsEmpty: "当前设备暂无报警记录",
      relatedOrders: "关联工单",
      relatedOrdersEmpty: "当前设备暂无关联工单",
      remote: "远控预留",
      createOrder: "为设备提单",
      missing: "设备不存在",
      remoteHint: "Beta 暂不开放远控",
    },
    en: {
      nav: "Device Detail",
      runtime: "Runtime",
      heartbeat: "Last Heartbeat",
      params: "Key Parameters",
      alarms: "Alarms",
      alarmHigh: "High",
      alarmHint: "Hint",
      alarmsEmpty: "No alarms for this device",
      relatedOrders: "Related Orders",
      relatedOrdersEmpty: "No related work orders",
      remote: "Remote Slot",
      createOrder: "Create Order",
      missing: "Device not found",
      remoteHint: "Remote control is not available in Beta",
    },
  },
  scanResult: {
    zh: {
      nav: "扫码结果",
      title: "扫码结果",
      desc: "根据二维码类型自动识别设备或工单。",
      raw: "原始内容",
      parsed: "解析结果",
      parsedDevice: "已识别为设备二维码",
      parsedOrder: "已识别为工单二维码",
      open: "打开详情",
    },
    en: {
      nav: "Scan Result",
      title: "Scan Result",
      desc: "Detect device or work order targets from the QR code.",
      raw: "Raw Content",
      parsed: "Parsed Result",
      parsedDevice: "Detected as a device QR",
      parsedOrder: "Detected as a work order QR",
      open: "Open",
    },
  },
  tenantStaff: {
    zh: {
      nav: "员工管理",
      titlePrefix: "邀请码",
      desc: "用于客户员工加入当前企业并继承租户数据范围。",
      empty: "当前租户暂无员工数据",
    },
    en: {
      nav: "Team",
      titlePrefix: "Invite",
      desc: "Used for staff to join the tenant and inherit the proper scope.",
      empty: "No staff data for this tenant",
    },
  },
  deviceAssignment: {
    zh: {
      nav: "设备分配",
      title: "设备分配",
      desc: "租户管理员可将设备按人或班组分配。",
      assign: "分配",
      empty: "当前租户暂无可分配设备",
      assigned: "{deviceId} 已分配给 {name}",
    },
    en: {
      nav: "Assignment",
      title: "Device Assignment",
      desc: "Tenant admins can assign devices to people or teams.",
      assign: "Assign",
      empty: "No assignable devices for this tenant",
      assigned: "{deviceId} assigned to {name}",
    },
  },
};

const TAB_BAR_TEXT = {
  zh: ["首页", "工单", "设备", "发现", "我的"],
  en: ["Home", "Orders", "Devices", "Discover", "Profile"],
};

const CONTENT_CATEGORY_LABELS = {
  "售后视频": {
    zh: "售后视频",
    en: "Service Video",
  },
  "工单经验": {
    zh: "工单经验",
    en: "Case Notes",
  },
  "使用技巧": {
    zh: "使用技巧",
    en: "Usage Tips",
  },
};

function getLocale() {
  return wx.getStorageSync(LOCALE_KEY) || DEFAULT_LOCALE;
}

function setLocale(locale) {
  wx.setStorageSync(LOCALE_KEY, locale);
  return locale;
}

function formatText(template, params = {}) {
  return Object.keys(params).reduce((result, key) => result.replace(new RegExp(`\\{${key}\\}`, "g"), params[key]), template);
}

function getPageTexts(pageKey, locale = getLocale()) {
  const entry = PAGE_TEXTS[pageKey];
  if (!entry) {
    return {};
  }
  return entry[locale] || entry.zh || {};
}

function getLocalizedRole(roleCode, locale = getLocale()) {
  const meta = ROLE_META[roleCode];
  if (!meta) {
    return null;
  }
  return {
    ...meta,
    name: meta.name[locale] || meta.name.zh,
    homeTitle: meta.homeTitle[locale] || meta.homeTitle.zh,
  };
}

function getLocalizedRoles(locale = getLocale()) {
  return Object.keys(ROLE_META)
    .filter((key) => key !== "platformAdmin")
    .map((key) => getLocalizedRole(key, locale));
}

function getWorkorderTabs(locale = getLocale()) {
  return locale === "en"
    ? [
        { key: "all", name: "All" },
        { key: "pending", name: "Pending" },
        { key: "processing", name: "Active" },
        { key: "closed", name: "Closed" },
      ]
    : [
        { key: "all", name: "全部" },
        { key: "pending", name: "待处理" },
        { key: "processing", name: "进行中" },
        { key: "closed", name: "已结束" },
      ];
}

function getDeviceStatusFilters(locale = getLocale()) {
  return locale === "en"
    ? [
        { key: "all", name: "All" },
        { key: "running", name: "Running" },
        { key: "warning", name: "Alert" },
        { key: "offline", name: "Offline" },
      ]
    : [
        { key: "all", name: "全部状态" },
        { key: "running", name: "运行中" },
        { key: "warning", name: "告警中" },
        { key: "offline", name: "离线" },
      ];
}

function getDeviceTypeFilters(locale = getLocale()) {
  return locale === "en"
    ? [
        { key: "all", name: "All Types" },
        { key: "包装设备", name: "Packaging" },
        { key: "灌装设备", name: "Filling" },
        { key: "贴标设备", name: "Labeling" },
      ]
    : [
        { key: "all", name: "全部类型" },
        { key: "包装设备", name: "包装设备" },
        { key: "灌装设备", name: "灌装设备" },
        { key: "贴标设备", name: "贴标设备" },
      ];
}

function getDiscoverCategories(locale = getLocale()) {
  return locale === "en"
    ? [
        { key: "all", name: "All" },
        { key: "售后视频", name: "Video" },
        { key: "工单经验", name: "Cases" },
        { key: "使用技巧", name: "Tips" },
      ]
    : [
        { key: "all", name: "全部" },
        { key: "售后视频", name: "售后视频" },
        { key: "工单经验", name: "工单经验" },
        { key: "使用技巧", name: "使用技巧" },
      ];
}

function getNotificationCategories(locale = getLocale()) {
  return locale === "en"
    ? [
        { key: "all", name: "All" },
        { key: "系统通知", name: "System" },
        { key: "工单通知", name: "Orders" },
        { key: "告警通知", name: "Alerts" },
      ]
    : [
        { key: "all", name: "全部" },
        { key: "系统通知", name: "系统通知" },
        { key: "工单通知", name: "工单通知" },
        { key: "告警通知", name: "告警通知" },
      ];
}

function localizeContentCategory(category, locale = getLocale()) {
  const label = CONTENT_CATEGORY_LABELS[category];
  return label ? label[locale] || label.zh : category;
}

function applyNavigationTitle(pageKey, locale = getLocale()) {
  const texts = getPageTexts(pageKey, locale);
  if (texts.nav) {
    wx.setNavigationBarTitle({
      title: texts.nav,
    });
  }
}

function applyTabBar(locale = getLocale()) {
  const labels = TAB_BAR_TEXT[locale] || TAB_BAR_TEXT.zh;
  labels.forEach((text, index) => {
    wx.setTabBarItem({
      index,
      text,
    });
  });
}

module.exports = {
  applyNavigationTitle,
  applyTabBar,
  formatText,
  getDeviceStatusFilters,
  getDeviceTypeFilters,
  getDiscoverCategories,
  getLocalizedRole,
  getLocalizedRoles,
  getLocale,
  getNotificationCategories,
  getPageTexts,
  getWorkorderTabs,
  localizeContentCategory,
  setLocale,
};
