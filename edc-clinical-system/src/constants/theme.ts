// 主色（CuraDigital 青绿色系）
export const colors = {
  primary: {
    50: '#E8F5F2',
    100: '#C5E8E0',
    200: '#9DD9CC',
    300: '#75CAB8',
    400: '#5CB8A6',
    500: '#4DA392',
    600: '#3E8E7E',
  },
  // 功能色
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#2196F3',
  // 中性色
  text: {
    title: '#1f2937',
    body: '#374151',
    secondary: '#6b7280',
    placeholder: '#9ca3af',
  },
  border: '#e5e7eb',
  background: '#f3f4f6',
}

// Ant Design 主题配置（CuraDigital 设计规范）
export const antdTheme = {
  token: {
    colorPrimary: '#5CB8A6',
    colorSuccess: '#27AE60',
    colorWarning: '#F39C12',
    colorError: '#E74C3C',
    colorInfo: '#2196F3',
    borderRadius: 8,
    fontFamily: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f7fa',
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 36,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#fafafa',
    },
    Menu: {
      itemSelectedBg: '#E8F5F2',
      itemSelectedColor: '#5CB8A6',
    },
    Tag: {
      borderRadius: 20,  // Pill 样式
    },
  },
}

// 状态标签配色（CuraDigital 设计规范）
export const statusColors: Record<string, { bg: string; text: string; border?: string }> = {
  // 项目状态
  '立项中': { bg: '#f3f4f6', text: '#6b7280' },
  '审批中': { bg: '#E3F2FD', text: '#2196F3' },
  '已驳回': { bg: '#FFEBEE', text: '#E74C3C' },
  '进行中': { bg: '#F3E5F5', text: '#9C27B0' },
  '已暂停': { bg: '#FFF3E0', text: '#F39C12' },
  '已完成': { bg: '#E8F5E9', text: '#27AE60' },
  '已锁库': { bg: '#F3E5F5', text: '#9C27B0' },
  '已作废': { bg: '#f3f4f6', text: '#9ca3af' },

  // 受试者状态
  '筛选中': { bg: '#E3F2FD', text: '#2196F3' },
  '已入组': { bg: '#E8F5E9', text: '#27AE60' },
  '完成': { bg: '#E8F5E9', text: '#27AE60' },
  '脱落': { bg: '#FFEBEE', text: '#E74C3C' },
  '筛选失败': { bg: '#f3f4f6', text: '#6b7280' },
  '退出': { bg: '#FFF3E0', text: '#F39C12' },
  '失访': { bg: '#FFEBEE', text: '#E74C3C' },

  // 质疑状态
  '待处理': { bg: '#FFEBEE', text: '#E74C3C' },
  '处理中': { bg: '#FFF3E0', text: '#F39C12' },
  '待确认': { bg: '#E3F2FD', text: '#2196F3' },
  '已解决': { bg: '#E8F5E9', text: '#27AE60' },
  '已撤销': { bg: '#f3f4f6', text: '#9ca3af' },

  // 通用状态
  '已启用': { bg: '#E8F5E9', text: '#27AE60' },
  '已禁用': { bg: '#f3f4f6', text: '#9ca3af' },
}

// 状态标签配色（简化版）
export const getStatusColor = (status: string) => {
  return statusColors[status] || { bg: '#f3f4f6', text: '#6b7280' }
}

/**
 * 表格行交替颜色（三色循环）
 * 使用方式: <Table rowClassName={getTableRowClassName} ... />
 */
export const getTableRowClassName = (_record: unknown, index: number) => {
  const pattern = index % 3
  if (pattern === 1) return 'table-row-alt-1'
  if (pattern === 2) return 'table-row-alt-2'
  return ''
}
