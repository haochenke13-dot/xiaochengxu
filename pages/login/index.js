const { loginAsRole } = require("../../utils/services");
const { applyNavigationTitle, formatText, getLocalizedRoles, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    roles: [],
    selectedRoleIndex: -1,
    logoError: false,
    bgError: false,
    locale: "zh",
    texts: {},
  },

  onLoad() {
    this.applyLanguage();
  },

  onShow() {
    this.applyLanguage();
  },

  applyLanguage() {
    const locale = getLocale();
    applyNavigationTitle("login", locale);
    this.setData({
      locale,
      texts: getPageTexts("login", locale),
      roles: getLocalizedRoles(locale),
    });
  },

  onBgError() {
    this.setData({ bgError: true });
  },

  onLogoLoad() {
    this.setData({ logoError: false });
  },

  onLogoError() {
    this.setData({ logoError: true });
  },

  onRoleChange(event) {
    this.setData({
      selectedRoleIndex: parseInt(event.detail.value, 10),
    });
  },

  onLogin() {
    if (this.data.selectedRoleIndex === -1) {
      wx.showToast({
        title: this.data.texts.chooseRole,
        icon: "none",
      });
      return;
    }

    const selectedRole = this.data.roles[this.data.selectedRoleIndex];
    const profile = loginAsRole(selectedRole.code);
    getApp().globalData.profile = profile;

    wx.showToast({
      title: formatText(this.data.texts.welcome, { name: selectedRole.name }),
      icon: "success",
    });

    setTimeout(() => {
      wx.switchTab({
        url: "/pages/home/index",
      });
    }, 500);
  },
});
