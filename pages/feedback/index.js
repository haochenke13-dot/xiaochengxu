const { applyNavigationTitle, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    content: "",
    texts: {},
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("feedback", locale);
    this.setData({
      texts: getPageTexts("feedback", locale),
    });
  },

  onInput(event) {
    this.setData({
      content: event.detail.value,
    });
  },

  onSubmit() {
    if (!this.data.content) {
      wx.showToast({
        title: this.data.texts.required,
        icon: "none",
      });
      return;
    }
    wx.showToast({
      title: this.data.texts.submitted,
      icon: "success",
    });
    this.setData({ content: "" });
  },
});
