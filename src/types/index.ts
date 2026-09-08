export type UserRole = 'super_admin' | 'biz_manager' | 'operator' | 'executive'

export type AssetType = 'server' | 'network' | 'application' | 'data'
export type RiskLevel = 'high' | 'medium' | 'low'
export type ComplianceStatus = 'pending' | 'in_progress' | 'partial' | 'passed'
export type TaskType = 'self_assessment' | 'external_audit' | 'remediation'
export type TaskStatus = 'open' | 'in_progress' | 'review' | 'completed'
export type CheckCategory = 'physical' | 'network' | 'device' | 'application' | 'data'
export type RemSeverity = 'Critical' | 'High' | 'Medium' | 'Low'
export type RemStatus = 'pending' | 'fixing' | 'retest' | 'passed'

export interface User {
  id: number
  username: string
  role: UserRole
  full_name: string
  department?: string | null
  created_at?: string
  last_login?: string | null
}

export interface SystemConfig {
  key: string
  value: string
  description: string | null
}

export interface Asset {
  id: number
  system_name: string
  system_id: string
  dept_owner: string | null
  asset_type: AssetType
  crypto_products: string | null
  compliance_status: string
  risk_level: string
  created_at?: string
}

export interface AssessmentTask {
  id: number
  asset_id: number | null
  assessor_id: number | null
  task_code: string | null
  title: string | null
  task_type: TaskType
  status: TaskStatus
  deadline: string | null
  score: number | null
  progress: number
  feedback: string | null
  system_name?: string
}

export interface CheckItem {
  id: number
  category: CheckCategory
  item_code: string
  description: string
  requirement_text: string
  weight: number
  score: number
  actual_score: number
  status: string
}

export interface Remediation {
  id: number
  asset_id: number | null
  item_code: string | null
  issue_title: string
  severity: RemSeverity
  status: RemStatus
  owner_name: string | null
  due_date: string | null
  system_name?: string
}

export interface AuditLog {
  id: number
  user_id: number | null
  action: string
  target_type?: string | null
  target_id?: number | null
  details: string | null
  created_at?: string
  username?: string
}

export interface DashboardStats {
  assetCount: number
  highRiskCount: number
  openRemediations: number
  criticalIssues: number
  complianceScore: number
  taskOpen: number
  byCategory: { name: string; value: number }[]
  byRemStatus: { name: string; value: number }[]
  trend: { day: string; rate: number; issues: number }[]
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: '系统超管',
  biz_manager: '业务主管',
  operator: '基层经办',
  executive: '决策层',
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['users', 'roles', 'dashboard', 'assets', 'assessment', 'tasks', 'remediation', 'reports', 'settings', 'audit'],
  biz_manager: ['dashboard', 'assets', 'assessment', 'tasks', 'remediation', 'reports'],
  operator: ['dashboard', 'assets', 'assessment:write', 'tasks:write', 'remediation:write'],
  executive: ['dashboard:read', 'reports:read'],
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  server: '服务器',
  network: '网络',
  application: '应用',
  data: '数据',
}

export const RISK_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export const COMPLIANCE_STATUS_LABELS: Record<string, string> = {
  pending: '待评',
  in_progress: '测评中',
  partial: '部分符合',
  passed: '符合',
}

export const CATEGORY_LABELS: Record<CheckCategory, string> = {
  physical: '物理环境',
  network: '网络通信',
  device: '设备与密钥',
  application: '应用系统',
  data: '数据安全',
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  self_assessment: '合规自评',
  external_audit: '第三方密评',
  remediation: '整改复测',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: '待启动',
  in_progress: '进行中',
  review: '复核中',
  completed: '已完成',
}

export const SEVERITY_LABELS: Record<RemSeverity, string> = {
  Critical: '严重',
  High: '高危',
  Medium: '中危',
  Low: '低危',
}

export const REM_STATUS_LABELS: Record<RemStatus, string> = {
  pending: '待整改',
  fixing: '整改中',
  retest: '复测中',
  passed: '复测通过',
}
