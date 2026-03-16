# EDC临床研究数据管理系统

一个基于 React + TypeScript + Ant Design 构建的医学级临床研究数据采集（EDC）系统。

## 项目介绍

EDC（Electronic Data Capture）电子数据采集系统是用于临床试验数据管理的专业软件系统。本系统遵循 CuraDigital 设计规范，提供完整的临床试验项目管理、受试者管理、CRF设计、数据采集等功能。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5.x
- **UI组件库**: Ant Design 5.x
- **路由**: React Router 6
- **状态管理**: React Context
- **样式**: CSS Modules + CSS Variables

## 功能模块

### 项目管理
- 项目列表与详情
- 项目创建向导
- 项目审核流程
- 访视-CRF矩阵配置

### 受试者管理
- 受试者列表
- 筛选与入组
- 访视进度跟踪
- CRF数据填写

### CRF管理
- 表单设计器
- 模板市场
- 字段属性配置

### 数据采集
- CRF数据录入
- OCR智能识别导入
- 自动保存
- 质疑管理

### 系统配置
- 用户管理
- 角色权限
- 中心管理
- 标准字典库

## 快速开始

### 安装依赖

```bash
cd edc-clinical-system
npm install
```

### 启动开发服务器

```bash
npm run dev
```

系统将在 http://localhost:5173 运行

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录

## 项目结构

```
edc-clinical-system/
├── src/
│   ├── components/       # 组件
│   │   ├── Layout/       # 布局组件
│   │   ├── Common/        # 通用组件
│   │   └── OCRImport/    # OCR导入组件
│   ├── pages/            # 页面组件
│   ├── constants/        # 常量配置
│   ├── contexts/        # React Context
│   ├── hooks/           # 自定义Hooks
│   ├── styles/          # 样式文件
│   ├── types/           # TypeScript类型
│   ├── utils/           # 工具函数
│   └── router.tsx      # 路由配置
├── public/              # 静态资源
└── package.json
```

## 设计规范

本系统遵循 CuraDigital 设计规范：
- 主色调: #5CB8A6 (青绿色)
- 字体: Inter + Noto Sans SC
- 圆角: 12px (卡片), 20px (标签)
- 表格行: 白/浅绿/浅红 三色交替

## 角色权限

系统支持以下角色：
- 管理员 (admin)
- 研究者 (investigator)
- 数据录入员 (dataEntry)
- 监查员 (monitor)
- 稽查员 (inspector)
- 审计员 (auditor)

## 许可证

MIT License
