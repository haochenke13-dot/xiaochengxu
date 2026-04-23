const banners = [
  {
    id: "banner-1",
    title: "季度保养计划已发布",
    desc: "请在 4 月 10 日前完成重点设备巡检与照片回传。",
    type: "通知",
  },
  {
    id: "banner-2",
    title: "售后培训内容更新",
    desc: "新增包装线张紧模块调试课程，支持工程师与客户侧查看。",
    type: "培训",
  },
];

const users = [
  {
    userId: "1",
    tenantId: "1",
    tenantName: "测试公司",
    roleCode: "admin",
    name: "系统管理员",
    mobile: "13800000001",
    employeeNo: "admin",
    deviceScope: [],
    menuCodes: ["home", "workorders", "devices", "materials", "profile"],
  },
  {
    userId: "2",
    tenantId: "1",
    tenantName: "测试公司",
    roleCode: "tenantAdmin",
    name: "王经理",
    mobile: "13800000002",
    employeeNo: "manager",
    deviceScope: [],
    menuCodes: ["home", "workorders", "devices", "materials", "profile"],
  },
  {
    userId: "3",
    tenantId: "1",
    tenantName: "测试公司",
    roleCode: "engineer",
    name: "张技术",
    mobile: "13800000003",
    employeeNo: "tech",
    deviceScope: [],
    menuCodes: ["home", "workorders", "devices", "materials", "profile"],
  },
  {
    userId: "U-ENG-001",
    tenantId: "tenant-internal",
    tenantName: "平台服务中心",
    roleCode: "engineer",
    name: "李工",
    mobile: "13800000001",
    employeeNo: "ENG1001",
    deviceScope: ["DEV-1001", "DEV-1002", "DEV-2001"],
    menuCodes: ["home", "workorders", "devices", "materials", "profile"],
  },
  {
    userId: "U-TEN-001",
    tenantId: "tenant-a",
    tenantName: "华东食品工厂",
    roleCode: "tenantAdmin",
    name: "王主管",
    mobile: "13800000002",
    employeeNo: "TEN2001",
    deviceScope: ["DEV-1001", "DEV-1002"],
    menuCodes: ["home", "workorders", "devices", "materials", "profile"],
  },
  {
    userId: "U-CUS-001",
    tenantId: "tenant-a",
    tenantName: "华东食品工厂",
    roleCode: "customer",
    name: "陈操作员",
    mobile: "13800000003",
    employeeNo: "CUS3001",
    deviceScope: ["DEV-1001"],
    menuCodes: ["home", "workorders", "devices", "materials", "profile"],
  },
];

const tenants = [
  {
    tenantId: "1",
    name: "测试公司",
    type: "客户租户",
    status: "active",
    inviteCode: "TEST-2026",
  },
  {
    tenantId: "tenant-a",
    name: "华东食品工厂",
    type: "客户租户",
    status: "active",
    inviteCode: "EAST-2026",
  },
  {
    tenantId: "tenant-b",
    name: "华南医药车间",
    type: "客户租户",
    status: "active",
    inviteCode: "SOUTH-2026",
  },
  {
    tenantId: "tenant-internal",
    name: "平台服务中心",
    type: "内部租户",
    status: "active",
    inviteCode: "OPS-2026",
  },
];

const devices = [
  {
    deviceId: "1",
    tenantId: "1",
    tenantName: "测试公司",
    name: "测试设备A",
    model: "TEST-100",
    type: "测试设备",
    status: "running",
    runtime: "100 小时",
    lastHeartbeat: "2026-04-22 10:00",
    location: "测试区域1",
    params: [
      { label: "温度", value: "25.0℃" },
      { label: "湿度", value: "50%" },
      { label: "电压", value: "220V" },
    ],
    alarms: [],
  },
  {
    deviceId: "2",
    tenantId: "1",
    tenantName: "测试公司",
    name: "测试设备B",
    model: "TEST-200",
    type: "测试设备",
    status: "warning",
    runtime: "50 小时",
    lastHeartbeat: "2026-04-22 09:30",
    location: "测试区域2",
    params: [
      { label: "温度", value: "28.5℃" },
      { label: "湿度", value: "55%" },
      { label: "电压", value: "215V" },
    ],
    alarms: [
      { id: "AL-001", level: "warning", title: "温度偏高", time: "2026-04-22 09:30" },
    ],
  },
];

