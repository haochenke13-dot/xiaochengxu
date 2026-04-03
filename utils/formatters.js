const { DEVICE_STATUS, WORK_ORDER_STATUS } = require("./constants");
const { getLocale } = require("./i18n");

function localeText(textMap) {
  const locale = getLocale();
  return (textMap && textMap[locale]) || (textMap && textMap.zh) || "";
}

function deviceStatusMeta(status) {
  const mapping = {
    running: { text: localeText(DEVICE_STATUS[status]), className: "badge-success" },
    warning: { text: localeText(DEVICE_STATUS[status]), className: "badge-warning" },
    offline: { text: localeText(DEVICE_STATUS[status]), className: "badge-danger" },
    maintenance: { text: localeText(DEVICE_STATUS[status]), className: "badge-info" },
  };
  return mapping[status] || { text: getLocale() === "en" ? "Unknown" : "未知", className: "badge-info" };
}

function workOrderStatusMeta(status) {
  const mapping = {
    pending: { text: localeText(WORK_ORDER_STATUS[status]), className: "badge-warning" },
    processing: { text: localeText(WORK_ORDER_STATUS[status]), className: "badge-info" },
    closed: { text: localeText(WORK_ORDER_STATUS[status]), className: "badge-success" },
  };
  return mapping[status] || { text: getLocale() === "en" ? "Unknown" : "未知", className: "badge-info" };
}

module.exports = {
  deviceStatusMeta,
  workOrderStatusMeta,
};
