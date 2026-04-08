const { canManageTenant } = require("../../utils/permissions");
const services = require("../../utils/services");
const { applyNavigationTitle, formatText, getLocale, getLocalizedRole, getLocalizedRoles, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    profile: null,
    roleMeta: null,
    stats: [],
    roleOptions: [],
    businessMenus: [],
    systemMenus: [],
    adminMenus: [],
    texts: {},
    locale: "zh",
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("profile", locale);
    const profile = services.getCurrentProfile();
    const summary = services.getHomeSummary(profile);
    const isEn = locale === "en";
    this.setData({
      locale,
      texts: getPageTexts("profile", locale),
      profile,
      roleMeta: getLocalizedRole(profile.roleCode, locale),
      stats: [
        { label: "DEV", value: summary.deviceCount },
        { label: "TODO", value: summary.pendingOrders },
        { label: "MSG", value: summary.unreadNotifications },
      ],
      roleOptions: getLocalizedRoles(locale),
      businessMenus: [
        { key: "workorders", title: "WORK", desc: isEn ? "Task records" : "任务记录" },
        { key: "devices", title: "DEVICE", desc: isEn ? "Device status" : "设备状态" },
        { key: "notifications", title: "SIGNAL", desc: isEn ? "Message alerts" : "消息提醒" },
      ],
      systemMenus: [
        { key: "settings", title: "PREF", desc: isEn ? "Display & language" : "显示与语言" },
        { key: "feedback", title: "NOTE", desc: isEn ? "Experience notes" : "体验建议" },
        { key: "about", title: "ABOUT", desc: isEn ? "Version info" : "版本信息" },
      ],
      adminMenus: canManageTenant(profile.roleCode)
        ? [
            { key: "staff", title: "TEAM", desc: isEn ? "Member info" : "成员信息" },
            { key: "assignment", title: "MAP", desc: isEn ? "Assign devices" : "分配设备" },
          ]
        : [],
    });
  },

  onSwitchRole(event) {
    const roleCode = event.currentTarget.dataset.role;
    const profile = services.loginAsRole(roleCode);
    getApp().globalData.profile = profile;
    wx.showToast({
      title: formatText(this.data.texts.switched, { name: getLocalizedRole(roleCode, this.data.locale).name }),
      icon: "none",
    });
    this.onShow();
  },

  onMenuTap(event) {
    const key = event.currentTarget.dataset.key;
    const actions = {
      workorders: () => wx.switchTab({ url: "/pages/workorders/index" }),
      devices: () => wx.switchTab({ url: "/pages/devices/index" }),
      notifications: () => wx.navigateTo({ url: "/subpackages/common/pages/notifications/index" }),
      settings: () => wx.navigateTo({ url: "/subpackages/common/pages/settings/index" }),
      feedback: () => wx.navigateTo({ url: "/subpackages/common/pages/feedback/index" }),
      about: () => wx.navigateTo({ url: "/subpackages/common/pages/about/index" }),
      staff: () => wx.navigateTo({ url: "/subpackages/common/pages/tenant-staff/index" }),
      assignment: () => wx.navigateTo({ url: "/subpackages/device/pages/assignment/index" }),
    };
    if (actions[key]) {
      actions[key]();
    }
  },
});
