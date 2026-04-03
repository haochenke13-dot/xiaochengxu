const services = require("../../utils/services");
const { canAcceptWorkOrder, canCloseWorkOrder } = require("../../utils/permissions");
const { workOrderStatusMeta } = require("../../utils/formatters");
const { applyNavigationTitle, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    id: "",
    profile: null,
    detail: null,
    statusMeta: null,
    canAccept: false,
    canClose: false,
    texts: {},
    locale: "zh",
  },

  onLoad(options) {
    this.setData({ id: options.id || "" });
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("workorderDetail", locale);
    const profile = services.getCurrentProfile();
    const detail = services.getWorkOrderDetail(this.data.id);
    const texts = getPageTexts("workorderDetail", locale);
    if (!detail) {
      wx.showToast({ title: texts.missing, icon: "none" });
      return;
    }
    this.setData({
      locale,
      texts,
      profile,
      detail,
      statusMeta: workOrderStatusMeta(detail.status),
      canAccept: detail.status === "pending" && canAcceptWorkOrder(profile.roleCode),
      canClose: detail.status === "processing" && canCloseWorkOrder(profile.roleCode),
    });
  },

  onAccept() {
    services.acceptWorkOrder(this.data.id);
    wx.showToast({ title: this.data.texts.accepted, icon: "success" });
    this.onShow();
  },

  onClose() {
    services.closeWorkOrder(this.data.id);
    wx.showToast({ title: this.data.texts.closed, icon: "success" });
    this.onShow();
  },

  toDevice() {
    wx.navigateTo({
      url: `/pages/device-detail/index?id=${this.data.detail.deviceId}`,
    });
  },
});
