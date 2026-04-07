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
    deviceId: "DEV-1001",
    tenantId: "tenant-a",
    tenantName: "华东食品工厂",
    name: "包装线 A1",
    model: "PK-900",
    type: "包装设备",
    status: "running",
    runtime: "326 小时",
    lastHeartbeat: "2026-03-31 09:26",
    location: "一车间 1 区",
    params: [
      { label: "主轴温度", value: "56.2℃" },
      { label: "线速度", value: "128 包/分" },
      { label: "电流", value: "18.4A" },
    ],
    alarms: [
      { id: "AL-1001", level: "warning", title: "封口温度波动", time: "2026-03-30 15:20" },
    ],
  },
  {
    deviceId: "DEV-1002",
    tenantId: "tenant-a",
    tenantName: "华东食品工厂",
    name: "灌装线 B2",
    model: "FL-220",
    type: "灌装设备",
    status: "warning",
    runtime: "188 小时",
    lastHeartbeat: "2026-03-31 08:53",
    location: "二车间 3 区",
    params: [
      { label: "压力", value: "0.92MPa" },
      { label: "液位", value: "71%" },
      { label: "转速", value: "980rpm" },
    ],
    alarms: [
      { id: "AL-1002", level: "danger", title: "进料压力异常", time: "2026-03-31 08:44" },
      { id: "AL-1003", level: "warning", title: "维护周期将至", time: "2026-03-29 10:11" },
    ],
  },
  {
    deviceId: "DEV-2001",
    tenantId: "tenant-b",
    tenantName: "华南医药车间",
    name: "贴标机 C3",
    model: "LB-320",
    type: "贴标设备",
    status: "offline",
    runtime: "91 小时",
    lastHeartbeat: "2026-03-30 19:02",
    location: "三车间 2 区",
    params: [
      { label: "主控版本", value: "v2.3.1" },
      { label: "标签精度", value: "0.2mm" },
      { label: "产能", value: "72 件/分" },
    ],
    alarms: [
      { id: "AL-2001", level: "danger", title: "设备离线", time: "2026-03-30 19:02" },
    ],
  },
];

const workOrders = [
  {
    workOrderId: "WO-2001",
    tenantId: "tenant-a",
    title: "包装线 A1 封口温度偏差",
    deviceId: "DEV-1001",
    deviceName: "包装线 A1",
    type: "维修工单",
    status: "pending",
    assigneeId: "",
    assigneeName: "",
    creatorId: "U-CUS-001",
    creatorName: "陈操作员",
    createdAt: "2026-03-31 09:12",
    priority: "高",
    desc: "封口温度波动导致合格率下降，请尽快排查加热模块。",
    logs: [
      { label: "工单创建", value: "陈操作员 于 2026-03-31 09:12 提交" },
    ],
  },
  {
    workOrderId: "WO-2002",
    tenantId: "tenant-a",
    title: "灌装线 B2 例行保养",
    deviceId: "DEV-1002",
    deviceName: "灌装线 B2",
    type: "保养工单",
    status: "processing",
    assigneeId: "U-ENG-001",
    assigneeName: "李工",
    creatorId: "U-TEN-001",
    creatorName: "王主管",
    createdAt: "2026-03-29 14:05",
    priority: "中",
    desc: "按季度保养计划执行滤芯更换与状态复检。",
    logs: [
      { label: "工单创建", value: "王主管 于 2026-03-29 14:05 提交" },
      { label: "已接单", value: "李工 于 2026-03-29 14:35 接单处理" },
    ],
  },
  {
    workOrderId: "WO-3001",
    tenantId: "tenant-b",
    title: "贴标机 C3 离线排查",
    deviceId: "DEV-2001",
    deviceName: "贴标机 C3",
    type: "巡检工单",
    status: "closed",
    assigneeId: "U-ENG-001",
    assigneeName: "李工",
    creatorId: "U-ENG-001",
    creatorName: "李工",
    createdAt: "2026-03-28 09:50",
    priority: "高",
    desc: "排查网络模块掉线原因并确认恢复。",
    logs: [
      { label: "工单创建", value: "李工 于 2026-03-28 09:50 提交" },
      { label: "已接单", value: "李工 于 2026-03-28 10:02 接单处理" },
      { label: "已完结", value: "李工 于 2026-03-28 18:20 完成并上传报告" },
    ],
  },
];

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
  { id: 'venus', name: 'Venus系列', nameEn: 'Venus Series' },
  { id: 'smart', name: 'Smart系列', nameEn: 'Smart Series' }
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
