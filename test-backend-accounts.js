/**
 * 后端账号检查工具
 * 用于测试后端数据库中的可用账号
 */

const config = require('./utils/config');

// 常见的测试账号组合
const testAccounts = [
  { username: 'admin', password: 'admin' },
  { username: 'admin', password: '123456' },
  { username: 'admin', password: 'password' },
  { username: 'test', password: 'test' },
  { username: 'test', password: '123456' },
  { username: 'engineer', password: 'engineer' },
  { username: 'engineer', password: '123456' },
  { username: 'user', password: 'user' },
  { username: 'user', password: '123456' },
  { username: 'demo', password: 'demo' },
  { username: 'demo', password: '123456' },
];

/**
 * 测试单个账号
 */
async function testAccount(account) {
  try {
    console.log(`\n=== 测试账号: ${account.username} / ${account.password} ===`);

    const formData = `username=${encodeURIComponent(account.username)}&password=${encodeURIComponent(account.password)}&grant_type=password`;

    const response = await fetch(`${config.baseURL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ 登录成功!');
      console.log('Token:', data.access_token ? data.access_token.substring(0, 20) + '...' : 'N/A');
      console.log('Token Type:', data.token_type);
      console.log('完整响应:', JSON.stringify(data, null, 2));
      return { success: true, account, data };
    } else {
      const errorText = await response.text();
      console.log('❌ 登录失败');
      console.log('状态码:', response.status);
      console.log('错误信息:', errorText);
      return { success: false, account, error: errorText };
    }
  } catch (error) {
    console.log('❌ 网络错误:', error.message);
    return { success: false, account, error: error.message };
  }
}

/**
 * 测试所有账号
 */
async function testAllAccounts() {
  console.log('=== 开始测试后端账号 ===');
  console.log('后端地址:', config.baseURL);
  console.log('测试账号数量:', testAccounts.length);

  const workingAccounts = [];

  for (const account of testAccounts) {
    const result = await testAccount(account);
    if (result.success) {
      workingAccounts.push(result);
    }
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== 测试结果汇总 ===');
  console.log('可用账号数量:', workingAccounts.length);

  if (workingAccounts.length > 0) {
    console.log('\n✅ 可用账号列表:');
    workingAccounts.forEach((result, index) => {
      console.log(`${index + 1}. ${result.account.username} / ${result.account.password}`);
      if (result.data.user) {
        console.log('   用户信息:', result.data.user.full_name || result.data.user.username);
        console.log('   角色:', result.data.user.role);
        console.log('   公司ID:', result.data.user.company_id);
      }
    });
  } else {
    console.log('\n❌ 没有找到可用的测试账号');
    console.log('建议：');
    console.log('1. 联系后端开发者创建测试账号');
    console.log('2. 检查后端服务是否正常运行');
    console.log('3. 确认后端地址是否正确');
  }

  return workingAccounts;
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && require.main === module) {
  testAllAccounts().then(results => {
    if (results.length > 0) {
      console.log('\n建议使用第一个可用账号进行测试');
    }
    process.exit(results.length > 0 ? 0 : 1);
  }).catch(error => {
    console.error('测试过程出错:', error);
    process.exit(1);
  });
}

// 导出供小程序使用
if (typeof wx !== 'undefined') {
  // 在小程序环境中导出
  module.exports = {
    testAccounts,
    testAccount,
    testAllAccounts
  };
}
