const { ensureSession, getCurrentProfile } = require("./utils/session");
const { getLocale, applyTabBar } = require("./utils/i18n");

App({
  globalData: {
    profile: null,
    homePrefs: null,
    locale: "zh",
  },

  onLaunch() {
    const profile = ensureSession();
    this.globalData.profile = profile;
    this.globalData.locale = getLocale();
    this.globalData.homePrefs = wx.getStorageSync("homePrefs") || {
      showScan: true,
      showWorkbench: true,
      showKnowledge: true,
      showBanner: true,
    };
    applyTabBar(this.globalData.locale);

    // 监听全局错误
    this.setupErrorHandler();
  },

  setupErrorHandler() {
    // 监听小程序错误
    wx.onError((error) => {
      console.error('全局错误:', error);
      // 在生产环境可以上报到服务器
      if (!this.globalData.profile) return;

      // 显示用户友好的错误提示
      wx.showToast({
        title: '程序出现错误，请重试',
        icon: 'none',
        duration: 2000
      });
    });

    // 监听未处理的Promise错误
    wx.onUnhandledRejection((res) => {
      console.error('未处理的Promise错误:', res);
      // 生产环境可以上报
    });
  },

  refreshProfile() {
    const profile = getCurrentProfile();
    this.globalData.profile = profile;
    return profile;
  },

  refreshLocale() {
    const locale = getLocale();
    this.globalData.locale = locale;
    applyTabBar(locale);
    return locale;
  },
});
