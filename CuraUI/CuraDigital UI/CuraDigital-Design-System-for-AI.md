# CuraDigital UI/UX Design System - AI Programming Guide

> **版本**: 2.0 Unified  
> **适用**: AI代码生成、前端开发、UI实现  
> **项目**: CuraDigital 医疗管理系统

---

## 1. 核心设计原则 (Core Principles)

### 1.1 设计哲学
- **医疗专业感**: 以青绿色(Teal)为主色调，传达信任、卫生与高效
- **高信息密度**: 在不牺牲易读性前提下展示大量医疗数据
- **严谨结构**: 利用深浅背景色、细边框和严格字号等级区分信息模块

### 1.2 技术栈
```
框架: React / Vue / 原生HTML+CSS
CSS: Tailwind CSS (推荐) / 自定义CSS
字体: Inter + Noto Sans SC (思源黑体)
图标: Lucide React / SVG线性图标
```

---

## 2. 色彩系统 (Color System) - 必须严格遵守

### 2.1 主色调 (Primary Colors)
| 名称 | 色值 | 用途 |
|------|------|------|
| 主色 | `#5CB8A6` | 品牌色、主要按钮、激活状态、图标 |
| 主色浅 | `#E8F5F2` | 选中背景、悬停背景 |
| 主色深 | `#4A9A8A` | 悬停状态、按下状态 |

### 2.2 中性色 (Neutral Colors)
| 名称 | 色值 | 用途 |
|------|------|------|
| 页面背景 | `#F8F9FA` / `#F8FAFB` | 页面底色 |
| 纯白 | `#FFFFFF` | 卡片、侧边栏、容器 |
| 边框 | `#E8E8E8` | 分隔线、边框 |
| 浅分割线 | `#F0F0F0` / `#F3F4F6` | 卡片内部分隔 |
| 主要文字 | `#333333` | 标题、重要内容 |
| 次要文字 | `#666666` / `#6B7280` | 正文、标签 |
| 辅助文字 | `#999999` / `#9CA3AF` | 元数据、占位符 |
| 禁用/浅灰 | `#E5E7EB` | 禁用状态 |

### 2.3 状态色 (Status Colors) - 语义化使用
| 状态 | 色值 | 浅背景 | 用途 |
|------|------|--------|------|
| 成功/分诊 | `#27AE60` / `#10B981` | `#E8F5E9` / `#D1FAE5` | 完成、正常、triage状态 |
| 警告/等待 | `#F39C12` / `#F97316` | `#FFF3E0` / `#FEF3C7` | 等待、审批中 |
| 错误/紧急 | `#E74C3C` / `#EF4444` | `#FFEBEE` / `#FEE2E2` | 错误、紧急状态 |
| 信息 | `#2196F3` / `#3B82F6` | `#E3F2FD` / `#DBEAFE` | 信息等 |
| 进行中 | `#9C27B0` / `#A855F7` | `#F3E5F5` / `#F3E8FF` | 处理中、紫色状态 |

### 2.4 图标背景色 (Icon Backgrounds)
```css
等待/时钟:  #E3F2FD (蓝背景) + #2196F3 (图标)
分诊/成功:  #E8F5E9 (绿背景) + #27AE60 (图标)  
审批/警告:  #FFF3E0 (橙背景) + #F39C12 (图标)
进行中:     #F3E5F5 (紫背景) + #9C27B0 (图标)
```

---

## 3. ⚠️ 排版系统 (Typography) - 严格规范

### 3.1 字体栈 (Font Stack)
```css
/* 首选方案 */
font-family: 'Inter', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 英文数字强制使用Inter以获得等宽效果 */
```

### 3.2 字体层级表 (必须严格遵守)

