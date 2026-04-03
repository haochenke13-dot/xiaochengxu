const services = require("../../utils/services");
const { canSeeRemoteControl, canCreateWorkOrder } = require("../../utils/permissions");
const { deviceStatusMeta, workOrderStatusMeta } = require("../../utils/formatters");
const { applyNavigationTitle, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    id: "",
    profile: null,
    detail: null,
    statusMeta: null,
    relatedOrders: [],
    canSeeRemote: false,
    canCreateOrder: false,
    texts: {},
    locale: "zh",
  },

  onLoad(options) {
    this.setData({ id: options.id || "" });
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("deviceDetail", locale);
    const profile = services.getCurrentProfile();
    const detail = services.getDeviceDetail(this.data.id);
    const texts = getPageTexts("deviceDetail", locale);
    if (!detail) {
      wx.showToast({ title: texts.missing, icon: "none" });
      return;
    }
    const relatedOrders = services
      .getVisibleWorkOrders(profile, "all")
      .filter((item) => item.deviceId === detail.deviceId)
      .map((item) => ({
        ...item,
        statusMeta: workOrderStatusMeta(item.status),
      }));
    this.setData({
      locale,
      texts,
      profile,
      detail,
      statusMeta: deviceStatusMeta(detail.status),
      relatedOrders,
      canSeeRemote: canSeeRemoteControl(profile.roleCode),
      canCreateOrder: canCreateWorkOrder(profile.roleCode),
    });
  },

  createOrder() {
    wx.navigateTo({
      url: `/pages/workorder-form/index?deviceId=${this.data.detail.deviceId}`,
    });
  },

  openOrder(event) {
    wx.navigateTo({
      url: `/pages/workorder-detail/index?id=${event.currentTarget.dataset.id}`,
    });
  },

  onRemotePlaceholder() {
    wx.showToast({
      title: this.data.texts.remoteHint,
      icon: "none",
    });
  },
});
