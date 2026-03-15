# CuraDigital Design System - Quick Reference Card

> 🎯 **一页纸速查** - AI编程时快速查阅

---

## 🎨 核心颜色 (Core Colors)

```
主色:     #5CB8A6  (青绿色 - 品牌/按钮/激活)
主色浅:   #E8F5F2  (选中背景)
背景:     #F8F9FA  (页面底色)
卡片:     #FFFFFF  (纯白)
边框:     #E8E8E8  (分割线)
主文字:   #333333  (标题)
次文字:   #666666  (正文)
辅助文字: #999999  (元数据)

状态色:
成功绿: #27AE60  |  警告橙: #F39C12  |  错误红: #E74C3C
信息蓝: #2196F3  |  紫色:   #9C27B0
```

---

## 📐 尺寸速查 (Dimensions)

| 元素 | 尺寸 |
|------|------|
| 侧边栏宽度 | **260px** (固定) |
| 主内容内边距 | **24px 32px** |
| 卡片内边距 | **20px** |
| 卡片圆角 | **12px** |
| 按钮圆角 | **8px** |
| 标签圆角 | **20px** (pill) |
| 小圆角 | **6px** |

**间距阶梯**: 4px → 8px → 12px → 16px → 20px → 24px → 32px

---

## 🔤 字体层级 (Typography)

| 层级 | 大小 | 字重 | 用途 |
|------|------|------|------|
| H1 | **28px** | 700 | 页面标题 |
| H2 | **32px** | 700 | 患者姓名 |
| H3 | **18px** | 700 | 区块标题 |
| H4 | **16px** | 600 | 卡片标题 |
| Body | **14px** | 400 | 正文 |
| Small | **13px** | 400 | 标签/表格 |
| Tiny | **12px** | 400 | 辅助信息 |
| Meta | **10px** | 700 | 元数据(大写+宽字间距) |

**字体栈**: `'Inter', 'Noto Sans SC', sans-serif`

---

## 🧩 组件代码片段 (Component Snippets)

### 侧边栏导航项
```tsx
// 激活态
<div className="px-3 py-2 mx-3 bg-teal-50 text-teal-600 rounded-md font-medium flex items-center gap-2">
  <Icon className="w-[18px] h-[18px]" />
  <span className="text-sm">导航文字</span>
</div>

// 默认态
<div className="px-3 py-2 mx-3 text-gray-500 hover:bg-gray-50 rounded-md flex items-center gap-2 cursor-pointer">
```

### 统计卡片
```tsx
<div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
  <div className="w-12 h-12 rounded-[10px] flex items-center justify-center bg-blue-50">
    <ClockIcon className="w-6 h-6 text-blue-500" />
  </div>
  <div>
    <div className="text-[13px] text-gray-400 mb-1">标签</div>
    <div className="text-[28px] font-bold text-gray-800">数值</div>
  </div>
</div>
```

**图标背景色**: 蓝 `#E3F2FD` | 绿 `#E8F5E9` | 橙 `#FFF3E0` | 紫 `#F3E5F5`

### 状态标签
```tsx
// 填充
<span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-red-500 uppercase">
  OMT
</span>

// 边框
<span className="px-4 py-1.5 rounded-full text-xs font-semibold text-teal-500 border border-teal-500 uppercase bg-transparent">
  AMD
</span>
```

### 表格行颜色
```tsx
// 必须交替: 白 → 浅绿 → 浅红 → 循环
<tr className="bg-white">...</tr>
<tr className="bg-[#E8F5E9]/50">...</tr>
<tr className="bg-[#FFEBEE]/50">...</tr>
```

### 手风琴
```tsx
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="flex justify-between items-center p-4 cursor-pointer">
    <h3 className="text-[15px] font-semibold">标题</h3>
    <ChevronDown className={`text-gray-400 transition-transform duration-200 
      ${isOpen ? 'rotate-180' : ''}`} />
  </div>
  {isOpen && <div className="px-5 pb-5">内容</div>}
</div>
```

### 按钮
```tsx
// 主要
<button className="px-6 py-2.5 bg-teal-500 text-white rounded-lg text-sm font-medium hover:opacity-90">

// 次要
<button className="px-8 py-3 bg-gray-400 text-white rounded-lg text-sm font-medium">

// 图标
<button className="w-11 h-11 flex items-center justify-center rounded-lg bg-teal-500 text-white">
```

### 输入框
```tsx
<input className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm 
  text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none" />
```

