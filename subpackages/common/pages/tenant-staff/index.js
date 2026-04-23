const { roleLabel } = require("../../../../utils/permissions");
const services = require("../../../../utils/services");
const { applyNavigationTitle, getLocale, getPageTexts } = require("../../../../utils/i18n");

Page({
  data: {
    tenant: null,
    members: [],
    profile: null,
    texts: {},
    locale: "zh",
  },

  async onShow() {
    const locale = getLocale();
    const texts = getPageTexts("tenantStaff", locale);
    applyNavigationTitle("tenantStaff", locale);
    const profile = services.getCurrentProfile();
    const tenant = await services.getTenantDetail(profile.tenantId);
    const users = await services.getTenantUsers(profile.tenantId);
    const members = users.map((item) => ({
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
