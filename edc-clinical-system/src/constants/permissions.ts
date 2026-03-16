/**
 * 权限常量定义
 * 基于PRD中的权限矩阵定义
 */

// 角色类型
export type UserRole =
  | 'admin'           // 研究机构管理员
  | 'pi'              // 项目管理员/PI
  | 'dataEntry'       // 数据录入员
  | 'auditor'         // 审核人员
  | 'inspector'       // 稽查人员
  | 'monitor'         // 监查员(SDV)

// 权限码定义
export enum Permission {
  // 首页
  DASHBOARD_VIEW = 'dashboard:view',

  // 项目管理
  PROJECT_VIEW = 'project:view',
  PROJECT_CREATE = 'project:create',
  PROJECT_EDIT = 'project:edit',
  PROJECT_AUDIT = 'project:audit',
  PROJECT_EXPORT = 'project:export',
  PROJECT_LOCK = 'project:lock',
  PROJECT_SIGN = 'project:sign',
  PROJECT_CONFIG = 'project:config',

  // 我的工作
  MY_WORK = 'mywork:view',
  MY_WORK_DATA = 'mywork:data',
  MY_WORK_QUERY = 'mywork:query',
  MY_WORK_AUDIT = 'mywork:audit',

  // 数据查询
  DATA_QUERY = 'dataquery:view',
  DATA_QUERY_SUBJECT = 'dataquery:subject',
  DATA_QUERY_QUERY = 'dataquery:query',
  DATA_QUERY_EXPORT = 'dataquery:export',

  // 受试者管理
  SUBJECT_VIEW = 'subject:view',
  SUBJECT_CREATE = 'subject:create',
  SUBJECT_EDIT = 'subject:edit',
  SUBJECT_RANDOMIZE = 'subject:randomize',

  // CRF管理
  CRF_VIEW = 'crf:view',
  CRF_DESIGN = 'crf:design',
  CRF_FILL = 'crf:fill',
  CRF_TEMPLATE = 'crf:template',

  // 访视配置
  VISIT_CONFIG = 'visit:config',

  // 质疑管理
  QUERY_VIEW = 'query:view',
  QUERY_CREATE = 'query:create',
  QUERY_REPLY = 'query:reply',
  QUERY_CLOSE = 'query:close',

  // 系统配置
  CONFIG_USER = 'config:user',
  CONFIG_ROLE = 'config:role',
  CONFIG_CENTER = 'config:center',
  CONFIG_DICTIONARY = 'config:dictionary',
  CONFIG_WORKFLOW = 'config:workflow',
  CONFIG_DATAVIEW = 'config:dataview',

  // 系统日志
  LOG_VIEW = 'log:view',
  LOG_EXPORT = 'log:export',
}

// 菜单权限映射
export const MENU_PERMISSIONS: Record<string, Permission[]> = {
  '/': [Permission.DASHBOARD_VIEW],
  '/projects': [Permission.PROJECT_VIEW],
  '/my-work': [Permission.MY_WORK],
  '/my-work/pending-data': [Permission.MY_WORK_DATA],
  '/my-work/pending-queries': [Permission.MY_WORK_QUERY],
  '/data-query': [Permission.DATA_QUERY],
  '/data-query/subjects': [Permission.DATA_QUERY_SUBJECT],
  '/data-query/queries': [Permission.DATA_QUERY_QUERY],
  '/subjects': [Permission.SUBJECT_VIEW],
  '/crf-designer': [Permission.CRF_VIEW],
  '/visit-config': [Permission.VISIT_CONFIG],
  '/queries': [Permission.QUERY_VIEW],
  '/export': [Permission.PROJECT_EXPORT],
  '/crf-templates': [Permission.CRF_TEMPLATE],
  '/dictionary': [Permission.CONFIG_DICTIONARY],
  '/config': [
    Permission.CONFIG_USER,
    Permission.CONFIG_ROLE,
    Permission.CONFIG_CENTER,
    Permission.CONFIG_DICTIONARY,
    Permission.CONFIG_WORKFLOW,
    Permission.CONFIG_DATAVIEW,
  ],
  '/logs': [Permission.LOG_VIEW],
}

