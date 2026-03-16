import { Layout, Badge, Avatar, Dropdown, Space, Menu, Breadcrumb } from 'antd'
import {
  BellOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  ProjectOutlined,
  FileSearchOutlined,
  UnorderedListOutlined,
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

  // 根据权限动态生成导航项 - 简化后的结构
  const getNavItems = () => {
    const items: any[] = []

    // 首页
    if (checkPermission(Permission.DASHBOARD_VIEW)) {
      items.push({ key: '/', icon: <HomeOutlined />, label: '首页' })
    }

    // 项目 - 含子菜单
    if (checkPermission(Permission.PROJECT_VIEW)) {
      items.push({
        key: 'project-menu',
        icon: <ProjectOutlined />,
        label: '项目',
        children: [
          { key: '/projects', label: '项目列表' },
          { key: '/projects/audit', label: '项目审核' },
        ],
      })
    }

    // 我的工作 - 含子菜单 (待录入、待处理质疑、待审核)
    if (checkPermission(Permission.MY_WORK)) {
      items.push({
        key: 'mywork-menu',
        icon: <UnorderedListOutlined />,
        label: '我的工作',
        children: [
          { key: '/my-work', label: '工作台' },
          { key: '/my-work/pending-data', label: '待录入数据' },
          { key: '/my-work/pending-queries', label: '待处理质疑' },
        ],
      })
    }

    // 数据查询 - 含子菜单
    if (checkPermission(Permission.DATA_QUERY)) {
      items.push({
        key: 'dataquery-menu',
        icon: <FileSearchOutlined />,
        label: '数据查询',
        children: [
          { key: '/data-query', label: '数据查询' },
          { key: '/data-query/subjects', label: '受试者查询' },
          { key: '/data-query/queries', label: '质疑查询' },
          { key: '/export', label: '数据导出' },
        ],
      })
    }

    // 系统配置 - 含子菜单
    if (checkPermission(Permission.CONFIG_USER)) {
      items.push({
        key: '/config',
        icon: <SettingOutlined />,
        label: '系统配置',
      })
    }

    return items
  }

  const navItems = getNavItems()

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
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
        </Link>

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
