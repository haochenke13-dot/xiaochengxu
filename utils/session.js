const request = require("./request");
const config = require("./config");
const { users } = require("./mock");

const PROFILE_KEY = "currentProfile";

// Mock 数据（用于开发阶段快速切换角色）
// TODO: 生产环境应该移除 mock 数据，完全使用真实 API
const MOCK_USERS = {
  'engineer': {
    username: 'engineer@test.com',
    password: '123456',
    mockData: users[0]
  },
  'tenantAdmin': {
    username: 'admin@test.com',
    password: '123456',
    mockData: users[1]
  },
  'customer': {
    username: 'customer@test.com',
    password: '123456',
    mockData: users[2]
  }
};

/**
 * 确保有会话存在（兼容旧代码）
 */
function ensureSession() {
  const cached = wx.getStorageSync(PROFILE_KEY);
  if (cached && cached.userId) {
    return cached;
  }
  const fallback = users[0];
  wx.setStorageSync(PROFILE_KEY, fallback);
  return fallback;
}

/**
 * 获取当前用户信息
 */
function getCurrentProfile() {
  // 优先从 request 模块获取真实用户信息
  const userInfo = request.getUserInfo();
  if (userInfo) {
    console.log('=== getCurrentProfile 从 request 获取用户信息 ===');
    return transformUserProfile(userInfo);
  }

  // 降级到本地缓存
  console.log('=== getCurrentProfile 从本地缓存获取 ===');
  const cached = wx.getStorageSync(PROFILE_KEY);
  console.log('缓存的profile:', cached);
  if (cached && cached.userId) {
    return cached;
  }
  console.log('缓存无效，使用默认session');
  return ensureSession();
}

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise} 返回用户信息
 */
async function login(username, password) {
  try {
    console.log('=== 开始登录 ===');
    console.log('用户名:', username);

    // 调用后端登录 API（使用 form-data 格式）
    const formData = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password`;

    const response = await request.post('/api/v1/auth/login', formData, {
      needAuth: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('登录响应:', response);

    // 保存 Token
    if (response.access_token) {
      console.log('保存 Token:', response.access_token.substring(0, 20) + '...');
      request.setToken(response.access_token);
    } else {
      console.error('登录响应中没有 access_token');
      throw new Error('登录失败：未获取到 Token');
    }

    // 获取用户详细信息
    const userInfo = await request.get('/api/v1/auth/me');
    console.log('用户信息:', userInfo);
    console.log('用户角色 (raw):', userInfo.role);
    console.log('用户公司ID:', userInfo.company_id);
    console.log('用户ID:', userInfo.id);

    // 保存用户信息
    request.setUserInfo(userInfo);

    // 转换并保存用户配置文件
    const profile = transformUserProfile(userInfo);
    wx.setStorageSync(PROFILE_KEY, profile);

    console.log('登录成功，用户配置:', profile);
    return profile;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 切换用户角色（兼容旧代码，实际应该重新登录）
 * @param {string} roleCode 角色代码
 */
async function switchProfile(roleCode) {
  // 开发阶段：使用 mock 数据快速切换
  // 注意：真实登录需要后端提供有效的测试账号
  const mockUser = MOCK_USERS[roleCode] || MOCK_USERS['engineer'];

  try {
    // 尝试使用真实 API 登录
    const profile = await login(mockUser.username, mockUser.password);
    return profile;
  } catch (error) {
    // 如果真实登录失败，清除可能保存的无效 token
    request.clearToken();
    request.clearUserInfo();

    // 显示友好提示并降级到 mock 数据
    console.warn('真实登录失败，使用 mock 数据:', error);

    const errorMsg = error.message || '';
    if (errorMsg.includes('422') || errorMsg.includes('验证') || errorMsg.includes('username') || errorMsg.includes('password')) {
      wx.showToast({
        title: '测试账号不存在，已切换到演示模式',
        icon: 'none',
        duration: 2000
      });
    } else if (errorMsg.includes('401') || errorMsg.includes('登录已过期')) {
      wx.showToast({
        title: '登录失败，已切换到演示模式',
        icon: 'none',
        duration: 2000
      });
    }

    // 降级到 mock 数据
    const nextProfile = users.find((item) => item.roleCode === roleCode) || users[0];
    wx.setStorageSync(PROFILE_KEY, nextProfile);
    return nextProfile;
  }
}

/**
 * 退出登录
 */
function logout() {
  request.clearToken();
  request.clearUserInfo();
  wx.removeStorageSync(PROFILE_KEY);
}

/**
 * 转换后端用户数据为前端用户配置文件格式
 */
function transformUserProfile(userInfo) {
  if (!userInfo) return null;

  const roleMap = {
    'admin': 'engineer',
    'manager': 'tenantAdmin',
    'employee': 'customer'
  };

  // 如果是系统管理员，使用特殊角色代码
  const mappedRole = userInfo.is_admin ? 'admin' : (roleMap[userInfo.role] || 'customer');

  console.log('=== transformUserProfile ===');
  console.log('原始角色:', userInfo.role);
  console.log('是否管理员:', userInfo.is_admin);
  console.log('映射后角色:', mappedRole);
  console.log('公司ID:', userInfo.company_id);
  console.log('用户ID:', userInfo.id);

  return {
    userId: String(userInfo.id),
    tenantId: userInfo.company_id ? String(userInfo.company_id) : 'tenant-internal',
    tenantName: userInfo.company?.name || '平台服务中心',
    roleCode: mappedRole,
    name: userInfo.full_name || userInfo.username,
    mobile: userInfo.phone || '',
    employeeNo: userInfo.username,
    deviceScope: [], // TODO: 从后端获取用户设备权限
    menuCodes: ["home", "workorders", "devices", "materials", "profile"], // TODO: 根据角色动态生成
    // 保存原始用户数据
    _raw: userInfo
  };
}

function updateHomePrefs(prefs) {
  wx.setStorageSync("homePrefs", prefs);
  return prefs;
}

module.exports = {
  ensureSession,
  getCurrentProfile,
  switchProfile,
  login,
  logout,
  updateHomePrefs,
};
