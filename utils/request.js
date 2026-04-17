/**
 * HTTP 请求封装
 * 基于 wx.request 封装，提供统一的 API 调用接口
 */

const config = require('./config');

/**
 * 发起 HTTP 请求
 * @param {Object} options 请求配置
 * @returns {Promise} 返回 Promise 对象
 */
function request(options) {
  const {
    url,
    method = 'GET',
    data = null,
    params = null,
    headers = {},
    needAuth = true
  } = options;

  // 构建完整 URL
  let fullUrl = url;
  if (!url.startsWith('http')) {
    fullUrl = `${config.baseURL}${url}`;
  }

  // 添加查询参数
  if (params) {
    const query = Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + query;
  }

  // 获取 Token
  let token = null;
  if (needAuth) {
    try {
      token = wx.getStorageSync(config.tokenKey);
    } catch (e) {
      console.warn('获取 Token 失败:', e);
    }
  }

  // 构建请求头
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (config.debug) {
    console.log('=== API 请求 ===');
    console.log('URL:', fullUrl);
    console.log('Method:', method);
    console.log('Headers:', requestHeaders);
    console.log('Data:', data);
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method: method.toUpperCase(),
      data: data,
      header: requestHeaders,
      timeout: config.timeout,
      success: (res) => {
        if (config.debug) {
          console.log('=== API 响应 ===');
          console.log('Status:', res.statusCode);
          console.log('Data:', res.data);
        }

        // 处理 HTTP 状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token 过期或无效
          handleUnauthorized();
          const error = new Error('登录已过期，请重新登录');
          error.response = { status: res.statusCode, data: res.data };
          reject(error);
        } else if (res.statusCode === 403) {
          const error = new Error('没有权限访问');
          error.response = { status: res.statusCode, data: res.data };
          reject(error);
        } else if (res.statusCode === 404) {
          const error = new Error('请求的资源不存在');
          error.response = { status: res.statusCode, data: res.data };
          reject(error);
        } else if (res.statusCode >= 500) {
          const error = new Error('服务器错误，请稍后重试');
          error.response = { status: res.statusCode, data: res.data };
          reject(error);
        } else {
          const error = new Error(res.data?.detail || '请求失败');
          error.response = { status: res.statusCode, data: res.data };
          reject(error);
        }
      },
      fail: (err) => {
        console.error('API 请求失败:', err);
        let error;
        if (err.errMsg?.includes('timeout')) {
          error = new Error('请求超时，请检查网络连接');
        } else if (err.errMsg?.includes('fail')) {
          error = new Error('网络连接失败，请检查网络设置');
        } else {
          error = new Error('请求失败：' + (err.errMsg || '未知错误'));
        }
        error.response = { status: null, data: null };
        reject(error);
      }
    });
  });
}

/**
 * 处理未授权（401）情况
 */
function handleUnauthorized() {
  try {
    wx.removeStorageSync(config.tokenKey);
    wx.removeStorageSync(config.userKey);

    // 跳转到登录页
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage?.route !== 'pages/profile/profile') {
      wx.showToast({
        title: '登录已过期',
        icon: 'none'
      });
    }
  } catch (e) {
    console.error('处理未授权失败:', e);
  }
}

/**
 * GET 请求
 */
function get(url, params = null, options = {}) {
  return request({
    url,
    method: 'GET',
    params,
    ...options
  });
}

/**
 * POST 请求
 */
function post(url, data = null, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

/**
 * PUT 请求
 */
function put(url, data = null, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
}

/**
 * DELETE 请求
 */
function del(url, options = {}) {
  return request({
    url,
    method: 'DELETE',
    ...options
  });
}

/**
 * 设置 Token
 */
function setToken(token) {
  try {
    wx.setStorageSync(config.tokenKey, token);
  } catch (e) {
    console.error('保存 Token 失败:', e);
  }
}

/**
 * 获取 Token
 */
function getToken() {
  try {
    return wx.getStorageSync(config.tokenKey);
  } catch (e) {
    console.error('获取 Token 失败:', e);
    return null;
  }
}

/**
 * 清除 Token
 */
function clearToken() {
  try {
    wx.removeStorageSync(config.tokenKey);
  } catch (e) {
    console.error('清除 Token 失败:', e);
  }
}

/**
 * 设置用户信息
 */
function setUserInfo(userInfo) {
  try {
    wx.setStorageSync(config.userKey, userInfo);
  } catch (e) {
    console.error('保存用户信息失败:', e);
  }
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  try {
    return wx.getStorageSync(config.userKey);
  } catch (e) {
    console.error('获取用户信息失败:', e);
    return null;
  }
}

/**
 * 清除用户信息
 */
function clearUserInfo() {
  try {
    wx.removeStorageSync(config.userKey);
  } catch (e) {
    console.error('清除用户信息失败:', e);
  }
}

module.exports = {
  request,
  get,
  post,
  put,
  delete: del,
  setToken,
  getToken,
  clearToken,
  setUserInfo,
  getUserInfo,
  clearUserInfo
};
