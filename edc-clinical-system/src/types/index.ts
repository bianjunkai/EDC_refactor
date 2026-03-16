// 项目类型
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  centerCount: number
  subjectCount: number
  enrolledCount: number
  targetCount: number
  createdAt: string
  updatedAt: string
  progress: number
  queryCount: number
  manager?: string
  startDate?: string
  endDate?: string
}

export type ProjectStatus =
  | '立项中'
  | '审批中'
  | '已驳回'
  | '进行中'
  | '已暂停'
  | '已完成'
  | '已锁库'
  | '已作废'

// 受试者类型
export interface Subject {
  id: string
  projectId: string
  screeningId: string
  randomId?: string
  name?: string
  gender: '男' | '女'
  age: number
  center: string
  currentVisit: string
  enrollmentDate?: string
  status: SubjectStatus
  progress: number
  queryCount?: number
  phone?: string
  email?: string
  address?: string
}

export type SubjectStatus =
  | '筛选中'
  | '已入组'
  | '完成'
  | '脱落'
  | '筛选失败'
  | '退出'
  | '失访'

// 质疑类型
export interface Query {
  id: string
  subjectId: string
  subjectName?: string
  projectId: string
  projectName?: string
  crfName: string
  fieldName: string
  content: string
  status: QueryStatus
  createdAt: string
  creator: string
  replies?: QueryReply[]
}

export type QueryStatus = '待处理' | '处理中' | '待确认' | '已解决' | '已撤销'

export interface QueryReply {
  id: string
  content: string
  type: 'reply' | 'followUp'
  createdAt: string
  creator: string
}

// 活动类型
export interface Activity {
  id: string
  type: 'fill' | 'query' | 'enroll' | 'complete'
  content: string
  subjectId?: string
  projectId?: string
  createdAt: string
  time?: string
}

// 通知类型
export interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  content: string
  createdAt: string
  read: boolean
}

// 用户类型
export interface User {
  id: string
  name: string
  username: string
  department: string
  center: string
  role: string
  status: '已启用' | '已禁用'
  email?: string
  phone?: string
  lastLogin?: string
}

// CRF 类型
export interface CRF {
  id: string
  name: string
  code: string
  description?: string
  sections: CRFSection[]
  createdAt: string
  updatedAt: string
  isTemplate?: boolean
}

export interface CRFSection {
  id: string
  name: string
  order: number
  fields: CRFField[]
}

export interface CRFField {
  id: string
  name: string
  label: string
  type: FieldType
  required: boolean
  placeholder?: string
  defaultValue?: string | string[]
  options?: { label: string; value: string }[]
  validation?: ValidationRule[]
  condition?: ConditionRule
}

export type FieldType =
  | 'input'
  | 'textarea'
  | 'inputUnit'
  | 'date'
  | 'datetime'
  | 'month'
  | 'radio'
  | 'select'
  | 'checkbox'
  | 'rate'
  | 'count'
  | 'table'
  | 'upload'

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom'
  message: string
  value?: unknown
}

export interface ConditionRule {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin'
  value: unknown
}

// 访视类型
export interface Visit {
  id: string
  name: string
  phase: string
  type: '循环' | '单次' | '计划外'
  order: number
  crfs: string[]
  windowDays?: number
}

// 导出配置类型
export interface ExportConfig {
  id?: string
  centers: string[]
  subjects: string[]
  crfScope: 'all' | 'selected'
  selectedCRFs?: string[]
  format: 'csv' | 'pdf' | 'audit' | 'sas'
  includeAudit: boolean
  includeModifiedOnly: boolean
  includeCreator: boolean
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt?: string
  fileName?: string
}

// 系统日志类型
export interface LoginLog {
  id: string
  userId: string
  username: string
  name: string
  ip: string
  browser: string
  os: string
  loginTime: string
  logoutTime?: string
  status: 'success' | 'failed'
  failReason?: string
}

export interface ProjectLog {
  id: string
  projectId: string
  projectName: string
  userId: string
  username: string
  action: string
  actionType: 'create' | 'update' | 'delete' | 'audit' | 'export' | 'lock' | 'other'
  content: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

export interface CenterLog {
  id: string
  centerId: string
  centerName: string
  userId: string
  username: string
  action: string
  actionType: 'create' | 'update' | 'delete' | 'assign' | 'other'
  content: string
  createdAt: string
}
