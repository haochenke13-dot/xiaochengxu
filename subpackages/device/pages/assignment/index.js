const services = require("../../../../utils/services");
const request = require("../../../../utils/request");
const { applyNavigationTitle, formatText, getLocale, getPageTexts } = require("../../../../utils/i18n");

Page({
  data: {
    tenant: null,
    devices: [],
    members: [],
    texts: {},
    locale: "zh",
  },

  async onShow() {
    const locale = getLocale();
    const texts = getPageTexts("deviceAssignment", locale);
    applyNavigationTitle("deviceAssignment", locale);
    const profile = services.getCurrentProfile();
    const tenant = await services.getTenantDetail(profile.tenantId);
    const devices = await services.getAssignableDevices(profile.tenantId);
    const members = await services.getTenantUsers(profile.tenantId);
    this.setData({
      locale,
      texts,
      tenant,
      devices,
      members,
    });
  },

  async onAssign(event) {
    const deviceId = event.currentTarget.dataset.id;
    const memberName = (this.data.members[0] && this.data.members[0].name) || (this.data.locale === "en" ? "Member" : "员工");
    const memberId = this.data.members[0] && this.data.members[0].userId;

    if (!memberId) {
      wx.showToast({
        title: this.data.locale === "en" ? "No members available" : "没有可用成员",
        icon: "none",
      });
      return;
    }

    try {
      // 使用数字ID（deviceNum）进行API调用
      const numericDeviceId = this.data.devices.find(d => d.deviceId === deviceId)?.deviceNum || deviceId;

      console.log('分配设备:', numericDeviceId, '给成员:', memberId);

      // 调用后端API分配设备
      await request.put(`/api/v1/devices/${numericDeviceId}`, {
        owner_id: parseInt(memberId)
      });

      wx.showToast({
        title: formatText(this.data.texts.assigned, { deviceId, name: memberName }),
        icon: "success",
      });

      // 刷新设备列表
      const profile = services.getCurrentProfile();
      const devices = await services.getAssignableDevices(profile.tenantId);
      this.setData({ devices });
    } catch (error) {
      console.error('分配设备失败:', error);
      wx.showToast({
        title: this.data.locale === "en" ? "Assignment failed" : "分配失败",
        icon: "none",
      });
    }
  },
});
