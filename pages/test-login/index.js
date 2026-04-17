/**
 * 登录测试页面
 * 用于快速测试不同的账号组合
 */
const config = require("../../utils/config");
const cache = require("../../utils/cache");

Page({
  data: {
    baseURL: config.baseURL,
    testResults: [],
    isTesting: false,
    currentAccount: null
  },

  /**
   * 测试单个账号（带OAuth凭据）
   */
  async testAccount(e) {
    const { username, password, clientId, clientSecret } = e.currentTarget.dataset;
    const account = { username, password, clientId, clientSecret };

    this.setData({
      isTesting: true,
      currentAccount: account
    });

    try {
      console.log(`测试账号: ${username} / ${password}`);
      if (clientId) console.log(`Client ID: ${clientId}`);

      let formData = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password`;
      if (clientId) {
        formData += `&client_id=${encodeURIComponent(clientId)}`;
      }
      if (clientSecret) {
        formData += `&client_secret=${encodeURIComponent(clientSecret)}`;
      }

      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: `${config.baseURL}/api/v1/auth/login`,
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: formData,
          success: (res) => {
            console.log('=== 登录API响应 ===');
            console.log('状态码:', res.statusCode);
            console.log('响应数据 (JSON):', JSON.stringify(res.data, null, 2));
            console.log('响应数据所有键:', Object.keys(res.data));
            if (res.data.access_token) {
              console.log('Token存在:', res.data.access_token.substring(0, 30) + '...');
            }
            if (res.data.user) {
              console.log('User对象:', JSON.stringify(res.data.user, null, 2));
              console.log('User对象所有键:', Object.keys(res.data.user));
            }
            resolve(res);
          },
          fail: reject
        });
      });

      const result = {
        account,
        success: response.statusCode === 200,
        status: response.statusCode,
        data: response.data
      };

      // 添加结果到列表顶部
      const testResults = [result, ...this.data.testResults];
      this.setData({ testResults });

      if (result.success) {
        wx.showToast({
          title: '登录成功!',
          icon: 'success'
        });

        // 保存token
        if (response.data.access_token) {
          wx.setStorageSync(config.tokenKey, response.data.access_token);

          // 获取用户信息
          try {
            const userInfo = await new Promise((resolve, reject) => {
              wx.request({
                url: `${config.baseURL}/api/v1/auth/me`,
                method: 'GET',
                header: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${response.data.access_token}`
                },
                success: resolve,
                fail: reject
              });
            });

            console.log('=== 获取用户信息成功 ===');
            console.log('用户信息 (JSON):', JSON.stringify(userInfo.data, null, 2));
            console.log('用户信息所有键:', Object.keys(userInfo.data));

            if (userInfo.statusCode === 200 && userInfo.data) {
              wx.setStorageSync(config.userKey, userInfo.data);
              console.log('用户信息已保存');
            }
          } catch (error) {
            console.error('获取用户信息失败:', error);
          }
        }

        console.log('登录成功，Token已保存');
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('测试失败:', error);
      const result = {
        account,
        success: false,
        error: error.message || '网络错误'
      };

      const testResults = [result, ...this.data.testResults];
      this.setData({ testResults });

      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      this.setData({
        isTesting: false,
        currentAccount: null
      });
    }
  },

  /**
   * 清除所有结果
   */
  clearResults() {
    this.setData({ testResults: [] });
    wx.showToast({
      title: '已清空',
      icon: 'none'
    });
  },

  /**
   * 复制账号信息
   */
  copyAccount(e) {
    const { username, password } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: `${username}/${password}`,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 跳转到首页
   */
  goToHome() {
    wx.switchTab({
      url: '/pages/home/index'
    });
  },

  /**
   * 清除Token
   */
  clearToken() {
    console.log('=== 开始清除所有数据 ===');

    // 清除Token
    wx.removeStorageSync(config.tokenKey);
    console.log('✓ Token已清除');

    // 清除用户信息
    wx.removeStorageSync(config.userKey);
    console.log('✓ 用户信息已清除');

    // 清除profile缓存
    wx.removeStorageSync('currentProfile');
    console.log('✓ Profile缓存已清除');

    // 清除所有数据缓存
    cache.clearAll();
    console.log('✓ 数据缓存已清除');

    console.log('=== 已清除所有缓存和Token ===');
    wx.showToast({
      title: '已清除所有数据',
      icon: 'success',
      duration: 2000
    });
  }
});
