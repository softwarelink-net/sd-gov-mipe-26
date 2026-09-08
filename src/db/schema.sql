-- Users Table
CREATE TABLE IF NOT EXISTS sd_mipe_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'biz_manager', 'operator', 'executive')),
    full_name TEXT,
    department TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    last_login TEXT
);

CREATE TABLE IF NOT EXISTS sd_mipe_system_configs (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT
);

-- System Assets & Crypto Base
CREATE TABLE IF NOT EXISTS sd_mipe_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    system_name TEXT NOT NULL,
    system_id TEXT UNIQUE NOT NULL,
    dept_owner TEXT,
    asset_type TEXT CHECK(asset_type IN ('server', 'network', 'application', 'data')),
    crypto_products TEXT,
    compliance_status TEXT DEFAULT 'pending',
    risk_level TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Assessment / Audit Tasks
CREATE TABLE IF NOT EXISTS sd_mipe_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER,
    assessor_id INTEGER,
    task_code TEXT UNIQUE,
    title TEXT,
    task_type TEXT CHECK(task_type IN ('self_assessment', 'external_audit', 'remediation')),
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'review', 'completed')),
    deadline DATE,
    score INTEGER,
    progress INTEGER DEFAULT 0,
    feedback TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(asset_id) REFERENCES sd_mipe_assets(id)
);

-- GB/T 39786 Compliance Check Items
CREATE TABLE IF NOT EXISTS sd_mipe_check_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT CHECK(category IN ('physical', 'network', 'device', 'application', 'data')),
    item_code TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    requirement_text TEXT NOT NULL,
    weight INTEGER DEFAULT 1,
    score INTEGER DEFAULT 0,
    actual_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending'
);

-- Remediation Tracker
CREATE TABLE IF NOT EXISTS sd_mipe_remediations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER,
    item_code TEXT,
    issue_title TEXT NOT NULL,
    severity TEXT CHECK(severity IN ('Critical', 'High', 'Medium', 'Low')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'fixing', 'retest', 'passed')),
    owner_name TEXT,
    due_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(asset_id) REFERENCES sd_mipe_assets(id)
);

CREATE TABLE IF NOT EXISTS sd_mipe_audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id INTEGER,
    details TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sd_mipe_compliance_trend (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_label TEXT NOT NULL,
    completed_rate INTEGER DEFAULT 0,
    issue_count INTEGER DEFAULT 0
);
