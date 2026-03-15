/**
 * 权限页面工具 Hook
 *
 * 为页面提供便捷的权限检查方法
 *
 * @example
 * ```tsx
 * const ProjectListPage = () => {
 *   const { canCreate, canEdit, canExport } = usePermissionPage('project')
 *
 *   return (
 *     <div>
 *       {canCreate && <Button>新建项目</Button>}
 *       {canExport && <Button>导出</Button>}
 *     </div>
 *   )
 * }
 * ```
 */

import { usePermission } from '@/contexts/PermissionContext'
import { Permission } from '@/constants/permissions'

/**
 * 页面权限配置
 */
interface PagePermissionConfig {
  /** 是否可以创建 */
  canCreate: boolean
  /** 是否可以编辑 */
  canEdit: boolean
  /** 是否可以删除 */
  canDelete: boolean
  /** 是否可以查看 */
  canView: boolean
  /** 是否可以导出 */
  canExport: boolean
  /** 是否可以审核 */
  canAudit: boolean
  /** 自定义权限检查 */
  check: (permission: Permission) => boolean
}

/**
 * 项目管理页面权限
 */
export function useProjectPermissions(): PagePermissionConfig {
  const { checkPermission } = usePermission()

  return {
    canCreate: checkPermission(Permission.PROJECT_CREATE),
    canEdit: checkPermission(Permission.PROJECT_EDIT),
    canDelete: checkPermission(Permission.PROJECT_EDIT), // 编辑权限包含删除
    canView: checkPermission(Permission.PROJECT_VIEW),
    canExport: checkPermission(Permission.PROJECT_EXPORT),
    canAudit: checkPermission(Permission.PROJECT_AUDIT),
    check: checkPermission,
  }
}

/**
 * 受试者管理页面权限
 */
export function useSubjectPermissions(): PagePermissionConfig {
  const { checkPermission } = usePermission()

  return {
    canCreate: checkPermission(Permission.SUBJECT_CREATE),
    canEdit: checkPermission(Permission.SUBJECT_EDIT),
    canDelete: checkPermission(Permission.SUBJECT_EDIT),
    canView: checkPermission(Permission.SUBJECT_VIEW),
    canExport: false, // 受试者页面无导出功能
    canAudit: false,
    check: checkPermission,
  }
}

/**
 * CRF管理页面权限
 */
export function useCRFPermissions() {
  const { checkPermission } = usePermission()

  return {
    canView: checkPermission(Permission.CRF_VIEW),
    canDesign: checkPermission(Permission.CRF_DESIGN),
    canFill: checkPermission(Permission.CRF_FILL),
    canUseTemplate: checkPermission(Permission.CRF_TEMPLATE),
    check: checkPermission,
  }
}

/**
 * 质疑管理页面权限
 */
export function useQueryPermissions() {
  const { checkPermission } = usePermission()

  return {
    canView: checkPermission(Permission.QUERY_VIEW),
    canCreate: checkPermission(Permission.QUERY_CREATE),
    canReply: checkPermission(Permission.QUERY_REPLY),
    canClose: checkPermission(Permission.QUERY_CLOSE),
    check: checkPermission,
  }
}

/**
 * 系统配置页面权限
 */
export function useConfigPermissions() {
  const { checkPermission } = usePermission()

  return {
    canManageUsers: checkPermission(Permission.CONFIG_USER),
    canManageRoles: checkPermission(Permission.CONFIG_ROLE),
    canManageCenters: checkPermission(Permission.CONFIG_CENTER),
    canManageDictionaries: checkPermission(Permission.CONFIG_DICTIONARY),
    canManageWorkflows: checkPermission(Permission.CONFIG_WORKFLOW),
    canManageDataViews: checkPermission(Permission.CONFIG_DATAVIEW),
    check: checkPermission,
  }
}

/**
 * 系统日志页面权限
 */
export function useLogPermissions() {
  const { checkPermission } = usePermission()

  return {
    canView: checkPermission(Permission.LOG_VIEW),
    canExport: checkPermission(Permission.LOG_EXPORT),
    check: checkPermission,
  }
}

export default useProjectPermissions