| 层级 | 大小 | 字重 | 行高 | 颜色 | 用途 |
|------|------|------|------|------|------|
| H1 | 28px | 700 | 1.2 | #333 | 页面大标题 |
| H2 | 32px | 700 | 1.2 | #333 | 患者姓名、超大标题 |
| H3 | 18px | 700 | 1.2 | #333 | 区块标题、面板标题 |
| H4 | 16px | 600 | 1.2 | #333 | 卡片标题 |
| Body | 14px | 400/500 | 1.5 | #666 | 正文内容 |
| Small | 13px | 400/500 | 1.5 | #666 | 标签、表格内容 |
| Tiny | 12px | 400 | 1.5 | #999 | 辅助信息、日期 |
| Micro | 10px | 700 | 1.3 | #999 | ⚠️ 元数据标签(必须大写+加宽字间距) |

### 3.3 中文排版特殊规则

#### ⚠️ 关键规则 (违反会影响可读性)
```
1. 行高: 中文正文行高 1.6-1.8（英文1.5即可）
2. 字重: 中文避免 Light/Thin (100-300)，使用 400/500/600/700
3. 西文间隙: 中英文混排时自动/手动添加 0.125em 间隙（盘古间隙）
4. 元数据标签: 必须设置 letter-spacing: 0.05em
```

#### Tailwind CSS 示例
```jsx
// 中文正文
<p className="text-sm text-gray-600 leading-relaxed">

// 元数据标签（10px + 大写 + 加宽字间距）
<span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">

// 数字使用Inter字体
<span className="font-mono text-2xl font-bold">
```

---

## 4. 📐 间距系统 (Spacing System)

### 4.1 基础间距 (4px基准)
```
4px   - 极微 (图标间隙)
8px   - 小 (文字与图标间距)
12px  - 中小 (按钮内边距小)
16px  - 标准 (卡片内边距)
20px  - 大 (卡片padding)
24px  - 区块 (主内容区内边距)
32px  - 大区块间距
```

### 4.2 组件间距规范
| 元素 | 尺寸/间距 |
|------|-----------|
| 侧边栏宽度 | 260px (固定) |
| 主内容区内边距 | 24px 32px (py-6 px-8) |
| 卡片内边距 | 20px (p-5) |
| 卡片圆角 | 12px (rounded-xl) |
| 按钮圆角 | 8px (rounded-lg) |
| 小圆角 | 6px (rounded-md) |
| 状态标签圆角 | 20px (rounded-full/pill) |
| 元素间距 | 12px, 16px, 24px |

---

## 5. 🧩 组件规范 (Component Specifications)

### 5.1 侧边栏 (Sidebar) - 固定结构

```tsx
<aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
  {/* Logo区域 */}
  <div className="p-6 flex items-center gap-2">
    <LogoIcon className="w-8 h-8 text-teal-500" />
    <span className="text-xl font-bold text-teal-500">CuraDigital</span>
  </div>
  
  {/* 用户信息 */}
  <div className="px-5 pb-5 flex items-center gap-3 border-b border-gray-200">
    <Avatar className="w-10 h-10 bg-teal-500 rounded-lg text-white font-semibold text-sm">
      DM
    </Avatar>
    <div>
      <div className="text-sm font-semibold text-gray-800">Daniel Martínez</div>
      <div className="text-xs text-gray-400 uppercase">Administrador</div>
    </div>
  </div>
  
  {/* 导航项 (激活态) */}
  <div className="px-3 py-2 mx-3 bg-teal-50 text-teal-600 rounded-md font-medium flex items-center gap-2">
    <Icon className="w-[18px] h-[18px]" />
    <span className="text-sm">Dashboards</span>
    <ChevronDown className="ml-auto" />
  </div>
</aside>
```

**关键规范**:
- 宽度固定 260px
- 导航图标: 18x18px
- 激活态: `bg-teal-50 text-teal-600`
- 默认态: `text-gray-500 hover:bg-gray-50`
- 子菜单左边距: 40px
- 字体: 14px

### 5.2 统计卡片 (Stat Card)

