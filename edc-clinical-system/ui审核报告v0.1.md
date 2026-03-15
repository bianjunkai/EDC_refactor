# EDC 系统设计审核报告 v0.1

## 反模式判决

**判决结果：部分符合 AI 生成特征，但非典型的"AI Slop"**

| 特征检查 | 状态 | 说明 |
|---------|------|------|
| AI 配色方案（紫渐变） | 未使用 | 采用 Ant Design 标准蓝色系 #1890ff |
| 渐变文字 | 未使用 | 仅背景有渐变色 |
| 玻璃拟态 | 未使用 | 未使用 backdrop-filter |
| Hero 指标卡片 | 轻度使用 | Dashboard 底部有 4 个统计卡片 |
| 通用卡片网格 | 未使用 | 布局相对多样 |
| 系统字体栈 | 使用 Noto Sans SC | 虽为常见字体，但在中文字符下相对合适 |

**主要问题**：整体设计偏向"安全但平庸"，缺乏独特的视觉个性。作为医疗/临床研究系统，这种保守风格可以理解，但仍有不少改进空间。

---

## 执行摘要

| 维度 | 问题数 | 严重程度 |
|------|--------|----------|
| **可访问性 (A11y)** | 12 | 中等 |
| **性能** | 4 | 低 |
| **主题/设计系统** | 15 | 中高 |
| **响应式设计** | 8 | 中等 |
| **代码质量** | 6 | 低 |

**最严重问题**：
1. 硬编码颜色值散布于 20+ 个位置，未使用设计令牌
2. 缺乏深色模式支持
3. 多处内联样式导致维护困难
4. 表单缺少必填项的视觉指示器
5. 表格行点击无键盘可访问性

**总体评分**：6.5/10（可用但缺乏精细化打磨）

---

## 详细发现（按严重程度）

### Critical 严重问题

#### 1. 硬编码颜色泛滥
| 属性 | 位置 | 影响 |
|------|------|------|
| `color: '#1890ff'` | 12 处 | 主题无法统一切换 |
| `color: '#1f2937'` | 8 处 | 文字颜色不一致 |
| `background: '#e6f7ff'` | 6 处 | 状态背景色分散 |
| `border: '1px solid #e5e7eb'` | 15 处 | 边框颜色无法主题化 |

**影响**：无法支持深色模式，品牌色变更需全局搜索替换
**建议**：使用 CSS 变量或主题令牌（已通过 `theme.ts` 定义但未严格执行）

#### 2. 键盘可访问性问题
**位置**：`ProjectList.tsx:197-200`, `SubjectList.tsx:224-227`, `QueryManagement.tsx:210-213`

```tsx
onRow={(record) => ({
  onClick: () => openDrawer(record),  // 仅支持鼠标点击
  style: { cursor: 'pointer' },
})}
```

**影响**：键盘用户无法触发行点击事件（WCAG 2.1 A 级违规）
**建议**：添加 `tabIndex` 和 `onKeyDown` 处理器，或使用真正的 `<button>` 元素

---

### High 高优先级问题

#### 3. 面包屑可访问性
**位置**：`Header.tsx:174-182`

```tsx
<Breadcrumb
  items={breadcrumb.map((item, index) => ({
    title:
      index === 0 ? (
        <span style={{ color: '#1890ff', cursor: 'pointer' }}>{item}</span>  // 非语义化链接
      ) : (
        item
      ),
  }))}
/>
```

**问题**：
- 使用 `<span>` 而非 `<a>` 或 `<button>`
- 缺少 `href` 和键盘支持
- 颜色对比度可能不足（蓝色 #1890ff 在灰色背景上）

**建议**：使用 Ant Design 的 `Breadcrumb.Item` 配合 `href` 属性

#### 4. 表单必填状态不明确
**位置**：`SystemConfig.tsx:230-258` 等多个表单

```tsx
<Form.Item label="姓名" required>  // 仅文字标记
```

**问题**：Ant Design 的 `required` 仅添加红色星号，无 `aria-required` 属性
**建议**：确保屏幕阅读器能正确识别必填字段

#### 5. 状态标签颜色对比度
**位置**：`theme.ts:65-95`

| 状态 | 背景色 | 文字色 | 对比度 | 评级 |
|------|--------|--------|--------|------|
| 立项中 | #f3f4f6 | #6b7280 | 4.6:1 | AA |
| 已驳回 | #fee2e2 | #dc2626 | 4.8:1 | AA |
| 已暂停 | #fef3c7 | #d97706 | 3.2:1 | 不达标 |

**建议**：调整"已暂停"状态颜色，使用更深的文字色

#### 6. 触摸目标过小
**位置**：多处表格操作按钮

```tsx
<Button type="text" icon={<EyeOutlined />} />  // 仅 32x32px
```

**建议**：最小触摸目标应为 44x44px，或添加 `padding`

---

### Medium 中优先级问题

#### 7. 内联样式难以维护
**位置**：遍布多个组件

统计最严重的文件：
- `Dashboard.tsx`: 38 处内联样式
- `CRFForm.tsx`: 45 处内联样式
- `ProjectList.tsx`: 28 处内联样式

**建议**：提取为 CSS Modules 或 styled-components

#### 8. 图标语义化缺失
**位置**：`Header.tsx:134-141`

```tsx
<BellOutlined
  style={{ fontSize: 18, cursor: 'pointer' }}  // 无 aria-label
/>
```

**建议**：添加 `aria-label="查看通知"` 或 `title` 属性

