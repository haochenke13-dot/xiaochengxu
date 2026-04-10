const services = require("../../utils/services");
const {
  applyNavigationTitle,
  getLocale,
  getLocalizedRole,
  getPageTexts,
} = require("../../utils/i18n");

function getHomeTextOverrides(locale) {
  return locale === "en"
    ? {
        aiTitle: "AI ASK",
        aiDesc: "Describe a fault, symptom, or on-site task. The AI model will plug in here later.",
        aiButton: "Ask AI",
        aiSoon: "AI model connection is coming soon",
        knowledgeHint: "Open",
        knowledgeSoon: "Knowledge content will open soon",
        opsTag: "LIVE OPS",
        statusHint: "Current status",
      }
    : {
        aiTitle: "AI 问答",
        aiDesc: "输入故障现象、使用问题或现场任务，后续这里会接入 AI 模型。",
        aiButton: "立即问答",
        aiSoon: "AI 模型接入功能即将开放",
        knowledgeHint: "查看",
        knowledgeSoon: "资料内容即将开放",
        opsTag: "实时运营",
        statusHint: "当前状态",
      };
}

function buildQuickActions(roleCode, locale) {
  const isEn = locale === "en";
  const common = [
    { key: "scan", title: "SCAN", desc: isEn ? "Device / Order" : "设备 / 工单", label: "扫码", action: "scan", visual: "scan" },
    { key: "devices", title: "DEVICE", desc: isEn ? "Status board" : "状态总览", label: "设备", action: "devices", visual: "device" },
  ];
  const commonArea = {
    key: "materials",
    title: "COMMON",
    desc: isEn ? "Common tools" : "常用功能区",
    label: "发现",
    action: "materials",
    visual: "common",
  };

  if (roleCode === "engineer") {
    return common.concat([
      { key: "pending", title: "QUEUE", desc: isEn ? "Priority first" : "优先处理", label: "工单", action: "pending", visual: "queue" },
      commonArea,
    ]);
  }

  return common.concat([
    { key: "create", title: "NEW", desc: isEn ? "Create request" : "发起需求", label: "新建", action: "create", visual: "create" },
    commonArea,
  ]);
}

function decorateKnowledgeItems(items, locale) {
  const isEn = locale === "en";
  const visuals = {
    "KN-1": {
      visual: "guide",
      code: "GUIDE",
      desc: isEn ? "Install / Repair SOP" : "安装 / 维修 SOP",
    },
    "KN-2": {
      visual: "video",
      code: "VIDEO",
      desc: isEn ? "Training / Replay" : "培训 / 复盘",
    },
    "KN-3": {
      visual: "faq",
      code: "FAQ",
      desc: isEn ? "Common issues" : "常见问题",
    },
  };

  return items.map((item) => ({
    ...item,
    ...(visuals[item.id] || {
      visual: "guide",
      code: "KIT",
      desc: isEn ? "Knowledge item" : "资料项",
    }),
  }));
}

/**
 * 将发现页内容转换为资料模块格式
 */
function decorateDiscoverItems(items, locale) {
  const categoryToVisual = {
    "售后视频": "video",
    "工单经验": "case",
    "使用技巧": "tip"
  };

  const categoryToCode = {
    "售后视频": "VIDEO",
    "工单经验": "CASE",
    "使用技巧": "TIP"
  };

  const isEn = locale === "en";
  const descMap = {
    "售后视频": isEn ? "Training video" : "培训视频",
    "工单经验": isEn ? "Case experience" : "工单经验",
    "使用技巧": isEn ? "Usage tips" : "使用技巧"
  };

  return items.map((item) => ({
    id: item.contentId,
    title: item.title,
    desc: item.summary,
    visual: categoryToVisual[item.category] || "guide",
    code: categoryToCode[item.category] || "KIT",
    visualDesc: descMap[item.category] || (isEn ? "Knowledge" : "资料"),
    meta: item.duration
  }));
}

Page({
  data: {
    profile: null,
    roleMeta: null,
    summary: {},
    quickActions: [],
    knowledgeItems: [],
    homePrefs: {},
    texts: {},
    locale: "zh",
  },

  onShow() {
    const locale = getLocale();
    const profile = services.getCurrentProfile();
    const roleMeta = getLocalizedRole(profile.roleCode, locale);
    const app = getApp();
    app.globalData.profile = profile;
    app.globalData.locale = locale;

    applyNavigationTitle("home", locale);

    const texts = {
      ...getPageTexts("home", locale),
      ...getHomeTextOverrides(locale),
    };

    this.setData({
      locale,
      texts,
      profile,
      roleMeta,
      summary: services.getHomeSummary(profile),
      quickActions: buildQuickActions(profile.roleCode, locale),
      knowledgeItems: decorateDiscoverItems(services.getDiscoverContent(profile, "all"), locale),
      homePrefs: app.globalData.homePrefs || {},
    });
  },

  onQuickAction(event) {
    const action = event.currentTarget.dataset.action;
    const mapping = {
      devices: () => wx.switchTab({ url: "/pages/devices/index" }),
      notifications: () => wx.navigateTo({ url: "/subpackages/common/pages/notifications/index" }),
      materials: () => wx.navigateTo({ url: "/subpackages/common/pages/discover/index" }),
      pending: () => {
        wx.setStorageSync("workordersStatus", "pending");
        wx.switchTab({ url: "/pages/workorders/index" });
      },
      create: () => wx.navigateTo({ url: "/subpackages/workorder/pages/form/index" }),
      scan: () => this.startScan(),
    };

    if (mapping[action]) {
      mapping[action]();
    }
  },

  onKnowledgeTap(event) {
    const title = event.currentTarget.dataset.title;
    wx.showToast({
      title: this.data.locale === "en" ? `${title}: coming soon` : `${title}：即将开放`,
      icon: "none",
    });
  },

  openAIAsk() {
    wx.showToast({
      title: this.data.texts.aiSoon,
      icon: "none",
    });
  },

  startScan() {
    const isEn = this.data.locale === "en";
    wx.scanCode({
      success: (res) => {
        this.openScanResult(res.result);
      },
      fail: () => {
        wx.showActionSheet({
          itemList: isEn ? ["Demo Scan: Device DEV-1001", "Demo Scan: Order WO-2001"] : ["演示扫码：设备 DEV-1001", "演示扫码：工单 WO-2001"],
          success: (res) => {
            const code = res.tapIndex === 0 ? "device:DEV-1001" : "workorder:WO-2001";
            this.openScanResult(code);
          },
        });
      },
    });
  },

  openScanResult(code) {
    wx.navigateTo({
      url: `/subpackages/common/pages/scan-result/index?code=${encodeURIComponent(code)}`,
    });
  },

  goNotifications() {
    wx.navigateTo({ url: "/subpackages/common/pages/notifications/index" });
  },
});
