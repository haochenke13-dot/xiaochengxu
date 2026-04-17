/**
 * 登录测试页面
 * 用于快速测试不同的账号组合
 */
const config = require("../../utils/config");

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
          success: resolve,
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
          wx.setStorageSync(config.userKey, response.data.user || response.data);
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
    wx.removeStorageSync(config.tokenKey);
    wx.removeStorageSync(config.userKey);
    wx.showToast({
      title: 'Token已清除',
      icon: 'success'
    });
  }
});