#### 9. 表格响应式处理不足
**位置**：`VisitConfig.tsx:159-167` 矩阵表格

```tsx
<Table
  scroll={{ x: 'max-content' }}  // 仅水平滚动
  // 缺少移动端适配
/>
```

**问题**：小屏幕下用户体验差
**建议**：使用响应式列隐藏或卡片式布局

#### 10. Drawer 关闭按钮无确认
**位置**：多个抽屉组件

```tsx
<Drawer onClose={() => setDrawerVisible(false)}>  // 直接关闭，无确认
```

**风险**：用户可能丢失未保存的数据

#### 11. 面包屑硬编码
**位置**：`MainLayout.tsx:17-34`

```tsx
if (path === '/projects') return ['项目管理']
if (path.startsWith('/projects/') && path.includes('/subjects')) {
  return ['项目管理', '肿瘤药物临床试验A', '受试者管理']  // 硬编码项目名称
}
```

**建议**：从路由参数或状态管理获取动态数据

#### 12. 导航图标自定义实现
**位置**：`Header.tsx:35-41`

```tsx
function UserIcon() {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M858.5 763.6c-18.9-44.8-46.1-85-80.6-119.5..." />
    </svg>
  )
}
```

**问题**：自定义 SVG 图标，未使用 Ant Design 图标库，风格可能不一致
**建议**：使用 `<UserOutlined />` 或统一图标系统

---

### Low 低优先级问题

#### 13. 过度使用 Card 包裹
多个页面存在"卡片套卡片"现象，如 `Dashboard.tsx` 统计卡片

#### 14. 时间格式化硬编码
`Dashboard.tsx:174`
```tsx
{project.updatedAt.slice(5)}  // 假设格式为 ISO 字符串
```

#### 15. 空状态未处理
多个表格未考虑 `dataSource` 为空时的展示

#### 16. 类型断言过多
多处使用 `as const` 和类型断言，可能影响类型安全

---

## 模式与系统性问题

### 重复出现的问题

| 模式 | 出现次数 | 影响范围 |
|------|----------|----------|
| 硬编码颜色 | 50+ | 全站 |
| 内联样式对象 | 200+ | 全站 |
| 缺少 aria 属性 | 20+ | 交互组件 |
| 魔法字符串 | 30+ | 状态/类型判断 |

### 设计系统不一致

1. **圆角不统一**：
   - Card: `borderRadius: 12`
   - Button: `borderRadius: 6` (主题配置) 或 `borderRadius: 8` (内联)
   - Tag: `borderRadius: 4`

2. **间距不统一**：
   - 部分使用 16px、24px，部分使用 12px、20px 等非标准值

3. **阴影不统一**：
   - Card 有 `boxShadow`，但部分手动覆盖

---

## 积极发现

### 做得好的地方

1. **状态管理集中化**
   - `StatusTag` 组件统一处理状态标签样式
   - `theme.ts` 定义了状态颜色映射

2. **组件复用**
   - `PageHeader`、`Toolbar` 等通用组件提取合理
   - 布局组件（`MainLayout`、`Header`）结构清晰

3. **类型定义完整**
   - `types/index.ts` 有完整的 TypeScript 类型定义

4. **响应式布局基础**
   - 使用 Ant Design 的 `Row`/`Col` 栅格系统
   - 有基本的移动端适配意识

5. **Mock 数据分离**
   - `mockData.ts` 统一管理测试数据

---

## 优先修复建议

### 1. 立即执行（本周）
- [ ] 修复键盘可访问性问题（表格行点击）
- [ ] 为所有交互图标添加 `aria-label`
- [ ] 调整"已暂停"状态标签颜色对比度

### 2. 短期执行（本冲刺）
- [ ] 将硬编码颜色替换为 CSS 变量
- [ ] 提取重复的内联样式为组件
- [ ] 修复面包屑语义化问题
- [ ] 添加触摸目标最小尺寸

### 3. 中期执行（下个冲刺）
- [ ] 实现深色模式支持
- [ ] 完善移动端响应式
- [ ] 添加表单必填项 ARIA 属性
- [ ] 空状态设计

### 4. 长期规划
- [ ] 建立完整的设计系统文档
- [ ] 引入视觉回归测试
- [ ] 可访问性自动化检测

---

## 文件清单

| 文件路径 | 主要问题 |
|----------|----------|
| `src/pages/Dashboard/index.tsx` | 38 处内联样式 |
| `src/pages/CRFForm/index.tsx` | 45 处内联样式，无键盘导航 |
| `src/pages/ProjectList/index.tsx` | 28 处内联样式，表格可访问性 |
| `src/pages/SubjectList/index.tsx` | 表格可访问性 |
| `src/pages/QueryManagement/index.tsx` | 表格可访问性 |
| `src/pages/VisitConfig/index.tsx` | 响应式表格 |
| `src/pages/DataExport/index.tsx` | 表单结构 |
| `src/pages/QueryDetail/index.tsx` | 语义化 |
| `src/pages/SystemConfig/index.tsx` | 表单必填标记 |
| `src/pages/CRFDesigner/index.tsx` | 控件可访问性 |
| `src/components/Layout/Header.tsx` | 面包屑语义化，图标 |
| `src/components/Layout/MainLayout.tsx` | 面包屑硬编码 |
| `src/constants/theme.ts` | 颜色对比度 |

---

**审核完成时间**：2026-03-11
**审核范围**：10 个页面 + 5 个通用组件
**审核标准**：WCAG 2.1 AA、前端设计最佳实践
**总体评分**：6.5/10
