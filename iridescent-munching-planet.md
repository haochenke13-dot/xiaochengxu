# 设备服务与工单协同平台 Beta - 实施计划

## Context

这是一个微信小程序项目，用于设备服务与工单协同管理。项目已完整实现前端功能，包括多租户支持、多角色协同（工程师/租户管理员/客户员工）、工单全流程管理、设备监控、扫码识别等核心功能。

**当前状态**：Beta 版本，使用 Mock 数据运行
**实施目标**：从零部署运行，接入真实 API，完成生产环境发布

---

## 实施步骤

### 第一阶段：本地运行与体验

#### 1. 环境准备（5分钟）
- 安装微信开发者工具（最新稳定版）
- 准备微信小程序 AppID（测试号或正式账号）

**关键文件**：[project.config.json](project.config.json)
- 当前 `appid: "touristappid"` 需替换为真实 AppID
- 确认 `urlCheck: false`（开发阶段关闭域名校验）

#### 2. 项目启动（2分钟）
1. 打开微信开发者工具
2. 导入项目：`g:\360MoveData\Users\admin\Desktop\小程序`
3. 工具自动编译，默认登录为"内部工程师-李工"
4. 查看首页工作台，体验基础功能

#### 3. 多角色体验（10分钟）
通过"我的"页面切换角色，验证差异化功能：

**角色权限矩阵**：
- **内部工程师**：可接单、可完结、查看分配设备
- **租户管理员**：可提报工单、可接单、员工管理、设备分配
- **客户员工**：可报修、查看进度、查看分配设备

**切换入口**：[pages/profile/index.wxml](pages/profile/index.wxml)

---

### 第二阶段：架构理解与开发准备

#### 1. 核心架构学习（30分钟）

**数据流架构**：
```
Mock 数据 → Services 层（权限过滤）→ 页面组件 → 用户界面
```

**关键文件清单**：

| 文件 | 作用 | 重要性 |
|------|------|--------|
| [utils/services.js](utils/services.js) | 18 个数据访问接口 | ⭐⭐⭐⭐⭐ |
| [utils/mock.js](utils/mock.js) | Mock 数据源 | ⭐⭐⭐⭐ |
| [utils/permissions.js](utils/permissions.js) | 功能权限控制 | ⭐⭐⭐⭐ |
| [utils/session.js](utils/session.js) | 会话管理 | ⭐⭐⭐⭐ |
| [app.js](app.js) | 全局入口 | ⭐⭐⭐ |

#### 2. 服务层接口理解

**核心接口**（[utils/services.js](utils/services.js)）：

**设备管理**：
- `getVisibleDevices(profile, filters)` - 获取可见设备列表（自动权限过滤）
- `getDeviceDetail(deviceId)` - 获取设备详情

**工单管理**：
- `getVisibleWorkOrders(profile, status)` - 获取可见工单
- `createWorkOrder(payload)` - 创建工单
- `acceptWorkOrder(workOrderId)` - 接单
- `closeWorkOrder(workOrderId)` - 完结工单

**用户与会话**：
- `loginAsRole(roleCode)` - 角色登录
- `getCurrentProfile()` - 获取当前用户

**扫码识别**：
- `parseScanCode(rawCode)` - 解析二维码（支持 `device:xxx` 和 `workorder:xxx`）

---

### 第三阶段：API 接入（核心工作）

#### 1. 创建 API 配置（参考实施）

新建 [utils/config.js](utils/config.js)：
```javascript
module.exports = {
  API_BASE: 'https://your-api-domain.com/api',
  API_TIMEOUT: 10000,
  TOKEN_KEY: 'auth_token',
};
```

#### 2. 封装请求工具

新建 [utils/request.js](utils/request.js)，使用 `wx.request` 封装：
- 统一错误处理（401 跳转登录）
- 自动携带 Token
- 请求/响应拦截

#### 3. 改造 services.js（渐进式）

**策略**：保留接口签名，替换 Mock 为 API 调用

示例改造：
```javascript
// 原版本
function getVisibleDevices(profile, filters = {}) {
  let list = mock.devices.filter(/* ... */);
  return clone(list);
}

// API 版本
async function getVisibleDevices(profile, filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.type) params.type = filters.type;

  return await request('/devices', { method: 'GET', data: params });
}
```

**注意事项**：
- 后端需实现与前端相同的权限逻辑（基于 `roleCode` 和 `deviceScope` 过滤）
- 保持返回数据结构与 Mock 一致
- 添加异常处理和错误提示

#### 4. 渐进式迁移

**步骤**：
1. 添加 `USE_MOCK` 开关
2. 先迁移单一接口（如设备列表）
3. 验证通过后逐步迁移其他接口
4. 最终移除 Mock 数据

---

### 第四阶段：测试与验证

#### 1. 功能测试清单

**基础流程**：
- [ ] 首次启动自动登录
- [ ] 角色切换后数据更新
- [ ] 工单创建 → 接单 → 完结完整流程
- [ ] 扫码识别（设备码/工单码）

