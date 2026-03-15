import { type ReactNode } from 'react'
import { type Permission } from '@/constants/permissions'
import { usePermission } from '@/contexts/PermissionContext'

/**
 * 权限守卫组件 Props
 */
interface PermissionGuardProps {
  /** 需要检查的权限 */
  permission: Permission
  /** 有权限时渲染的内容 */
  children: ReactNode
  /** 无权限时渲染的内容（可选） */
  fallback?: ReactNode
}

/**
 * 权限守卫组件
 * 根据用户权限决定是否渲染子元素
 *
 * @example
 * ```tsx
 * <PermissionGuard permission={Permission.PROJECT_CREATE}>
 *   <Button>新建项目</Button>
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { checkPermission } = usePermission()

  if (!checkPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * 任意权限守卫组件 Props
 */
interface AnyPermissionGuardProps {
  /** 需要检查的权限列表（满足任意一个即可） */
  permissions: Permission[]
  /** 有权限时渲染的内容 */
  children: ReactNode
  /** 无权限时渲染的内容（可选） */
  fallback?: ReactNode
}

/**
 * 任意权限守卫组件
 * 用户拥有任意一个指定权限时渲染子元素
 *
 * @example
 * ```tsx
 * <AnyPermissionGuard permissions={[Permission.PROJECT_CREATE, Permission.PROJECT_EDIT]}>
 *   <Button>管理项目</Button>
 * </AnyPermissionGuard>
 * ```
 */
export function AnyPermissionGuard({
  permissions,
  children,
  fallback = null,
}: AnyPermissionGuardProps) {
  const { checkAnyPermission } = usePermission()

  if (!checkAnyPermission(permissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * 所有权限守卫组件 Props
 */
interface AllPermissionsGuardProps {
  /** 需要检查的权限列表（需满足所有） */
  permissions: Permission[]
  /** 有权限时渲染的内容 */
  children: ReactNode
  /** 无权限时渲染的内容（可选） */
  fallback?: ReactNode
}

/**
 * 所有权限守卫组件
 * 用户拥有所有指定权限时渲染子元素
 *
 * @example
 * ```tsx
 * <AllPermissionsGuard permissions={[Permission.PROJECT_EDIT, Permission.PROJECT_AUDIT]}>
 *   <Button>审核并编辑</Button>
 * </AllPermissionsGuard>
 * ```
 */
export function AllPermissionsGuard({
  permissions,
  children,
  fallback = null,
}: AllPermissionsGuardProps) {
  const { checkAllPermissions } = usePermission()

  if (!checkAllPermissions(permissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * 无权限显示组件
 * 当用户没有指定权限时渲染内容
 *
 * @example
 * ```tsx
 * <NoPermissionGuard permission={Permission.PROJECT_CREATE}>
 *   <Alert message="您没有创建项目的权限" type="warning" />
 * </NoPermissionGuard>
 * ```
 */
interface NoPermissionGuardProps {
  permission: Permission
  children: ReactNode
}

export function NoPermissionGuard({ permission, children }: NoPermissionGuardProps) {
  const { checkPermission } = usePermission()

  if (checkPermission(permission)) {
    return null
  }

  return <>{children}</>
}

export default PermissionGuard
