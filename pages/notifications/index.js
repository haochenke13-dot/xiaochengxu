const services = require("../../utils/services");
const { applyNavigationTitle, getLocale, getNotificationCategories, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    profile: null,
    categories: [],
    currentCategory: "all",
    notifications: [],
    texts: {},
    locale: "zh",
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("notifications", locale);
    this.setData({
      locale,
      texts: getPageTexts("notifications", locale),
      categories: getNotificationCategories(locale),
      profile: services.getCurrentProfile(),
    });
    this.loadNotifications();
  },

  loadNotifications() {
    let notifications = services.getNotifications(this.data.profile);
    if (this.data.currentCategory !== "all") {
      notifications = notifications.filter((item) => item.category === this.data.currentCategory);
    }
    this.setData({ notifications });
  },

  onCategoryTap(event) {
    this.setData({
      currentCategory: event.currentTarget.dataset.category,
    });
    this.loadNotifications();
  },

  markRead(event) {
    services.markNotificationRead(event.currentTarget.dataset.id);
    this.loadNotifications();
  },
});
