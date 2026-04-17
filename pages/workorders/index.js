const services = require("../../utils/services");
const { canCreateWorkOrder } = require("../../utils/permissions");
const { workOrderStatusMeta } = require("../../utils/formatters");
const { applyNavigationTitle, getLocale, getPageTexts, getWorkorderTabs } = require("../../utils/i18n");

Page({
  data: {
    profile: null,
    statusTabs: [],
    currentStatus: "all",
    orders: [],
    canCreate: false,
    texts: {},
    locale: "zh",
  },

  onLoad(options) {
    if (options.status) {
      this.setData({ currentStatus: options.status });
    }
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("workorders", locale);
    const presetStatus = wx.getStorageSync("workordersStatus");
    const profile = services.getCurrentProfile();
    this.setData({
      locale,
      texts: getPageTexts("workorders", locale),
      statusTabs: getWorkorderTabs(locale),
      profile,
      canCreate: canCreateWorkOrder(profile.roleCode),
      currentStatus: presetStatus || this.data.currentStatus,
    });
    if (presetStatus) {
      wx.removeStorageSync("workordersStatus");
    }
    this.loadOrders();
  },

  async loadOrders() {
    const orders = (await services.getVisibleWorkOrders(this.data.profile, this.data.currentStatus)).map((item) => ({
      ...item,
      statusMeta: workOrderStatusMeta(item.status),
      priorityLabel: this.data.locale === "en" ? `${this.data.texts.priorityPrefix}${item.priority}` : `${this.data.texts.priorityPrefix} ${item.priority}`,
    }));
    this.setData({ orders });
  },

  onChangeStatus(event) {
    this.setData({ currentStatus: event.currentTarget.dataset.status });
    this.loadOrders();
  },

  openDetail(event) {
    wx.navigateTo({
      url: `/subpackages/workorder/pages/detail/index?id=${event.currentTarget.dataset.id}`,
    });
  },

  createOrder() {
    wx.navigateTo({ url: "/subpackages/workorder/pages/form/index" });
  },
});