**权限验证**：
- [ ] 工程师只能看到 `deviceScope` 内的设备
- [ ] 租户管理员能看到租户下所有设备
- [ ] 功能按钮按角色显示/隐藏

**交互体验**：
- [ ] TabBar 切换流畅
- [ ] 表单验证生效
- [ ] 列表筛选功能正常

#### 2. 真机调试

1. 开发者工具 → "真机调试"
2. 微信扫码连接设备
3. 执行测试清单
4. vConsole 查看错误日志

#### 3. 性能检查

- 首屏加载 < 2 秒
- 页面切换流畅
- 内存占用合理

---

### 第五阶段：发布上线

#### 1. 配置检查

**project.config.json**：
- `appid` 改为正式 AppID
- `urlCheck` 改为 `true`（生产环境）

**app.json**：
- 确认页面路径完整
- 检查 TabBar 配置

#### 2. 上传代码

1. 开发者工具 → "上传"
2. 版本号：`1.0.0`（遵循语义化版本）
3. 项目备注：描述主要功能

#### 3. 提交审核

**微信公众平台 → 开发管理 → 版本管理**：
1. 填写测试账号（如需要）
2. 上传功能截图
3. 填写功能说明文档
4. 提交审核（1-7 个工作日）

#### 4. 发布

审核通过后：
1. 选择"发布"
2. 全量发布或灰度发布
3. 用户可搜索使用

---

## 关键文件清单（开发必读）

### 1. 核心服务层
- **[utils/services.js](utils/services.js)**（222 行）
  - 18 个数据访问接口
  - API 接入的主要改造点
  - 所有页面数据入口

### 2. 数据与状态
- **[utils/mock.js](utils/mock.js)**（279 行）
  - Mock 数据源
  - 数据结构参考
  - API 对接前的数据格式

- **[utils/session.js](utils/session.js)**（36 行）
  - 会话管理：`ensureSession()`, `getCurrentProfile()`, `switchProfile()`
  - 使用 `wx.storage` 持久化

### 3. 权限控制
- **[utils/permissions.js](utils/permissions.js)**（40 行）
  - 功能权限判断：`canCreateWorkOrder`, `canAcceptWorkOrder` 等
  - 角色能力定义

- **[utils/constants.js](utils/constants.js)**（46 行）
  - 角色元数据：`ROLE_META`
  - 状态常量：`WORK_ORDER_STATUS`, `DEVICE_STATUS`

### 4. 全局入口
- **[app.js](app.js)**（26 行）
  - 应用生命周期
  - 全局数据：`globalData.profile`, `globalData.homePrefs`

### 5. 示例页面（参考模式）
- **[pages/home/index.js](pages/home/index.js)**（108 行）
  - 首页逻辑：角色化快捷操作、扫码入口
  - 标准页面生命周期模式

- **[pages/devices/index.js](pages/devices/index.js)**（60 行）
  - 列表页：状态筛选、类型筛选
  - 数据加载模式

- **[pages/workorder-detail/index.js](pages/workorder-detail/index.js)**（53 行）
  - 详情页：权限控制按钮显示
  - 业务操作（接单/完结）

---

## 验证方法

### 开发环境验证
```bash
# 1. 启动微信开发者工具
# 2. 导入项目目录
# 3. 检查编译无错误
# 4. 预览基础功能（登录、列表、详情）
```

### API 对接验证
```javascript
// 在任意页面 onShow 中测试
onShow() {
  const profile = services.getCurrentProfile();
  console.log('当前用户:', profile);

  const devices = services.getVisibleDevices(profile);
  console.log('设备列表:', devices);
}
```

### 生产环境验证
1. 真机调试所有核心流程
2. 多角色权限验证
3. 弱网环境测试
4. 不同机型兼容性测试

---

## 常见问题

**Q: 开发者工具无法打开项目？**
- 检查 project.config.json 格式
- 确认 AppID 有效
- 尝试删除 project.private.config.json

**Q: 切换角色后数据未更新？**
- 确认页面使用 `onShow()` 而非仅 `onLoad()`
- 检查 `getApp().globalData.profile` 是否同步

**Q: API 请求失败？**
- 开发阶段：`urlCheck: false`
- 生产环境：配置服务器域名白名单
- 检查 `wx.request` 超时设置

**Q: 审核被拒？**
- 提供完整测试账号
- 补充详细功能说明
- 检查是否违反平台规范

---

## 后续扩展建议

### 短期（1-2 周）
- API 完整对接
- 骨架屏加载优化
- 错误处理完善

### 中期（1-2 月）
- 实时消息推送
- 文件上传（工单附件）
- 分包加载优化

### 长期（3-6 月）
- 多端支持（H5/APP）
- 数据分析埋点
- 开放 API 平台

---

## 技术栈总结

- **框架**：微信原生小程序（未使用 uni-app/taro）
- **语言**：ES6+ JavaScript
- **样式**：WXSS（类 CSS，支持 rpx 单位）
- **架构**：MVC + 服务层模式
- **权限**：RBAC（基于角色的访问控制）
- **存储**：wx.storage（本地存储）
