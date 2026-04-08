const { applyNavigationTitle, getLocale, getPageTexts } = require("../../../../utils/i18n");

Page({
  data: {
    texts: {},
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("about", locale);
    this.setData({
      texts: getPageTexts("about", locale),
    });
  },
});
