const { updateHomePrefs } = require("../../utils/session");
const { applyNavigationTitle, getLocale, getPageTexts, setLocale } = require("../../utils/i18n");

function withHomeSettingOverrides(texts, locale) {
  return {
    ...texts,
    showBanner: locale === "en" ? "Show AI Ask on Home" : "首页显示 AI 问答入口",
    showBannerDesc: locale === "en" ? "Toggle the AI question button block" : "控制 AI 问答入口区块是否展示",
  };
}

Page({
  data: {
    languageIndex: 0,
    prefs: {
      showScan: true,
      showWorkbench: true,
      showKnowledge: true,
      showBanner: true,
    },
    texts: {},
    locale: "zh",
  },

  onShow() {
    const app = getApp();
    const locale = getLocale();
    const texts = withHomeSettingOverrides(getPageTexts("settings", locale), locale);
    applyNavigationTitle("settings", locale);
    this.setData({
      locale,
      texts,
      languageIndex: locale === "en" ? 1 : 0,
      prefs: app.globalData.homePrefs || this.data.prefs,
    });
  },

  onLanguageChange(event) {
    this.setData({
      languageIndex: Number(event.detail.value),
    });
  },

  onToggle(event) {
    const key = event.currentTarget.dataset.key;
    const nextValue = event.detail.value;
    this.setData({
      [`prefs.${key}`]: nextValue,
    });
  },

  onSave() {
    const nextLocale = this.data.languageIndex === 1 ? "en" : "zh";
    setLocale(nextLocale);
    const prefs = updateHomePrefs(this.data.prefs);
    const app = getApp();
    app.globalData.homePrefs = prefs;
    app.refreshLocale();
    const texts = withHomeSettingOverrides(getPageTexts("settings", nextLocale), nextLocale);
    applyNavigationTitle("settings", nextLocale);
    this.setData({
      locale: nextLocale,
      texts,
    });
    wx.showToast({
      title: texts.saved,
      icon: "success",
    });
  },
});
