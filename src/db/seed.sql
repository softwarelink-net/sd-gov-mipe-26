INSERT INTO sd_mipe_users (username, password_hash, role, full_name, department) VALUES
('admin', 'admin2026', 'super_admin', '系统管理员', '信息中心'),
('manager', 'manager2026', 'biz_manager', '张主管', '网络安全处'),
('operator', 'operator2026', 'operator', '李经办', '行政审批处'),
('executive', 'executive2026', 'executive', '王厅长', '领导办公室');

INSERT INTO sd_mipe_system_configs (key, value, description) VALUES
('maintenance_mode', 'false', '是否开启系统维护模式'),
('data_retention_days', '180', '日志保留天数'),
('mipe_score_target', '85', '年度密评合规目标分'),
('feature_self_assessment', 'true', '启用 GB/T 39786 自评引擎'),
('feature_crypto_inventory', 'true', '启用密码产品台账');

INSERT INTO sd_mipe_assets (system_name, system_id, dept_owner, asset_type, crypto_products, compliance_status, risk_level) VALUES
('山东省建设工程审批系统', 'SYS-001', '行政审批处', 'application', '{"key_server":"服务器密码机","sig_gateway":"签名验签服务器","ssl":"国密 SSL 网关"}', 'in_progress', 'high'),
('济南市建筑工地监管平台', 'SYS-002', '建筑管理处', 'network', '{"ssl_cert":"国密证书","firewall":"密码防火墙"}', 'pending', 'medium'),
('住房保障数据中心', 'SYS-003', '住房保障中心', 'data', '{"db_encrypt":"数据库加密机","key_mgmt":"密钥管理系统"}', 'in_progress', 'high'),
('市政基础设施监测平台', 'SYS-004', '市政公用处', 'application', '{"token":"智能密码钥匙","vpn":"密码 VPN"}', 'partial', 'medium'),
('城乡规划一张图', 'SYS-005', '规划管理处', 'application', '{"timestamp":"时间戳服务器","seal":"电子签章系统"}', 'pending', 'low'),
('电子档案交换系统', 'SYS-006', '档案室', 'data', '{"integrity":"完整性校验模块","kms":"密钥管理系统"}', 'in_progress', 'medium'),
('公积金核心业务系统', 'SYS-007', '公积金中心', 'server', '{"hsm":"服务器密码机","auth":"动态令牌"}', 'partial', 'high'),
('内部协同办公平台', 'SYS-008', '办公室', 'application', '{"ssl":"国密 TLS","sso":"统一身份认证"}', 'passed', 'low');

INSERT INTO sd_mipe_check_items (category, item_code, description, requirement_text, weight, score, actual_score, status) VALUES
('physical', 'PHY-01', '物理环境安全', '密码设备应放置于受控机房，具备门禁与监控措施。', 5, 10, 10, 'pass'),
('network', 'NET-01', '通信网络架构', '应建立通信网络体系结构，划分不同安全域，并对安全域之间的访问进行控制。', 5, 10, 8, 'partial'),
('network', 'NET-02', '通信传输完整性', '应采用密码技术保证通信过程中数据的完整性。', 8, 10, 7, 'partial'),
('device', 'DEV-01', '密码产品选用', '应选用经检测认证合格的商用密码产品。', 10, 10, 9, 'partial'),
('device', 'DEV-02', '密钥管理', '应建立密钥全生命周期管理制度，覆盖生成、分发、更新与销毁。', 10, 10, 6, 'fail'),
('application', 'APP-01', '身份鉴别', '应对登录用户进行身份标识和鉴别，鉴别信息具备复杂度并定期更换。', 10, 10, 9, 'partial'),
('application', 'APP-02', '访问控制', '应依据业务与密评要求实施细粒度访问控制。', 8, 10, 8, 'partial'),
('application', 'APP-03', '安全审计', '应对密码应用相关事件进行审计并留存。', 6, 10, 10, 'pass'),
('data', 'DAT-01', '数据保密性', '应采用密码技术保证重要数据在存储与传输过程中的保密性。', 10, 10, 7, 'partial'),
('data', 'DAT-02', '数据完整性', '应采用校验或密码技术保证重要数据完整性。', 10, 10, 8, 'partial');

INSERT INTO sd_mipe_tasks (asset_id, assessor_id, task_code, title, task_type, status, deadline, score, progress, feedback) VALUES
(1, 2, 'MIPE-2026-01', '建设工程审批系统商用密码自评', 'self_assessment', 'completed', '2026-09-10', 85, 100, '基本符合，需补充密钥管理制度文件。'),
(1, 2, 'MIPE-2026-02', '建设工程审批系统第三方密评进场', 'external_audit', 'open', '2026-09-20', NULL, 20, '待测评机构进场。'),
(3, 2, 'MIPE-2026-03', '住房保障数据中心密评差距分析', 'self_assessment', 'in_progress', '2026-09-25', NULL, 55, '数据加密链路核查中。'),
(4, 3, 'MIPE-2026-04', '市政监测平台整改复测', 'remediation', 'review', '2026-09-18', 78, 90, '待机构复测确认。'),
(7, 2, 'MIPE-2026-05', '公积金核心系统密评正式测评', 'external_audit', 'in_progress', '2026-09-30', NULL, 40, '应用层身份鉴别核验进行中。'),
(8, 3, 'MIPE-2026-06', '协同办公平台年度密评复核', 'self_assessment', 'completed', '2026-08-31', 92, 100, '符合要求。');

INSERT INTO sd_mipe_remediations (asset_id, item_code, issue_title, severity, status, owner_name, due_date) VALUES
(1, 'DEV-02', '密钥管理制度缺失书面规程', 'High', 'fixing', '张主管', '2026-09-15'),
(1, 'NET-02', '跨域传输未统一启用完整性保护', 'Medium', 'pending', '李经办', '2026-09-18'),
(3, 'DAT-01', '重要业务字段存储未全量加密', 'Critical', 'fixing', '张主管', '2026-09-12'),
(4, 'APP-01', '口令复杂度策略未覆盖全部子系统', 'High', 'retest', '李经办', '2026-09-10'),
(7, 'DEV-01', '部分密码产品检测证书临期', 'Medium', 'pending', '张主管', '2026-09-22'),
(2, 'NET-01', '安全域划分示意图与现网不一致', 'Low', 'passed', '李经办', '2026-09-05'),
(6, 'DAT-02', '档案交换完整性校验覆盖不全', 'High', 'fixing', '李经办', '2026-09-16'),
(5, 'APP-02', '规划系统角色权限矩阵待更新', 'Low', 'pending', '李经办', '2026-09-28');

INSERT INTO sd_mipe_compliance_trend (day_label, completed_rate, issue_count) VALUES
('09-01', 62, 12),
('09-02', 64, 11),
('09-03', 67, 10),
('09-04', 70, 9),
('09-05', 72, 8),
('09-06', 75, 7),
('09-07', 78, 6);

INSERT INTO sd_mipe_audit_logs (user_id, action, details) VALUES
(1, 'SYSTEM_INIT', '系统种子数据初始化完成'),
(2, 'TASK_ASSIGN', '下发测评任务 MIPE-2026-01'),
(3, 'REMEDIATE_UPDATE', '更新整改单 密钥管理制度缺失书面规程 状态为整改中'),
(2, 'ASSESSMENT_SCAN', '触发 GB/T 39786 自评检查项扫描'),
(1, 'LOGIN', '用户 admin 登录系统');
