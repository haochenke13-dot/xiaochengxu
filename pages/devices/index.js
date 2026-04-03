const services = require("../../utils/services");
const { deviceStatusMeta } = require("../../utils/formatters");
const { applyNavigationTitle, getDeviceStatusFilters, getDeviceTypeFilters, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    profile: null,
    statusFilters: [],
    typeFilters: [],
    currentStatus: "all",
    currentType: "all",
    devices: [],
    summary: {
      total: 0,
      warning: 0,
      offline: 0,
    },
    texts: {},
    locale: "zh",
  },

  onShow() {
    const locale = getLocale();
    applyNavigationTitle("devices", locale);
    const profile = services.getCurrentProfile();
    const allDevices = services.getVisibleDevices(profile);
    this.setData({
      locale,
      texts: getPageTexts("devices", locale),
      statusFilters: getDeviceStatusFilters(locale),
      typeFilters: getDeviceTypeFilters(locale),
      profile,
      currentStatus: "all",
      currentType: "all",
      summary: {
        total: allDevices.length,
        warning: allDevices.filter((item) => item.status === "warning").length,
        offline: allDevices.filter((item) => item.status === "offline").length,
      },
    });
    this.loadDevices();
  },

  loadDevices() {
    const devices = services
      .getVisibleDevices(this.data.profile, {
        status: this.data.currentStatus,
        type: this.data.currentType,
      })
      .map((item) => ({
        ...item,
        statusMeta: deviceStatusMeta(item.status),
      }));
    this.setData({ devices });
  },

  changeStatus(event) {
    this.setData({ currentStatus: event.currentTarget.dataset.status });
    this.loadDevices();
  },

  changeType(event) {
    this.setData({ currentType: event.currentTarget.dataset.type });
    this.loadDevices();
  },

  openDetail(event) {
    wx.navigateTo({
      url: `/pages/device-detail/index?id=${event.currentTarget.dataset.id}`,
    });
  },
});