```tsx
<div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
  {/* 图标容器 */}
  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center bg-blue-50">
    <ClockIcon className="w-6 h-6 text-blue-500" />
  </div>
  
  {/* 信息 */}
  <div>
    <div className="text-[13px] text-gray-400 mb-1">标签文字</div>
    <div className="text-[28px] font-bold text-gray-800">8.035</div>
  </div>
</div>
```

**图标背景色对应表**:
- 等待: `bg-[#E3F2FD]` + `text-[#2196F3]`
- 分诊: `bg-[#E8F5E9]` + `text-[#27AE60]`
- 审批: `bg-[#FFF3E0]` + `text-[#F39C12]`
- 进行中: `bg-[#F3E5F5]` + `text-[#9C27B0]`

### 5.3 数据表格 (Data Table)

```tsx
<div className="bg-white rounded-xl overflow-hidden shadow-sm">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        <th className="p-4 text-[13px] font-semibold text-gray-500">表头</th>
      </tr>
    </thead>
    <tbody className="text-[13px]">
      {/* 行颜色交替: 白 / 浅绿 / 浅红 / 循环 */}
      <tr className="bg-white border-b border-gray-100">
      <tr className="bg-[#E8F5E9]/50 border-b border-gray-100">
      <tr className="bg-[#FFEBEE]/50 border-b border-gray-100">
    </tbody>
  </table>
</div>
```

**表格规范**:
- 表头背景: `#F8F9FA`
- 表头字体: 13px, 600, 灰色
- 单元格内边距: 14px 16px
- 行高: 交替颜色 (白/#E8F5E9/#FFEBEE)

### 5.4 手风琴 (Accordion)

```tsx
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="flex justify-between items-center p-4 cursor-pointer">
    <h3 className="text-[15px] font-semibold">标题</h3>
    <ChevronDown className="text-gray-400 transition-transform duration-200" 
                 style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
  </div>
  {isOpen && <div className="px-5 pb-5">内容</div>}
</div>
```

### 5.5 进度条/时间轴 (Timeline)

```tsx
{/* 步骤条 */}
<div className="relative h-1 bg-gray-100 rounded-full flex justify-between">
  <div className="absolute h-full bg-teal-500 rounded-full" style={{ width: '60%' }} />
  {[1,2,3,4,5].map((step) => (
    <div key={step} className="relative flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10
        ${step <= activeStep ? 'bg-teal-500' : 'bg-gray-300'}`} />
      <span className="absolute top-5 text-[10px] text-gray-400 whitespace-nowrap uppercase">
        步骤名称
      </span>
    </div>
  ))}
</div>
```

### 5.6 状态标签 (Status Tags)

```tsx
// 填充样式
<span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-red-500 uppercase">
  OMT
</span>

// 边框样式 (outline)
<span className="px-4 py-1.5 rounded-full text-xs font-semibold text-teal-500 border border-teal-500 uppercase bg-transparent">
  AMD
</span>

// 灰色边框
<span className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-400 border border-gray-300 uppercase">
  LEL
</span>
```

### 5.7 按钮 (Buttons)

```tsx
// 主要按钮
<button className="px-6 py-2.5 bg-teal-500 text-white rounded-lg text-sm font-medium hover:opacity-90">

// 次要按钮
<button className="px-8 py-3 bg-gray-400 text-white rounded-lg text-sm font-medium">

// 图标按钮
<button className="w-11 h-11 flex items-center justify-center rounded-lg bg-teal-500 text-white">

// 状态按钮 (Pill)
<button className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-teal-500 uppercase">
```

### 5.8 输入框 (Inputs)

```tsx
// 标准输入
<input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm 
                   text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none" />

// 搜索框
<div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 h-11">
  <input className="flex-1 text-sm outline-none" placeholder="搜索..." />
  <SearchIcon className="text-gray-400 w-4 h-4" />
