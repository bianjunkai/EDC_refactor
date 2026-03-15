import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  type UserRole,
  type Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  ROLE_PERMISSIONS,
} from '@/constants/permissions'

/**
 * 权限上下文类型
 */
interface PermissionContextType {
  /** 当前用户角色 */
  userRole: UserRole
  /** 设置用户角色 */
  setUserRole: (role: UserRole) => void
  /** 当前用户拥有的所有权限 */
  permissions: Permission[]
  /** 检查是否有指定权限 */
  checkPermission: (permission: Permission) => boolean
  /** 检查是否有任意一个权限 */
  checkAnyPermission: (permissions: Permission[]) => boolean
  /** 检查是否有所有权限 */
  checkAllPermissions: (permissions: Permission[]) => boolean
  /** 检查是否可以访问路由 */
  checkRouteAccess: (route: string) => boolean
  /** 切换角色（用于测试） */
  switchRole: (role: UserRole) => void
}

/**
 * 权限上下文
 */
const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

/**
 * 权限提供者 Props
 */
interface PermissionProviderProps {
  children: ReactNode
  initialRole?: UserRole
}

/**
 * 权限提供者组件
 * 包装应用以提供权限上下文
 *
 * @example
 * ```tsx
 * <PermissionProvider initialRole="pi">
 *   <App />
 * </PermissionProvider>
 * ```
 */
export function PermissionProvider({
  children,
  initialRole = 'admin',
}: PermissionProviderProps) {
  const [userRole, setUserRole] = useState<UserRole>(initialRole)

  // 获取当前角色的所有权限
  const permissions = ROLE_PERMISSIONS[userRole] || []

  // 检查单个权限
  const checkPermission = useCallback(
    (permission: Permission) => {
      return hasPermission(userRole, permission)
    },
    [userRole]
  )

  // 检查任意权限
  const checkAnyPermission = useCallback(
    (perms: Permission[]) => {
      return hasAnyPermission(userRole, perms)
    },
    [userRole]
  )

  // 检查所有权限
  const checkAllPermissions = useCallback(
    (perms: Permission[]) => {
      return hasAllPermissions(userRole, perms)
    },
    [userRole]
  )

  // 检查路由访问权限
  const checkRouteAccess = useCallback(
    (route: string) => {
      return canAccessRoute(userRole, route)
    },
    [userRole]
  )

  // 切换角色（用于开发测试）
  const switchRole = useCallback((role: UserRole) => {
    setUserRole(role)
    console.log(`[Permission] 角色切换为: ${role}`)
  }, [])

  const value: PermissionContextType = {
    userRole,
    setUserRole,
    permissions,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    checkRouteAccess,
    switchRole,
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

/**
 * 使用权限上下文的 Hook
 *
 * @example
 * ```tsx
 * const { checkPermission, userRole } = usePermission()
 * const canEdit = checkPermission(Permission.PROJECT_EDIT)
 * ```
 */
export function usePermission(): PermissionContextType {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }
  return context
}

/**
 * 高阶组件：为组件注入权限能力
 *
 * @example
 * ```tsx
 * const MyComponentWithPermission = withPermission(MyComponent)
 * // 在组件中可以通过 props.userRole, props.checkPermission 访问权限
 * ```
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P & PermissionContextType>
) {
  return function WithPermissionComponent(props: P) {
    const permissionContext = usePermission()
    return <WrappedComponent {...props} {...permissionContext} />
  }
}
