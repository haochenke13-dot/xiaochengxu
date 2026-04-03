const { roleLabel } = require("../../utils/permissions");
const services = require("../../utils/services");
const { applyNavigationTitle, getLocale, getPageTexts } = require("../../utils/i18n");

Page({
  data: {
    tenant: null,
    members: [],
    profile: null,
    texts: {},
    locale: "zh",
  },

  onShow() {
    const locale = getLocale();
    const texts = getPageTexts("tenantStaff", locale);
    applyNavigationTitle("tenantStaff", locale);
    const profile = services.getCurrentProfile();
    const tenant = services.getTenantDetail(profile.tenantId);
    const members = services.getTenantUsers(profile.tenantId).map((item) => ({
      ...item,
      roleName: roleLabel(item.roleCode),
    }));
    this.setData({
      locale,
      texts,
      profile,
      tenant,
      members,
    });
  },
});
