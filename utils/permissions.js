const { ROLE_META } = require("./constants");
const { getLocale } = require("./i18n");

function canCreateWorkOrder(roleCode) {
  return ["tenantAdmin", "customer", "engineer"].includes(roleCode);
}

function canAcceptWorkOrder(roleCode) {
  return ["engineer", "tenantAdmin"].includes(roleCode);
}

function canCloseWorkOrder(roleCode) {
  return ["engineer", "tenantAdmin"].includes(roleCode);
}

function canManageTenant(roleCode) {
  return roleCode === "tenantAdmin";
}

function canSeeRemoteControl(roleCode) {
  return ["engineer", "tenantAdmin"].includes(roleCode);
}

function visibleContentForRole(items, roleCode) {
  return items.filter((item) => item.audience.includes(roleCode));
}

function roleLabel(roleCode) {
  const locale = getLocale();
  return ROLE_META[roleCode] ? ROLE_META[roleCode].name[locale] || ROLE_META[roleCode].name.zh : locale === "en" ? "Unknown Role" : "未知角色";
}

module.exports = {
  canAcceptWorkOrder,
  canCloseWorkOrder,
  canCreateWorkOrder,
  canManageTenant,
  canSeeRemoteControl,
  visibleContentForRole,
  roleLabel,
};
