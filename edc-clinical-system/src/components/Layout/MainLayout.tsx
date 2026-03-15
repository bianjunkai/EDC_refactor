import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'

const { Content } = Layout

export default function MainLayout() {
  const location = useLocation()

  // Determine page type based on route
  const getPageType = () => {
    const path = location.pathname
    if (path === '/') return 'dashboard'
    return 'simple'
  }

  // Generate breadcrumb based on route
  const getBreadcrumb = (): { label: string; path?: string }[] | undefined => {
    const path = location.pathname

    if (path === '/') return undefined // Dashboard has no breadcrumb
    if (path === '/projects') return [{ label: '项目管理', path: '/projects' }]
    if (path === '/projects/new') return [{ label: '项目管理', path: '/projects' }, { label: '新建项目' }]
    if (path.startsWith('/projects/') && !path.includes('/subjects')) {
      return [
        { label: '项目管理', path: '/projects' },
        { label: '项目详情' },
      ]
    }
    if (path.startsWith('/projects/') && path.includes('/subjects')) {
      return [
        { label: '项目管理', path: '/projects' },
        { label: '项目详情', path: path.replace('/subjects', '') },
        { label: '受试者管理' },
      ]
    }
    if (path === '/subjects') return [{ label: '受试者管理', path: '/subjects' }]
    if (path === '/crf-designer') return [{ label: 'CRF管理', path: '/crf-designer' }]
    if (path === '/visit-config') return [{ label: '访视配置', path: '/visit-config' }]
    if (path.startsWith('/projects/') && path.includes('/visit-crf-matrix')) {
      return [
        { label: '项目管理', path: '/projects' },
        { label: '项目详情', path: path.replace('/visit-crf-matrix', '') },
        { label: '访视CRF配置' },
      ]
    }
    if (path === '/queries') return [{ label: '质疑管理', path: '/queries' }]
    if (path === '/dictionary') return [{ label: '系统配置', path: '/config' }, { label: '标准字典库' }]
    if (path === '/projects/audit') return [{ label: '项目管理', path: '/projects' }, { label: '项目审核' }]
    if (path === '/crf-templates') return [{ label: 'CRF管理', path: '/crf-designer' }, { label: '模板市场' }]
    if (path.startsWith('/queries/')) {
      return [
        { label: '质疑管理', path: '/queries' },
        { label: '质疑详情' },
      ]
    }
    if (path === '/export') return [{ label: '数据导出', path: '/export' }]
    if (path === '/config') return [{ label: '系统配置', path: '/config' }]
    if (path.startsWith('/config/')) {
      const configSubPath = path.replace('/config/', '')
      const subLabels: Record<string, string> = {
        roles: '角色权限',
        centers: '中心管理',
        views: '数据视图',
        workflow: '审核流程',
      }
      return [{ label: '系统配置', path: '/config' }, { label: subLabels[configSubPath] || '配置' }]
    }
    if (path === '/logs') return [{ label: '系统日志', path: '/logs' }]
    return []
  }

  const pageType = getPageType()
  const breadcrumb = getBreadcrumb()

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <Header mode={pageType} breadcrumb={breadcrumb} />
      <Content
        style={{
          padding: 'var(--space-xl)',
          maxWidth: 1400,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  )
}
