const services = require("../../../../utils/services");
const { applyNavigationTitle, getDiscoverCategories, getLocale, getPageTexts, localizeContentCategory } = require("../../../../utils/i18n");

function getDiscoverDisplayCategories(locale) {
  if (locale === "en") {
    return getDiscoverCategories(locale);
  }

  return [
    { key: "all", name: "全部" },
    { key: "鍞悗瑙嗛", name: "售后视频" },
    { key: "宸ュ崟缁忛獙", name: "工单经验" },
    { key: "浣跨敤鎶€宸?", name: "使用技巧" },
  ];
}

function getDiscoverDisplayLabel(category, locale) {
  if (locale === "en") {
    return localizeContentCategory(category, locale);
  }

  const labels = {
    "鍞悗瑙嗛": "售后视频",
    "宸ュ崟缁忛獙": "工单经验",
    "浣跨敤鎶€宸?": "使用技巧",
  };

  return labels[category] || localizeContentCategory(category, locale);
}

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
      categories: getDiscoverDisplayCategories(locale),
      profile: services.getCurrentProfile(),
    });
    this.loadContent();
  },

  loadContent() {
    const locale = this.data.locale;
    this.setData({
      contents: services.getDiscoverContent(this.data.profile, this.data.currentCategory).map((item) => ({
        ...item,
        categoryLabel: getDiscoverDisplayLabel(item.category, locale),
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
