import { Select, Tag, Space, Tooltip } from 'antd'
import { UserSwitchOutlined } from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'
import { type UserRole } from '@/constants/permissions'

const { Option } = Select

/**
 * 角色显示配置
 */
const ROLE_CONFIG: Record<UserRole, { label: string; color: string; description: string }> = {
  admin: {
    label: '研究机构管理员',
    color: 'red',
    description: '拥有系统所有权限',
  },
  pi: {
    label: '项目管理员/PI',
    color: 'blue',
    description: '项目管理、审核、配置权限',
  },
  dataEntry: {
    label: '数据录入员',
    color: 'green',
    description: '数据录入、质疑回复权限',
  },
  auditor: {
    label: '审核人员',
    color: 'orange',
    description: '审核、质疑、导出权限',
  },
  inspector: {
    label: '稽查人员',
    color: 'purple',
    description: '查看、导出、日志权限',
  },
  monitor: {
    label: '监查员(SDV)',
    color: 'cyan',
    description: '查看、质疑、日志权限',
  },
}

/**
 * 角色切换器组件
 * 用于开发测试时快速切换不同角色
 *
 * @example
 * ```tsx
 * <RoleSwitcher />
 * ```
 */
export function RoleSwitcher() {
  const { userRole, switchRole } = usePermission()
  const config = ROLE_CONFIG[userRole]

  return (
    <Space>
      <Tooltip title={config.description}>
        <Tag color={config.color} icon={<UserSwitchOutlined />}>
          {config.label}
        </Tag>
      </Tooltip>
      <Select
        size="small"
        style={{ width: 160 }}
        value={userRole}
        onChange={(value: UserRole) => switchRole(value)}
        placeholder="切换角色"
      >
        {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => (
          <Option key={role} value={role}>
            {ROLE_CONFIG[role].label}
          </Option>
        ))}
      </Select>
    </Space>
  )
}

/**
 * 角色显示组件
 * 仅显示当前角色，无切换功能
 *
 * @example
 * ```tsx
 * <RoleDisplay />
 * ```
 */
export function RoleDisplay() {
  const { userRole } = usePermission()
  const config = ROLE_CONFIG[userRole]

  return (
    <Tooltip title={config.description}>
      <Tag color={config.color}>{config.label}</Tag>
    </Tooltip>
  )
}

export default RoleSwitcher