### 进度条/时间轴
```tsx
<div className="relative h-1 bg-gray-100 rounded-full flex justify-between">
  <div className="absolute h-full bg-teal-500 rounded-full" style={{ width: '60%' }} />
  {steps.map((step, i) => (
    <div key={i} className="relative flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10
        ${i <= active ? 'bg-teal-500' : 'bg-gray-300'}`} />
      <span className="absolute top-5 text-[10px] text-gray-400 whitespace-nowrap uppercase">
        {step}
      </span>
    </div>
  ))}
</div>
```

### 来电弹窗
```tsx
<div className="fixed bottom-6 right-6 w-[280px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
  <div className="flex justify-between items-start p-4">
    <h4 className="text-sm font-semibold text-gray-800">Llamada entrante</h4>
    <button className="text-gray-300"><XIcon /></button>
  </div>
  <div className="text-center pb-2">
    <div className="bg-teal-500 text-white rounded-lg py-1 mx-4 text-sm font-bold">4:40</div>
  </div>
  <div className="flex gap-2 p-4 pt-2">
    <button className="flex-1 py-3 bg-red-500 text-white rounded-lg flex justify-center">
      <PhoneOffIcon />
    </button>
    <button className="flex-1 py-3 bg-teal-500 text-white rounded-lg flex justify-center">
      <PhoneIcon />
    </button>
  </div>
</div>
```

---

## 🚫 禁止清单 (Don'ts)

| ❌ 禁止 | ✅ 正确 |
|---------|---------|
| 使用非规范颜色 | 严格使用色值表 |
| 改变侧边栏宽度 | 固定 **260px** |
| 使用不同圆角 | 仅 6/8/12/20px |
| 添加额外阴影 | 仅卡片/弹窗阴影 |
| 改变字体 | 必须使用 **Inter** |
| 小于12px字体 | 最小12px正文 |
| 改变图标风格 | 线性2px描边 |
| 忽略表格行交替 | 白/绿/红循环 |
| 中文使用Light字重 | 最小font-normal(400) |
| 忽略中英文间隙 | 添加0.125em间隙 |

---

## 📋 页面结构模板

### Dashboard 结构
```
[侧边栏 260px]
  [主内容 p-8]
    面包屑 (13px #999)
    页面标题 (28px 700)
    统计标签行 (flex gap-3)
    统计卡片行 (grid 4列 gap-4)
    Sede卡片网格 (grid 4列 gap-4)
    分页指示器
```

### 患者详情结构
```
[侧边栏]
  [主内容]
    面包屑
    头部行 (返回 + 标题 + 状态标签)
    患者姓名 (32px) + 地址
    主网格 (grid 2fr 1fr gap-6)
      左侧: 手风琴列表
      右侧: 服务面板
    医疗休息区
    来电弹窗 (fixed bottom-6 right-6)
```

---

## 🔧 CSS变量

```css
:root {
  --primary: #5CB8A6;
  --primary-light: #E8F5F2;
  --background: #F8F9FA;
  --white: #FFFFFF;
  --border: #E8E8E8;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-muted: #999999;
  --success: #27AE60;
  --warning: #F39C12;
  --error: #E74C3C;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 20px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-modal: 0 8px 32px rgba(0,0,0,0.15);
  --sidebar-width: 260px;
}
```

---

## ✅ 检查清单

提交前确认：
- [ ] 颜色使用规范值
- [ ] 间距是4的倍数
- [ ] 字体使用Inter
- [ ] 圆角正确(6/8/12/20)
- [ ] 阴影仅用于卡片/弹窗
- [ ] 图标线性风格
- [ ] 悬停状态已定义
- [ ] 过渡动画0.2s
- [ ] 表格行交替颜色
- [ ] 中文行高1.6-1.8
- [ ] 元数据标签10px大写

---

## 🤖 AI提示词模板

```
请使用CuraDigital医疗管理系统设计规范：

【色彩】主色#5CB8A6，背景#F8F9FA，卡片#FFFFFF，边框#E8E8E8
【字体】Inter + Noto Sans SC，中英文混排+0.125em间隙
【尺寸】侧边栏260px，卡片圆角12px，按钮圆角8px
【组件】表格行交替白/#E8F5E9/#FFEBEE，图标线性2px描边
【交互】悬停过渡0.2s ease，手风琴箭头旋转180度
【禁止】不用其他颜色，不改侧边栏宽度，中文不用Light字重
```

---

*CuraDigital Design System v2.0 | Quick Reference Card*
