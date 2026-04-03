const services = require("../../utils/services");
const { applyNavigationTitle, formatText, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    tenant: null,
    devices: [],
    members: [],
    texts: {},
    locale: "zh",
  },

  onShow() {
    const locale = getLocale();
    const texts = getPageTexts("deviceAssignment", locale);
    applyNavigationTitle("deviceAssignment", locale);
    const profile = services.getCurrentProfile();
    this.setData({
      locale,
      texts,
      tenant: services.getTenantDetail(profile.tenantId),
      devices: services.getAssignableDevices(profile.tenantId),
      members: services.getTenantUsers(profile.tenantId),
    });
  },

  onAssign(event) {
    const deviceId = event.currentTarget.dataset.id;
    const memberName = (this.data.members[0] && this.data.members[0].name) || (this.data.locale === "en" ? "Member" : "员工");
    wx.showToast({
      title: formatText(this.data.texts.assigned, { deviceId, name: memberName }),
      icon: "none",
    });
  },
});