</div>
```

### 5.9 弹窗/通知 (Popup)

```tsx
// 来电弹窗
<div className="fixed bottom-6 right-6 w-[280px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
  <div className="flex justify-between items-start p-4">
    <h4 className="text-sm font-semibold text-gray-800">Llamada entrante</h4>
    <button className="text-gray-300 hover:text-gray-500"><XIcon /></button>
  </div>
  <div className="text-center pb-2">
    <div className="bg-teal-500 text-white rounded-lg py-1 mx-4 text-sm font-bold">4:40</div>
  </div>
  <div className="flex gap-2 p-4 pt-2">
    <button className="flex-1 py-3 bg-red-500 text-white rounded-lg flex justify-center">
      <PhoneOffIcon className="w-4 h-4" />
    </button>
    <button className="flex-1 py-3 bg-teal-500 text-white rounded-lg flex justify-center">
      <PhoneIcon className="w-4 h-4" />
    </button>
  </div>
</div>
```

---

## 6. 📱 布局模式 (Layout Patterns)

### 6.1 页面结构模板

#### Dashboard 模板
```tsx
<div className="flex min-h-screen bg-gray-50">
  <Sidebar />
  <main className="flex-1 p-8">
    {/* 面包屑 */}
    <div className="text-[13px] text-gray-400 mb-2">Dashboards / Centralizado</div>
    
    {/* 页面标题 */}
    <h1 className="text-[28px] font-bold text-gray-800 mb-6">Dashboard Centralizado</h1>
    
    {/* 统计标签 */}
    <div className="flex gap-3 mb-6">
      <div className="px-5 py-3 bg-white border border-gray-200 rounded-lg">...</div>
      <div className="px-5 py-3 bg-teal-500 text-white rounded-lg">...</div>
    </div>
    
    {/* 统计卡片 */}
    <div className="grid grid-cols-4 gap-4 mb-8">
      {[1,2,3,4].map(i => <StatCard key={i} />)}
    </div>
    
    {/* Sede卡片网格 */}
    <div className="grid grid-cols-4 gap-4">
      {[1,2,3,4,5,6,7,8].map(i => <SedeCard key={i} />)}
    </div>
  </main>
</div>
```

#### 患者详情模板
```tsx
<div className="flex gap-6">
  {/* 左侧 2/3 */}
  <div className="flex-[2] space-y-4">
    <h2 className="text-[32px] font-bold text-gray-900">患者姓名</h2>
    <Accordion title="信息面板" />
    <Accordion title="历史记录" />
  </div>
  
  {/* 右侧 1/3 */}
  <div className="flex-1 space-y-4">
    <ServicesPanel />
    <MedicalRestArea />
  </div>
