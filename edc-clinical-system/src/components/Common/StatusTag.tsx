import { Tag } from 'antd'
import { getStatusColor } from '@/constants/theme'

interface StatusTagProps {
  status: string
  size?: 'small' | 'default'
  /** 可访问性：状态描述，用于屏幕阅读器 */
  ariaLabel?: string
}

/**
 * 状态标签组件
 * 使用设计系统颜色，支持可访问性
 */
export default function StatusTag({
  status,
  size = 'default',
  ariaLabel,
}: StatusTagProps) {
  const color = getStatusColor(status)

  return (
    <Tag
      aria-label={ariaLabel || `状态: ${status}`}
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderColor: color.border || color.bg,
        fontWeight: 500,
        fontSize: size === 'small' ? 12 : 13,
        padding: size === 'small' ? '0 6px' : '2px 10px',
        margin: 0,
        borderRadius: 20,  // Pill 样式
      }}
    >
      {status}
    </Tag>
  )
}
