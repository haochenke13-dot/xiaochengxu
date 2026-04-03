const services = require("../../utils/services");
const { applyNavigationTitle, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    code: "",
    result: null,
    texts: {},
  },

  onLoad(options) {
    const code = decodeURIComponent(options.code || "");
    const locale = getLocale();
    applyNavigationTitle("scanResult", locale);
    this.setData({
      code,
      texts: getPageTexts("scanResult", locale),
      result: services.parseScanCode(code),
    });
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("scanResult", locale);
    this.setData({
      texts: getPageTexts("scanResult", locale),
    });
  },

  onOpenTarget() {
    const { result } = this.data;
    if (!result) {
      return;
    }
    if (result.targetType === "device") {
      wx.redirectTo({
        url: `/pages/device-detail/index?id=${result.targetId}`,
      });
      return;
    }
    if (result.targetType === "workorder") {
      wx.redirectTo({
        url: `/pages/workorder-detail/index?id=${result.targetId}`,
      });
    }
  },
});
