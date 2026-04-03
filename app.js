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
