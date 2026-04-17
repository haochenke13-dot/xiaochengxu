const services = require("../../utils/services");
const { applyNavigationTitle, getLocale, getPageTexts } = require("../../utils/i18n");

function getTypeOptions(locale) {
  return locale === "en"
    ? ["Repair Order", "Maintenance Order", "Installation Order", "Inspection Order"]
    : ["维修工单", "保养工单", "安装工单", "巡检工单"];
}

function getPriorityOptions(locale) {
  return locale === "en" ? ["Low", "Medium", "High"] : ["低", "中", "高"];
}

Page({
  data: {
    profile: null,
    devices: [],
    typeOptions: [],
    priorityOptions: [],
    form: {
      title: "",
      type: "",
      priority: "",
      deviceId: "",
      deviceName: "",
      desc: "",
    },
    deviceNames: [],
    selectedDeviceIndex: 0,
    selectedTypeIndex: 0,
    selectedPriorityIndex: 1,
    texts: {},
    locale: "zh",
    presetDeviceId: "",
  },

  onLoad(options) {
    this.setData({
      presetDeviceId: options.deviceId || "",
    });
  },

  async onShow() {
    console.log('=== 工单表单页面开始加载 ===');

    const locale = getLocale();
    const texts = getPageTexts("workorderForm", locale);
    const typeOptions = getTypeOptions(locale);
    const priorityOptions = getPriorityOptions(locale);
    const profile = services.getCurrentProfile();

    console.log('用户信息:', profile);
    console.log('文本配置:', texts);
    console.log('语言:', locale);

    const devices = await services.getVisibleDevices(profile);
    console.log('设备列表:', devices);
    console.log('设备数量:', devices.length);

    const deviceNames = devices.map((item) => `${item.name} (${item.deviceId})`);
    const form = { ...this.data.form };
    let selectedDeviceIndex = 0;

    if (this.data.presetDeviceId) {
      const targetIndex = devices.findIndex((item) => item.deviceId === this.data.presetDeviceId);
      if (targetIndex >= 0) {
        selectedDeviceIndex = targetIndex;
      }
    }

    if (devices.length) {
      form.deviceId = devices[selectedDeviceIndex].deviceId;
      form.deviceName = devices[selectedDeviceIndex].name;
    }

    form.type = typeOptions[this.data.selectedTypeIndex] || typeOptions[0];
    form.priority = priorityOptions[this.data.selectedPriorityIndex] || priorityOptions[1];

    console.log('表单数据:', form);
    console.log('准备设置页面数据');

    applyNavigationTitle("workorderForm", locale);
    this.setData({
      locale,
      texts,
      profile,
      devices,
      deviceNames,
      typeOptions,
      priorityOptions,
      form,
      selectedDeviceIndex,
    });

    console.log('页面数据设置完成');
    console.log('=== 工单表单页面加载完成 ===');
  },

  onTitleChange(event) {
    this.setData({ "form.title": event.detail.value });
  },

  onDescChange(event) {
    this.setData({ "form.desc": event.detail.value });
  },

  onTypeChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      selectedTypeIndex: index,
      "form.type": this.data.typeOptions[index],
    });
  },

  onPriorityChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      selectedPriorityIndex: index,
      "form.priority": this.data.priorityOptions[index],
    });
  },

  onDeviceChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      selectedDeviceIndex: index,
      "form.deviceId": this.data.devices[index].deviceId,
      "form.deviceName": this.data.devices[index].name,
    });
  },

  async onSubmit() {
    const { form, texts } = this.data;
    if (!form.title || !form.deviceId || !form.desc) {
      wx.showToast({ title: texts.incomplete, icon: "none" });
      return;
    }
    const order = await services.createWorkOrder(form);
    wx.showToast({ title: texts.created, icon: "success" });
    wx.redirectTo({
      url: `/pages/workorder-detail/index?id=${order.workOrderId}`,
    });
  },
});
