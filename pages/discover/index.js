const services = require("../../utils/services");
const { applyNavigationTitle, getDiscoverCategories, getLocale, getPageTexts, localizeContentCategory } = require("../../utils/i18n");

Page({
  data: {
    profile: null,
    categories: [],
    currentCategory: "all",
    contents: [],
    texts: {},
    locale: "zh",
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("discover", locale);
    this.setData({
      locale,
      texts: getPageTexts("discover", locale),
      categories: getDiscoverCategories(locale),
      profile: services.getCurrentProfile(),
    });
    this.loadContent();
  },

  loadContent() {
    const locale = this.data.locale;
    this.setData({
      contents: services.getDiscoverContent(this.data.profile, this.data.currentCategory).map((item) => ({
        ...item,
        categoryLabel: localizeContentCategory(item.category, locale),
      })),
    });
  },

  onChangeCategory(event) {
    this.setData({
      currentCategory: event.currentTarget.dataset.category,
    });
    this.loadContent();
  },
});