</div>
```

### 6.2 响应式断点
```
≥1440px: 4列网格
≥1280px: 4列网格  
≥768px:  2列网格
<768px:  1列网格 (隐藏侧边栏)
```

---

## 7. 🎨 图标规范 (Iconography)

### 7.1 图标风格
- **类型**: 线性图标 (stroke-based)
- **描边宽度**: 2px
- **颜色**: 跟随父元素或使用规范配色

### 7.2 图标尺寸表
| 用途 | 尺寸 |
|------|------|
| 导航图标 | 18x18px |
| 卡片图标 | 24x24px |
| 统计图标 | 24x24px |
| 按钮图标 | 16-20px |
| 操作图标 | 16x16px |
| 展开箭头 | 14x14px |

### 7.3 常用图标映射
```
Home: 房子图标
Dashboard: 四个方块
Users: 多人图标
Services: 扳手图标
Reports: 文件图标
Settings: 齿轮图标
Search: 放大镜
Clock: 时钟圆圈
Location: 定位针
Phone: 电话
Close: X
Back: 左箭头
ChevronDown: 向下箭头
```

---

## 8. ⚡ 交互规范 (Interactions)

### 8.1 过渡动画
```css
transition: all 0.2s ease;
/* 或 */
@apply transition-all duration-200;
```

### 8.2 悬停状态
```
导航项: hover:bg-gray-50
按钮: hover:opacity-90 或 hover:bg-teal-600
链接: hover:text-teal-500
```

### 8.3 展开/收起
```
手风琴: rotate-180 transform duration-200
子菜单: height transition
```

---

## 9. 🚫 禁止事项 (Anti-Patterns)

AI编程时**绝对避免**以下行为：

| ❌ 禁止项 | ✅ 正确做法 |
|-----------|-------------|
| 使用非规范颜色 | 严格使用色彩系统 |
| 改变侧边栏宽度(260px) | 保持固定宽度 |
| 使用不同圆角值 | 仅使用6px/8px/12px/20px |
| 添加额外阴影 | 仅使用卡片阴影和弹窗阴影 |
| 使用非Inter字体 | 必须引入Inter字体 |
| 使用小于12px的字体(除非10px元数据标签) | 最小12px正文 |
| 改变图标风格(保持线性) | stroke-width=2px |
| 忽略表格行颜色交替 | 必须执行白/绿/红循环 |
| 对中文使用Light字重 | 不使用font-thin/light |
| 忽略中英文间隙 | 添加0.125em间隙 |

---

## 10. 🔧 CSS变量定义 (推荐)

```css
:root {
  /* 主色 */
  --primary: #5CB8A6;
  --primary-light: #E8F5F2;
  --primary-dark: #4A9A8A;
  
  /* 中性色 */
  --background: #F8F9FA;
  --white: #FFFFFF;
  --border: #E8E8E8;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-muted: #999999;
  
  /* 状态色 */
  --success: #27AE60;
  --warning: #F39C12;
  --error: #E74C3C;
  
  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 20px;
  
  /* 阴影 */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-modal: 0 8px 32px rgba(0,0,0,0.15);
  
  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 20px;
  --space-xl: 24px;
  
  /* 侧边栏 */
  --sidebar-width: 260px;
}
```

---

## 11. 🤖 AI代码生成指令模板

### 在提示词中使用以下指令：

```
请使用CuraDigital医疗管理系统设计规范生成UI代码：

【色彩要求】
- 主色使用#5CB8A6（青绿色）
- 背景使用#F8F9FA
- 卡片纯白背景
- 边框使用#E8E8E8
- 状态色严格使用规范中的绿/橙/红/蓝/紫

【字体要求】
- 使用Inter + Noto Sans SC字体
- 中英文混排添加0.125em间隙
- 元数据标签使用10px大写加宽字间距
- 中文正文行高1.6-1.8

【组件要求】
- 侧边栏固定260px宽度
- 卡片圆角12px
- 按钮圆角8px
- 状态标签圆角20px(pill)
- 表格行交替颜色(白/#E8F5E9/#FFEBEE)
- 图标使用线性风格2px描边

【交互要求】
- 悬停过渡0.2s ease
- 手风琴箭头旋转180度动画
- 导航选中态使用#E8F5F2背景

【禁止事项】
- 不要使用其他颜色
- 不要改变侧边栏宽度
- 不要使用不同圆角
- 不要添加额外阴影
- 中文避免Light字重
```

---

## 12. ✅ 实现检查清单

在提交代码前检查：

- [ ] 颜色严格使用规范值
- [ ] 间距使用4的倍数(4,8,12,16,20,24,32)
- [ ] 字体正确引入Inter
- [ ] 圆角值正确(6/8/12/20)
- [ ] 阴影仅用于卡片和弹窗
- [ ] 图标是线性风格
- [ ] 悬停和选中状态已定义
- [ ] 过渡动画0.2s
- [ ] 表格行颜色交替实现
- [ ] 中文排版符合规范(行高1.6-1.8)
- [ ] 元数据标签10px大写加宽字间距

---

*设计系统由CuraDigital医疗管理系统UI/UX团队维护*
*最后更新: 2026-03-14*
