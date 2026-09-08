import type { Database, SqlJsStatic } from 'sql.js'
import schemaSql from './schema.sql?raw'
import seedSql from './seed.sql?raw'
import type {
  AssessmentTask,
  Asset,
  AuditLog,
  CheckItem,
  DashboardStats,
  Remediation,
  RemStatus,
  SystemConfig,
  TaskStatus,
  User,
} from '@/types'

const DB_STORAGE_KEY = 'sd_gov_mipe_26_sqlite_v1'
const WASM_LOCAL = '/sql-wasm.wasm'
const WASM_CDN = 'https://sql.js.org/dist/sql-wasm.wasm'

let SQL: SqlJsStatic | null = null
let db: Database | null = null
let initPromise: Promise<Database> | null = null

type InitSqlJs = (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>

async function loadSqlJs(): Promise<SqlJsStatic> {
  const mod = await import('sql.js/dist/sql-wasm.js')
  const initSqlJs = ((mod as { default?: InitSqlJs }).default ??
    (mod as unknown as InitSqlJs)) as InitSqlJs
  if (typeof initSqlJs !== 'function') {
    throw new TypeError('sql.js init function not found in module export')
  }
  let lastError: unknown
  for (const locate of [WASM_LOCAL, WASM_CDN]) {
    try {
      return await initSqlJs({ locateFile: () => locate })
    } catch (e) {
      lastError = e
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Failed to init sql.js')
}

function persist() {
  if (!db) return
  const data = db.export()
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(Array.from(data)))
}

function runStatements(sql: string) {
  if (!db) throw new Error('Database not initialized')
  db.run(sql)
}

function queryAll<T>(sql: string, params: unknown[] = []): T[] {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare(sql)
  stmt.bind(params as never[])
  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

function queryOne<T>(sql: string, params: unknown[] = []): T | null {
  return queryAll<T>(sql, params)[0] ?? null
}

function run(sql: string, params: unknown[] = []) {
  if (!db) throw new Error('Database not initialized')
  db.run(sql, params as never[])
}

export async function initDatabase(): Promise<Database> {
  if (db) return db
  if (initPromise) return initPromise

  initPromise = (async () => {
    SQL = await loadSqlJs()
    const saved = localStorage.getItem(DB_STORAGE_KEY)
    if (saved) {
      try {
        db = new SQL.Database(new Uint8Array(JSON.parse(saved) as number[]))
        return db
      } catch {
        localStorage.removeItem(DB_STORAGE_KEY)
      }
    }
    db = new SQL.Database()
    runStatements(schemaSql)
    runStatements(seedSql)
    persist()
    return db
  })()

  return initPromise
}

export const dbService = {
  async login(username: string, password: string): Promise<User | null> {
    await initDatabase()
    const user = queryOne<User & { password_hash: string }>(
      'SELECT id, username, password_hash, role, full_name, department, created_at, last_login FROM sd_mipe_users WHERE username = ?',
      [username],
    )
    if (!user || user.password_hash !== password) return null

    run('UPDATE sd_mipe_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id])
    this.addAuditLog(user.id, 'LOGIN', `用户 ${username} 登录系统`)
    persist()

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
      department: user.department,
      created_at: user.created_at,
      last_login: user.last_login,
    }
  },

  listUsers(): User[] {
    return queryAll<User>(
      'SELECT id, username, role, full_name, department, created_at, last_login FROM sd_mipe_users ORDER BY id',
    )
  },

  listAssets(opts: { keyword?: string; risk?: string } = {}): Asset[] {
    const { keyword = '', risk = '' } = opts
    const where: string[] = ['1=1']
    const params: unknown[] = []
    if (keyword) {
      where.push('(system_name LIKE ? OR system_id LIKE ? OR dept_owner LIKE ?)')
      const like = `%${keyword}%`
      params.push(like, like, like)
    }
    if (risk) {
      where.push('risk_level = ?')
      params.push(risk)
    }
    return queryAll<Asset>(
      `SELECT * FROM sd_mipe_assets WHERE ${where.join(' AND ')} ORDER BY
        CASE risk_level WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, id`,
      params,
    )
  },

  listCheckItems(opts: { category?: string } = {}): CheckItem[] {
    const { category = '' } = opts
    if (category) {
      return queryAll<CheckItem>(
        'SELECT * FROM sd_mipe_check_items WHERE category = ? ORDER BY id',
        [category],
      )
    }
    return queryAll<CheckItem>('SELECT * FROM sd_mipe_check_items ORDER BY id')
  },

  listTasks(opts: { status?: string } = {}): AssessmentTask[] {
    const { status = '' } = opts
    const where: string[] = ['1=1']
    const params: unknown[] = []
    if (status) {
      where.push('t.status = ?')
      params.push(status)
    }
    return queryAll<AssessmentTask>(
      `SELECT t.*, a.system_name
       FROM sd_mipe_tasks t
       LEFT JOIN sd_mipe_assets a ON a.id = t.asset_id
       WHERE ${where.join(' AND ')}
       ORDER BY t.deadline`,
      params,
    )
  },

  updateTaskStatus(id: number, status: TaskStatus, progress: number, userId?: number) {
    run('UPDATE sd_mipe_tasks SET status = ?, progress = ? WHERE id = ?', [status, progress, id])
    if (userId) this.addAuditLog(userId, 'TASK_UPDATE', `更新测评任务 #${id}`)
    persist()
  },

  listRemediations(opts: { status?: string; severity?: string } = {}): Remediation[] {
    const { status = '', severity = '' } = opts
    const where: string[] = ['1=1']
    const params: unknown[] = []
    if (status) {
      where.push('r.status = ?')
      params.push(status)
    }
    if (severity) {
      where.push('r.severity = ?')
      params.push(severity)
    }
    return queryAll<Remediation>(
      `SELECT r.*, a.system_name
       FROM sd_mipe_remediations r
       LEFT JOIN sd_mipe_assets a ON a.id = r.asset_id
       WHERE ${where.join(' AND ')}
       ORDER BY CASE r.severity
         WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END,
         r.id DESC`,
      params,
    )
  },

  updateRemediationStatus(id: number, status: RemStatus, userId?: number) {
    run('UPDATE sd_mipe_remediations SET status = ? WHERE id = ?', [status, id])
    if (userId) this.addAuditLog(userId, 'REMEDIATE_UPDATE', `更新整改单 #${id} 状态为 ${status}`)
    persist()
  },

  listConfigs(): SystemConfig[] {
    return queryAll<SystemConfig>('SELECT * FROM sd_mipe_system_configs ORDER BY key')
  },

  setConfig(key: string, value: string) {
    run(
      `INSERT INTO sd_mipe_system_configs (key, value, description) VALUES (?, ?, NULL)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, value],
    )
    persist()
  },

  listAuditLogs(limit = 20): AuditLog[] {
    return queryAll<AuditLog>(
      `SELECT l.*, u.username
       FROM sd_mipe_audit_logs l
       LEFT JOIN sd_mipe_users u ON u.id = l.user_id
       ORDER BY l.id DESC LIMIT ?`,
      [limit],
    )
  },

  addAuditLog(userId: number | null, action: string, details: string) {
    run('INSERT INTO sd_mipe_audit_logs (user_id, action, details) VALUES (?, ?, ?)', [
      userId,
      action,
      details,
    ])
    persist()
  },

  getStats(): DashboardStats {
    const assetCount = queryOne<{ c: number }>('SELECT COUNT(*) as c FROM sd_mipe_assets')?.c ?? 0
    const highRiskCount =
      queryOne<{ c: number }>(
        "SELECT COUNT(*) as c FROM sd_mipe_assets WHERE risk_level = 'high'",
      )?.c ?? 0
    const openRemediations =
      queryOne<{ c: number }>(
        "SELECT COUNT(*) as c FROM sd_mipe_remediations WHERE status != 'passed'",
      )?.c ?? 0
    const criticalIssues =
      queryOne<{ c: number }>(
        "SELECT COUNT(*) as c FROM sd_mipe_remediations WHERE severity = 'Critical' AND status != 'passed'",
      )?.c ?? 0
    const scoreRow = queryOne<{ total: number; actual: number }>(
      'SELECT COALESCE(SUM(score),0) as total, COALESCE(SUM(actual_score),0) as actual FROM sd_mipe_check_items',
    )
    const complianceScore =
      scoreRow && scoreRow.total > 0
        ? Math.round((scoreRow.actual / scoreRow.total) * 100)
        : 0
    const taskOpen =
      queryOne<{ c: number }>(
        "SELECT COUNT(*) as c FROM sd_mipe_tasks WHERE status != 'completed'",
      )?.c ?? 0

    const byCategory = queryAll<{ name: string; value: number }>(
      `SELECT category as name,
              CASE WHEN SUM(score) = 0 THEN 0 ELSE ROUND(SUM(actual_score) * 100.0 / SUM(score)) END as value
       FROM sd_mipe_check_items GROUP BY category`,
    )
    const byRemStatus = queryAll<{ name: string; value: number }>(
      `SELECT status as name, COUNT(*) as value FROM sd_mipe_remediations GROUP BY status`,
    )
    const trend = queryAll<{ day: string; rate: number; issues: number }>(
      `SELECT day_label as day, completed_rate as rate, issue_count as issues
       FROM sd_mipe_compliance_trend ORDER BY id`,
    )

    return {
      assetCount,
      highRiskCount,
      openRemediations,
      criticalIssues,
      complianceScore,
      taskOpen,
      byCategory,
      byRemStatus,
      trend,
    }
  },

  resetDatabase() {
    localStorage.removeItem(DB_STORAGE_KEY)
    db = null
    initPromise = null
  },
}