// 角色权限矩阵
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // 研究机构管理员 - 拥有所有权限
  admin: [
    Permission.DASHBOARD_VIEW,
    Permission.PROJECT_VIEW,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_AUDIT,
    Permission.PROJECT_EXPORT,
    Permission.PROJECT_LOCK,
    Permission.PROJECT_SIGN,
    Permission.PROJECT_CONFIG,
    Permission.MY_WORK,
    Permission.MY_WORK_DATA,
    Permission.MY_WORK_QUERY,
    Permission.MY_WORK_AUDIT,
    Permission.DATA_QUERY,
    Permission.DATA_QUERY_SUBJECT,
    Permission.DATA_QUERY_QUERY,
    Permission.DATA_QUERY_EXPORT,
    Permission.SUBJECT_VIEW,
    Permission.SUBJECT_CREATE,
    Permission.SUBJECT_EDIT,
    Permission.SUBJECT_RANDOMIZE,
    Permission.CRF_VIEW,
    Permission.CRF_DESIGN,
    Permission.CRF_FILL,
    Permission.CRF_TEMPLATE,
    Permission.VISIT_CONFIG,
    Permission.QUERY_VIEW,
    Permission.QUERY_CREATE,
    Permission.QUERY_REPLY,
    Permission.QUERY_CLOSE,
    Permission.CONFIG_USER,
    Permission.CONFIG_ROLE,
    Permission.CONFIG_CENTER,
    Permission.CONFIG_DICTIONARY,
    Permission.CONFIG_WORKFLOW,
    Permission.CONFIG_DATAVIEW,
    Permission.LOG_VIEW,
    Permission.LOG_EXPORT,
  ],

  // 项目管理员/PI
  pi: [
    Permission.DASHBOARD_VIEW,
    Permission.PROJECT_VIEW,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_AUDIT,
    Permission.PROJECT_EXPORT,
    Permission.PROJECT_LOCK,
    Permission.PROJECT_SIGN,
    Permission.PROJECT_CONFIG,
    Permission.MY_WORK,
    Permission.MY_WORK_DATA,
    Permission.MY_WORK_QUERY,
    Permission.MY_WORK_AUDIT,
    Permission.DATA_QUERY,
    Permission.DATA_QUERY_SUBJECT,
    Permission.DATA_QUERY_QUERY,
    Permission.DATA_QUERY_EXPORT,
    Permission.SUBJECT_VIEW,
    Permission.SUBJECT_CREATE,
    Permission.SUBJECT_EDIT,
    Permission.SUBJECT_RANDOMIZE,
    Permission.CRF_VIEW,
    Permission.CRF_DESIGN,
    Permission.CRF_FILL,
    Permission.CRF_TEMPLATE,
    Permission.VISIT_CONFIG,
    Permission.QUERY_VIEW,
    Permission.QUERY_CREATE,
    Permission.QUERY_REPLY,
    Permission.QUERY_CLOSE,
    Permission.CONFIG_USER,
    Permission.CONFIG_ROLE,
    Permission.CONFIG_CENTER,
    Permission.CONFIG_DICTIONARY,
    Permission.LOG_VIEW,
  ],

  // 数据录入员
  dataEntry: [
    Permission.DASHBOARD_VIEW,
    Permission.PROJECT_VIEW,
    Permission.MY_WORK,
    Permission.MY_WORK_DATA,
    Permission.MY_WORK_QUERY,
    Permission.DATA_QUERY,
    Permission.DATA_QUERY_SUBJECT,
    Permission.SUBJECT_VIEW,
    Permission.CRF_VIEW,
    Permission.CRF_FILL,
    Permission.QUERY_VIEW,
    Permission.QUERY_REPLY,
  ],

  // 审核人员
  auditor: [
    Permission.DASHBOARD_VIEW,
    Permission.PROJECT_VIEW,
    Permission.MY_WORK,
    Permission.MY_WORK_QUERY,
    Permission.MY_WORK_AUDIT,
    Permission.DATA_QUERY,
    Permission.DATA_QUERY_SUBJECT,
    Permission.DATA_QUERY_QUERY,
    Permission.PROJECT_AUDIT,
    Permission.PROJECT_EXPORT,
    Permission.CRF_VIEW,
    Permission.QUERY_VIEW,
    Permission.QUERY_CREATE,
    Permission.QUERY_REPLY,
    Permission.QUERY_CLOSE,
    Permission.LOG_VIEW,
  ],

  // 稽查人员
  inspector: [
    Permission.DASHBOARD_VIEW,
    Permission.PROJECT_VIEW,
    Permission.MY_WORK,
    Permission.DATA_QUERY,
    Permission.DATA_QUERY_SUBJECT,
    Permission.DATA_QUERY_QUERY,
    Permission.PROJECT_EXPORT,
    Permission.SUBJECT_VIEW,
    Permission.CRF_VIEW,
    Permission.QUERY_VIEW,
    Permission.LOG_VIEW,
    Permission.LOG_EXPORT,
  ],

  // 监查员(SDV)
  monitor: [
    Permission.DASHBOARD_VIEW,
    Permission.PROJECT_VIEW,
    Permission.MY_WORK,
    Permission.MY_WORK_DATA,
    Permission.DATA_QUERY,
    Permission.DATA_QUERY_SUBJECT,
    Permission.SUBJECT_VIEW,
    Permission.CRF_VIEW,
    Permission.QUERY_VIEW,
    Permission.QUERY_CREATE,
    Permission.QUERY_REPLY,
    Permission.LOG_VIEW,
  ],
}

// 检查用户是否有指定权限
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false
}

// 检查用户是否有任意一个指定权限
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(userRole, p))
}

// 检查用户是否有所有指定权限
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(userRole, p))
}

// 检查用户是否可以访问指定路由
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const requiredPermissions = MENU_PERMISSIONS[route]
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }
  return hasAnyPermission(userRole, requiredPermissions)
}

// 获取用户可以访问的路由列表
export function getAccessibleRoutes(userRole: UserRole): string[] {
  return Object.keys(MENU_PERMISSIONS).filter((route) =>
    canAccessRoute(userRole, route)
  )
}
