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
    allDevices: [], // 存储所有设备数据
    summary: {
      total: 0,
      warning: 0,
      offline: 0,
    },
    texts: {},
    locale: "zh",
    // 分页配置
    pagination: {
      currentPage: 1,
      pageSize: 10,
      hasMore: true
    },
    isLoading: false,
  },

  async onShow() {
    const locale = getLocale();
    applyNavigationTitle("devices", locale);
    const profile = services.getCurrentProfile();
    const allDevices = await services.getVisibleDevices(profile);

    this.setData({
      locale,
      texts: getPageTexts("devices", locale),
      statusFilters: getDeviceStatusFilters(locale),
      typeFilters: getDeviceTypeFilters(locale),
      profile,
      allDevices, // 存储所有设备
      currentStatus: "all",
      currentType: "all",
      summary: {
        total: allDevices.length,
        warning: allDevices.filter((item) => item.status === "warning").length,
        offline: allDevices.filter((item) => item.status === "offline").length,
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        hasMore: allDevices.length > 10
      }
    });
    this.loadDevices();
  },

  async loadDevices() {
    const { allDevices, pagination, currentStatus, currentType } = this.data;

    // 先过滤数据
    let filteredDevices = allDevices;

    if (currentStatus && currentStatus !== "all") {
      filteredDevices = filteredDevices.filter((item) => item.status === currentStatus);
    }

    if (currentType && currentType !== "all") {
      filteredDevices = filteredDevices.filter((item) => item.type === currentType);
    }

    // 分页处理
    const { pageSize, currentPage } = pagination;
    const startIndex = 0;
    const endIndex = currentPage * pageSize;
    const paginatedDevices = filteredDevices.slice(startIndex, endIndex);

    const devices = paginatedDevices.map((item) => ({
      ...item,
      statusMeta: deviceStatusMeta(item.status),
    }));

    this.setData({
      devices,
      'pagination.hasMore': endIndex < filteredDevices.length
    });
  },

  // 加载更多设备
  loadMoreDevices() {
    const { pagination } = this.data;
    if (this.data.isLoading || !pagination.hasMore) {
      return;
    }

    this.setData({
      'pagination.currentPage': pagination.currentPage + 1,
      isLoading: true
    });

    this.loadDevices().then(() => {
      this.setData({ isLoading: false });
    });
  },

  changeStatus(event) {
    this.setData({
      currentStatus: event.currentTarget.dataset.status,
      'pagination.currentPage': 1 // 重置分页
    });
    this.loadDevices();
  },

  changeType(event) {
    this.setData({
      currentType: event.currentTarget.dataset.type,
      'pagination.currentPage': 1 // 重置分页
    });
    this.loadDevices();
  },

  openDetail(event) {
    wx.navigateTo({
      url: `/subpackages/device/pages/detail/index?id=${event.currentTarget.dataset.id}`,
    });
  },
});