const workOrders = [];

const notifications = [
  {
    id: "MSG-1",
    category: "系统通知",
    title: "Beta 试运行开启",
    desc: "本周将开放华东食品工厂试点租户。",
    time: "2026-03-31 09:00",
    read: false,
    audience: ["engineer", "tenantAdmin", "customer"],
  },
  {
    id: "MSG-2",
    category: "工单通知",
    title: "新工单 WO-2001 待处理",
    desc: "包装线 A1 维修工单已创建，请及时跟进。",
    time: "2026-03-31 09:15",
    read: false,
    audience: ["engineer", "tenantAdmin"],
  },
  {
    id: "MSG-3",
    category: "告警通知",
    title: "灌装线 B2 压力异常",
    desc: "设备出现中级告警，建议尽快查看设备详情。",
    time: "2026-03-31 08:44",
    read: true,
    audience: ["engineer", "tenantAdmin", "customer"],
  },
];

const contents = [
  {
    contentId: "CT-1",
    category: "售后视频",
    title: "包装线 A1 封口模块校准教程",
    summary: "适合工程师与租户管理员快速定位常见温控问题。",
    audience: ["engineer", "tenantAdmin"],
    publishStatus: "published",
    duration: "08:32",
  },
  {
    contentId: "CT-2",
    category: "工单经验",
    title: "灌装线压力波动的 5 个排查步骤",
    summary: "从进料、阀门、滤芯到参数校验的现场排查清单。",
    audience: ["engineer", "tenantAdmin", "customer"],
    publishStatus: "published",
    duration: "阅读 5 分钟",
  },
  {
    contentId: "CT-3",
    category: "使用技巧",
    title: "客户侧如何通过扫码快速报修",
    summary: "扫码后自动带入设备信息，减少人工填写。",
    audience: ["tenantAdmin", "customer"],
    publishStatus: "published",
    duration: "阅读 3 分钟",
  },
];

const knowledgeItems = [
  { id: "KN-1", title: "作业指导书", desc: "查看设备安装、维修与保养 SOP。" },
  { id: "KN-2", title: "售后培训视频", desc: "分角色查看培训课程与案例复盘。" },
  { id: "KN-3", title: "常见问题", desc: "现场常见报错与解决步骤汇总。" },
];

// 物料系列定义
const MATERIAL_SERIES = [
  { id: 'venus', seriesNum: 2, name: 'Venus系列', nameEn: 'Venus Series' },
  { id: 'smart', seriesNum: 1, name: 'Smart系列', nameEn: 'Smart Series' }
];

// 物料型号定义
const MATERIAL_MODELS = {
  venus: [
    { id: 'venus100', name: 'Venus100', nameEn: 'Venus100' },
    { id: 'venus300', name: 'Venus300', nameEn: 'Venus300' },
    { id: 'venus500', name: 'Venus500', nameEn: 'Venus500' },
    { id: 'venus9000', name: 'Venus9000', nameEn: 'Venus9000' }
  ],
  smart: [
    { id: 'smart500', name: 'Smart500', nameEn: 'Smart500' },
    { id: 'smart6500', name: 'Smart6500', nameEn: 'Smart6500' }
  ]
};

