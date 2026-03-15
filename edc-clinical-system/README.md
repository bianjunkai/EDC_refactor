# EDC 临床研究数据采集系统

基于 React + Ant Design 的医疗级数据管理系统。

## 技术栈

- **框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x
- **构建工具**: Vite
- **路由**: React Router 6
- **图标**: @ant-design/icons
- **日期处理**: dayjs

## 项目结构

```
phase3_react/
├── src/
│   ├── components/
│   │   ├── Layout/           # 布局组件
│   │   │   ├── Header.tsx    # 顶部导航
│   │   │   ├── Sidebar.tsx   # 侧边栏菜单
│   │   │   └── MainLayout.tsx # 主布局
│   │   └── Common/           # 通用组件
│   │       └── StatusTag.tsx # 状态标签
│   ├── pages/                # 页面组件
│   │   ├── Dashboard/        # 首页
│   │   ├── ProjectList/      # 项目列表
│   │   ├── SubjectList/      # 受试者列表
│   │   ├── CRFDesigner/      # CRF设计器
│   │   ├── CRFForm/          # CRF表单
│   │   ├── QueryManagement/  # 质疑管理
│   │   ├── QueryDetail/      # 质疑详情
│   │   ├── DataExport/       # 数据导出
│   │   ├── SystemConfig/     # 系统配置
│   │   └── VisitConfig/      # 访视配置
│   ├── hooks/                # 自定义Hooks
│   ├── utils/                # 工具函数
│   │   ├── mockData.ts       # 模拟数据
│   │   └── helpers.ts        # 辅助函数
│   ├── types/                # TypeScript类型
│   ├── constants/            # 常量配置
│   │   └── theme.ts          # 主题配置
│   ├── router.tsx            # 路由配置
│   └── main.tsx              # 应用入口
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 功能模块

### 1. 首页 (Dashboard)
- 欢迎语和当前日期
- 快速操作按钮
- 项目统计卡片
- 最近活动列表
- 通知公告列表
- 全局统计数据

### 2. 项目列表 (ProjectList)
- 项目筛选和搜索
- 项目状态标签
- 项目详情抽屉
- 进度可视化

### 3. 受试者列表 (SubjectList)
- 多维度筛选
- 受试者状态管理
- 访视进度展示
- 受试者详情抽屉

### 4. CRF设计器 (CRFDesigner)
- 拖拽式表单设计
- 丰富的控件类型
- 模板市场
- 属性配置面板

### 5. CRF表单 (CRFForm)
- 分节表单展示
- 自动保存状态
- 质疑列表展示
- 表单验证

### 6. 质疑管理 (QueryManagement)
- 质疑列表筛选
- 状态管理
- 快速回复抽屉

### 7. 质疑详情 (QueryDetail)
- 质疑内容展示
- 原始数据查看
- 回复记录时间线
- 多种操作按钮

### 8. 数据导出 (DataExport)
- 多格式导出(CSV/PDF/SAS)
- 导出范围配置
- 导出历史记录

### 9. 系统配置 (SystemConfig)
- 用户管理
- 角色管理
- 中心管理
- 数据字典
- 审核流程

### 10. 访视配置 (VisitConfig)
- 列表视图/矩阵图切换
- 访视-CRF关联配置
- 访视流程可视化

## 设计规范

### 色彩系统
- **主色**: #10b981 (医疗绿)
- **成功色**: #10b981
- **警告色**: #f59e0b
- **错误色**: #ef4444
- **信息色**: #3b82f6

### 状态标签配色
- 已完成/已入组/已解决: #d1fae5 / #059669
- 进行中/处理中: #fef3c7 / #d97706
- 待处理/待确认: #fee2e2 / #dc2626
- 禁用/草稿: #f3f4f6 / #9ca3af

## 快速开始

```bash
# 安装依赖
cd phase3_react
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 开发规范

1. 使用 TypeScript 编写所有代码
2. 组件使用函数式组件 + Hooks
3. 样式优先使用 Ant Design 组件内置样式
4. 状态管理使用 React 内置 useState/useContext
5. 路由使用 React Router 6

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
