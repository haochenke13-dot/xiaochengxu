# 重复页面清理方案

## 📊 现状分析

项目中存在大量重复的页面文件，增加了维护难度和包体积。

### 📁 重复页面清单

| pages/ 下的页面 | 对应的 subpackages 页面 | 状态 | 建议 |
|---------------|---------------------|------|------|
| `pages/discover/` | `subpackages/common/pages/discover/` | ❌ 重复 | **可删除** |
| `pages/notifications/` | `subpackages/common/pages/notifications/` | ❌ 重复 | **可删除** |
| `pages/feedback/` | `subpackages/common/pages/feedback/` | ❌ 重复 | **可删除** |
| `pages/about/` | `subpackages/common/pages/about/` | ❌ 重复 | **可删除** |
| `pages/tenant-staff/` | `subpackages/common/pages/tenant-staff/` | ❌ 重复 | **可删除** |
| `pages/settings/` | `subpackages/common/pages/settings/` | ❌ 重复 | **可删除** |
| `pages/device-assignment/` | `subpackages/device/pages/assignment/` | ❌ 重复 | **可删除** |

### ✅ 需要保留的 pages/ 页面

| 页面 | 原因 |
|------|------|
| `pages/login/` | 主包登录页面 |
| `pages/home/` | 主包首页 |
| `pages/workorders/` | 主包工单列表 |
| `pages/devices/` | 主包设备列表 |
| `pages/materials/` | 主包物料页面 |
| `pages/profile/` | 主包个人中心 |
| `pages/test-login/` | 测试登录页面 |
| `pages/cart/` | 购物车页面 |
| `pages/device-detail/` | 设备详情（被其他页面引用） |
| `pages/workorder-detail/` | 工单详情（被其他页面引用） |
| `pages/workorder-form/` | 工单表单（被其他页面引用） |
| `pages/scan-result/` | 扫码结果页面 |

## 🗑️ 安全删除步骤

### 第一步：备份项目
```bash
# 在删除之前，先备份整个项目
cp -r 小程序 小程序_backup
```

### 第二步：验证页面没有被引用
使用以下命令确认页面没有被引用：
```bash
# 搜索页面引用
grep -r "pages/discover/index" --include="*.js" --include="*.wxml"
grep -r "pages/notifications/index" --include="*.js" --include="*.wxml"
```

### 第三步：删除文件
```bash
# 删除重复的页面文件夹
rm -rf pages/discover/
rm -rf pages/notifications/
rm -rf pages/feedback/
rm -rf pages/about/
rm -rf pages/tenant-staff/
rm -rf pages/settings/
rm -rf pages/device-assignment/
```

### 第四步：测试验证
1. 在开发者工具中重新编译项目
2. 测试所有页面跳转功能
3. 确认没有页面找不到的错误

## 📈 预期收益

- **减少包体积**：约 10-15% 的代码量减少
- **降低维护成本**：只需维护一套页面代码
- **提高代码一致性**：避免版本不一致的问题
- **简化项目结构**：更清晰的项目组织

## ⚠️ 注意事项

1. **不要删除** pages/ 下仍在使用的页面（见上面的保留清单）
2. **删除前务必备份**，以防需要恢复
3. **逐步删除**，每次删除后测试功能
4. **检查 app.json** 确保没有配置这些页面

## 🔄 回滚方案

如果删除后出现问题，可以从备份恢复：
```bash
# 恢复单个页面
cp -r 小程序_backup/pages/discover 小程序/pages/

# 或恢复整个项目
cp -r 小程序_backup/* 小程序/
```

## ✅ 执行建议

建议按照以下顺序执行：
1. 先删除 `pages/discover/`，测试发现页面功能
2. 再删除 `pages/notifications/`，测试通知页面功能
3. 依次删除其他页面，每次删除后测试相关功能
4. 确认所有功能正常后，删除备份文件

---

**生成时间**：2026-04-23
**状态**：等待执行
**优先级**：中（可在生产环境稳定后执行）
