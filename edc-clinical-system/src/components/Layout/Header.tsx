import { Layout, Badge, Avatar, Dropdown, Space, Menu, Breadcrumb } from 'antd'
import {
  BellOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  ExportOutlined,
  FileSearchOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { usePermission } from '@/contexts/PermissionContext'
import { Permission } from '@/constants/permissions'
import { RoleSwitcher } from '@/components/Common/RoleSwitcher'

const { Header: AntHeader } = Layout

interface HeaderProps {
  mode?: 'dashboard' | 'simple'
  breadcrumb?: { label: string; path?: string }[]
  userName?: string
  notificationCount?: number
}

export default function Header({
  mode = 'simple',
  breadcrumb,
  userName = '张医生',
  notificationCount = 3,
}: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { checkPermission } = usePermission()

  // 根据权限动态生成导航项
  const navItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页', permission: Permission.DASHBOARD_VIEW },
    { key: '/projects', icon: <ProjectOutlined />, label: '项目管理', permission: Permission.PROJECT_VIEW },
    { key: '/subjects', icon: <UserOutlined />, label: '受试者管理', permission: Permission.SUBJECT_VIEW },
    { key: '/crf-designer', icon: <FileTextOutlined />, label: 'CRF管理', permission: Permission.CRF_VIEW },
    { key: '/visit-config', icon: <CalendarOutlined />, label: '访视配置', permission: Permission.VISIT_CONFIG },
    { key: '/queries', icon: <QuestionCircleOutlined />, label: '质疑管理', permission: Permission.QUERY_VIEW },
    { key: '/export', icon: <ExportOutlined />, label: '数据导出', permission: Permission.PROJECT_EXPORT },
    { key: '/logs', icon: <FileSearchOutlined />, label: '系统日志', permission: Permission.LOG_VIEW },
  ].filter(item => checkPermission(item.permission))

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleNavClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  // Header 高度固定为 64px
  const headerHeight = 64

  // 判断是否为开发环境
  const isDev = import.meta.env.DEV

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        height: headerHeight,
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left - Logo + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }} role="img" aria-label="医院">🏥</span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--color-primary-500)',
            marginRight: 8,
          }}
        >
          EDC系统
        </span>

        {/* Breadcrumb (Simple mode only, after logo) */}
        {mode === 'simple' && breadcrumb && breadcrumb.length > 0 && (
          <>
            <span style={{ color: '#d1d5db' }}>|</span>
            <Breadcrumb
              separator=">"
              items={breadcrumb.map((item) => ({
                title: item.path ? (
                  <Link to={item.path} style={{ color: 'var(--color-primary-500)', fontSize: 14 }}>
                    {item.label}
                  </Link>
                ) : (
                  <span key={item.label} style={{ fontSize: 14, color: 'var(--color-text-body)' }}>
                    {item.label}
                  </span>
                ),
              }))}
            />
          </>
        )}
      </div>

      {/* Center - Main Navigation (Dashboard mode only) */}
      {mode === 'dashboard' && (
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={handleNavClick}
          style={{
            flex: 1,
            justifyContent: 'center',
            borderBottom: 'none',
            background: 'transparent',
            maxWidth: 600,
          }}
        />
      )}

      {/* Right - User Actions */}
      <Space size={24}>
        {/* 开发环境显示角色切换器 */}
        {isDev && (
          <div style={{ marginRight: 16 }}>
            <RoleSwitcher />
          </div>
        )}

        <Badge count={notificationCount} size="small" aria-label={`${notificationCount} 条未读通知`}>
          <BellOutlined
            style={{
              fontSize: 18,
              color: 'var(--color-text-body)',
              cursor: 'pointer',
              padding: 8,
            }}
            aria-label="查看通知"
            role="button"
            tabIndex={0}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              style={{
                backgroundColor: 'var(--color-primary-500)',
                color: '#fff',
              }}
              size="default"
              aria-label={`用户: ${userName}`}
            >
              {userName.charAt(0)}
            </Avatar>
            <span style={{ color: 'var(--color-text-body)', fontSize: 14 }}>{userName}</span>
            <DownOutlined style={{ fontSize: 12, color: 'var(--color-text-placeholder)' }} />
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}
