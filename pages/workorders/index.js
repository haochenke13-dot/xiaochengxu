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
    const id = event.currentTarget.dataset.id;
    console.log('=== 打开工单详情 ===');
    console.log('传递的ID:', id);
    console.log('ID类型:', typeof id);
    console.log('完整的dataset:', event.currentTarget.dataset);
    console.log('dataset的所有字段:', Object.keys(event.currentTarget.dataset));

    // 检查是否是从循环中获取的数据
    const index = event.currentTarget.dataset.index;
    const item = this.data.orders[index];
    console.log('从orders数组中获取的item:', item);
    console.log('item的workOrderNum:', item?.workOrderNum);
    console.log('item的workOrderId:', item?.workOrderId);

    wx.navigateTo({
      url: `/subpackages/workorder/pages/detail/index?id=${id}`,
    });
  },

  createOrder() {
    wx.navigateTo({ url: "/subpackages/workorder/pages/form/index" });
  },
});
