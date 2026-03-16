import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'
import MainLayout from './components/Layout/MainLayout'
import Dashboard from './pages/Dashboard'

// 懒加载页面组件
const ProjectList = lazy(() => import('./pages/ProjectList'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const SubjectList = lazy(() => import('./pages/SubjectList'))
const SubjectDetail = lazy(() => import('./pages/SubjectDetail'))
const CRFDesigner = lazy(() => import('./pages/CRFDesigner'))
const CRFForm = lazy(() => import('./pages/CRFForm'))
const VisitCRFMatrix = lazy(() => import('./pages/VisitCRFMatrix'))
const QueryManagement = lazy(() => import('./pages/QueryManagement'))
const QueryDetail = lazy(() => import('./pages/QueryDetail'))
const DataExport = lazy(() => import('./pages/DataExport'))
const SystemConfig = lazy(() => import('./pages/SystemConfig'))
const SystemLogs = lazy(() => import('./pages/SystemLogs'))
const VisitConfig = lazy(() => import('./pages/VisitConfig'))
const DictionaryManager = lazy(() => import('./pages/DictionaryManager'))
const ProjectAudit = lazy(() => import('./pages/ProjectAudit'))
const ProjectWizard = lazy(() => import('./pages/ProjectWizard'))
const CRFTemplates = lazy(() => import('./pages/CRFTemplates'))
const MyWork = lazy(() => import('./pages/MyWork'))
const DataQuery = lazy(() => import('./pages/DataQuery'))

/**
 * 页面加载占位符
 * 在组件懒加载时显示
 */
function PageLoading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Spin size="large" tip="页面加载中..." />
    </div>
  )
}

/**
 * 懒加载包装器
 * 为子路由添加 Suspense
 */
function LazyOutlet() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Outlet />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        // 所有懒加载路由共享同一个 Suspense
        element: <LazyOutlet />,
        children: [
          {
            path: 'projects',
            element: <ProjectList />,
          },
          {
            path: 'projects/new',
            element: <ProjectWizard />,
          },
          {
            path: 'projects/audit',
            element: <ProjectAudit />,
          },
          {
            path: 'projects/:id',
            element: <ProjectDetail />,
          },
          {
            path: 'projects/:id/subjects',
            element: <SubjectList />,
          },
          {
            path: 'projects/:projectId/subjects/:subjectId',
            element: <SubjectDetail />,
          },
          {
            path: 'subjects',
            element: <SubjectList />,
          },
          {
            path: 'crf-designer',
            element: <CRFDesigner />,
          },
          {
            path: 'crf-templates',
            element: <CRFTemplates />,
          },
          {
            path: 'projects/:id/visit-crf-matrix',
            element: <VisitCRFMatrix />,
          },
          {
            path: 'projects/:id/subjects/:subjectId/crf/:crfId',
            element: <CRFForm />,
          },
          {
            path: 'queries',
            element: <QueryManagement />,
          },
          {
            path: 'queries/:id',
            element: <QueryDetail />,
          },
          {
            path: 'export',
            element: <DataExport />,
          },
          {
            path: 'config',
            element: <SystemConfig />,
          },
          {
            path: 'logs',
            element: <SystemLogs />,
          },
          {
            path: 'visit-config',
            element: <VisitConfig />,
          },
          {
            path: 'dictionary',
            element: <DictionaryManager />,
          },
          // 我的工作
          {
            path: 'my-work',
            element: <MyWork />,
          },
          {
            path: 'my-work/pending-data',
            element: <MyWork defaultTab="pending-data" />,
          },
          {
            path: 'my-work/pending-queries',
            element: <MyWork defaultTab="pending-queries" />,
          },
          // 数据查询
          {
            path: 'data-query',
            element: <DataQuery />,
          },
          {
            path: 'data-query/subjects',
            element: <DataQuery defaultTab="subjects" />,
          },
          {
            path: 'data-query/queries',
            element: <DataQuery defaultTab="queries" />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

export default router
