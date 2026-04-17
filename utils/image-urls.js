/**
 * 图片资源URL配置
 * 将本地图片资源替换为图床外链，减少代码包大小
 */

module.exports = {
  // 公司Logo
  companyLogo: 'https://your-cdn.com/assets/company-logo.jpg',

  // 登录背景
  loginBg: 'https://your-cdn.com/assets/login-bg.jpg',

  // Tab栏图标
  tabbar: {
    home: 'https://your-cdn.com/assets/tabbar/home.png',
    homeActive: 'https://your-cdn.com/assets/tabbar/home-active.png',
    device: 'https://your-cdn.com/assets/tabbar/device.png',
    deviceActive: 'https://your-cdn.com/assets/tabbar/device-active.png',
    workorder: 'https://your-cdn.com/assets/tabbar/workorder.png',
    workorderActive: 'https://your-cdn.com/assets/tabbar/workorder-active.png',
    discover: 'https://your-cdn.com/assets/tabbar/discover.png',
    discoverActive: 'https://your-cdn.com/assets/tabbar/discover-active.png',
    profile: 'https://your-cdn.com/assets/tabbar/profile.png',
    profileActive: 'https://your-cdn.com/assets/tabbar/profile-active.png',
  },

  // 设备型号图片
  models: {
    venus100: 'https://user8310.cn.imgto.link/public/20260417/venus100.avif',
    venus300: 'https://user8310.cn.imgto.link/public/20260417/venus300.avif',
    venus500: 'https://user8310.cn.imgto.link/public/20260417/venus500.avif',
    venus9000: 'https://user8310.cn.imgto.link/public/20260417/venus9000.avif',
    smart500: 'https://user8310.cn.imgto.link/public/20260417/smart500.avif',
    smart6500: 'https://user8310.cn.imgto.link/public/20260417/smart6500.avif',
  },

  // 物料图片基础路径
  partsBaseUrl: 'https://your-cdn.com/assets/parts/',
};