// 物料数据（按型号组织）
const MATERIALS = {
  venus100: [
    { materialId: 'MT-V100-001', name: '主控板', category: 'parts', spec: 'V100-CTRL-01', price: '¥2,800' },
    { materialId: 'MT-V100-002', name: '电源模块', category: 'parts', spec: 'V100-PWR-02', price: '¥580' },
    { materialId: 'MT-V100-003', name: '传感器套装', category: 'accessories', spec: 'V100-SENS-03', price: '¥1,200' },
    { materialId: 'MT-V100-004', name: '校准标准件', category: 'consumables', spec: 'V100-CAL-04', price: '¥350' }
  ],
  venus300: [
    { materialId: 'MT-V300-001', name: '主控板', category: 'parts', spec: 'V300-CTRL-01', price: '¥3,200' },
    { materialId: 'MT-V300-002', name: '光学组件', category: 'parts', spec: 'V300-OPT-02', price: '¥4,500' },
    { materialId: 'MT-V300-003', name: '检测探头', category: 'accessories', spec: 'V300-PROBE-03', price: '¥890' },
    { materialId: 'MT-V300-004', name: '标准液试剂', category: 'consumables', spec: 'V300-REAGENT-04', price: '¥280' }
  ],
  venus500: [
    { materialId: 'MT-V500-001', name: '核心处理器', category: 'parts', spec: 'V500-CPU-01', price: '¥4,800' },
    { materialId: 'MT-V500-002', name: '液路模块', category: 'parts', spec: 'V500-FLUID-02', price: '¥2,100' },
    { materialId: 'MT-V500-003', name: '样品盘', category: 'accessories', spec: 'V500-TRAY-03', price: '¥650' },
    { materialId: 'MT-V500-004', name: '清洗液', category: 'consumables', spec: 'V500-CLEAN-04', price: '¥180' }
  ],
  venus9000: [
    { materialId: 'MT-V9000-001', name: '主板总成', category: 'parts', spec: 'V9000-MAIN-01', price: '¥12,800' },
    { materialId: 'MT-V9000-002', name: '光学引擎', category: 'parts', spec: 'V9000-OPT-02', price: '¥8,500' },
    { materialId: 'MT-V9000-003', name: '自动进样器', category: 'accessories', spec: 'V9000-AUTO-03', price: '¥3,200' },
    { materialId: 'MT-V9000-004', name: '校准品', category: 'consumables', spec: 'V9000-CAL-04', price: '¥580' }
  ],
  smart500: [
    { materialId: 'MT-S500-001', name: '显示屏', category: 'parts', spec: 'S500-DISP-01', price: '¥890' },
    { materialId: 'MT-S500-002', name: '触摸面板', category: 'parts', spec: 'S500-TOUCH-02', price: '¥650' },
    { materialId: 'MT-S500-003', name: '打印模块', category: 'accessories', spec: 'S500-PRINT-03', price: '¥420' },
    { materialId: 'MT-S500-004', name: '打印纸', category: 'consumables', spec: 'S500-PAPER-04', price: '¥45' }
  ],
  smart6500: [
    { materialId: 'MT-S6500-001', name: '处理器', category: 'parts', spec: 'S6500-CPU-01', price: '¥1,500' },
    { materialId: 'MT-S6500-002', name: '存储模块', category: 'parts', spec: 'S6500-STORAGE-02', price: '¥780' },
    { materialId: 'MT-S6500-003', name: '网络适配器', category: 'accessories', spec: 'S6500-NET-03', price: '¥320' },
    { materialId: 'MT-S6500-004', name: '密封圈套装', category: 'consumables', spec: 'S6500-SEAL-04', price: '¥120' }
  ]
};

// 物料分类
const MATERIAL_CATEGORIES = {
  parts: { name: '零件', nameEn: 'Parts', icon: 'part', color: '#0EA5E9' },
  accessories: { name: '配件', nameEn: 'Accessories', icon: 'accessory', color: '#8B5CF6' },
  consumables: { name: '耗材', nameEn: 'Consumables', icon: 'consumable', color: '#10B981' }
};

module.exports = {
  banners,
  users,
  tenants,
  devices,
  workOrders,
  notifications,
  contents,
  knowledgeItems,
  MATERIAL_SERIES,
  MATERIAL_MODELS,
  MATERIALS,
  MATERIAL_CATEGORIES,
};
