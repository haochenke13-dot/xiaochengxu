const { users } = require("./mock");

const PROFILE_KEY = "currentProfile";

function ensureSession() {
  const cached = wx.getStorageSync(PROFILE_KEY);
  if (cached && cached.userId) {
    return cached;
  }
  const fallback = users[0];
  wx.setStorageSync(PROFILE_KEY, fallback);
  return fallback;
}

function getCurrentProfile() {
  return wx.getStorageSync(PROFILE_KEY) || ensureSession();
}

function switchProfile(roleCode) {
  const nextProfile = users.find((item) => item.roleCode === roleCode) || users[0];
  wx.setStorageSync(PROFILE_KEY, nextProfile);
  return nextProfile;
}

function updateHomePrefs(prefs) {
  wx.setStorageSync("homePrefs", prefs);
  return prefs;
}

module.exports = {
  ensureSession,
  getCurrentProfile,
  switchProfile,
  updateHomePrefs,
};
