-- =====================================================
-- Mini Jira — Seed Data
-- Password for all users: password123
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- =====================================================

USE mini_jira_db;

-- Users
INSERT INTO users (id, name, email, password_hash, role) VALUES
('u001', 'Admin User', 'admin@minijira.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('u002', 'John Developer', 'john@minijira.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member'),
('u003', 'Jane Designer', 'jane@minijira.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member'),
('u004', 'Bob Tester', 'bob@minijira.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member');

-- Projects
INSERT INTO projects (id, name, description, project_key, owner_id) VALUES
('p001', 'Mini Jira Development', 'Building the Mini Jira project management tool', 'MJD', 'u001'),
('p002', 'Website Redesign', 'Complete redesign of the company website', 'WRD', 'u001');

-- Project Members
INSERT INTO project_members (id, project_id, user_id, role) VALUES
('pm001', 'p001', 'u001', 'owner'),
('pm002', 'p001', 'u002', 'member'),
('pm003', 'p001', 'u003', 'member'),
('pm004', 'p001', 'u004', 'member'),
('pm005', 'p002', 'u001', 'owner'),
('pm006', 'p002', 'u002', 'member');

-- Sprints
INSERT INTO sprints (id, project_id, name, goal, start_date, end_date, status) VALUES
('s001', 'p001', 'Sprint 1 - Foundation', 'Set up project structure and auth', '2025-01-06', '2025-01-19', 'completed'),
('s002', 'p001', 'Sprint 2 - Core Features', 'Build task management and board view', '2025-01-20', '2025-02-02', 'active'),
('s003', 'p001', 'Sprint 3 - Polish', 'Bug fixes and UI improvements', '2025-02-03', '2025-02-16', 'planning');

-- Tasks
INSERT INTO tasks (id, project_id, sprint_id, title, description, status, priority, task_type, assignee_id, reporter_id) VALUES
('t001', 'p001', 's002', 'Create login page', 'Build responsive login page with form validation', 'done', 'high', 'story', 'u002', 'u001'),
('t002', 'p001', 's002', 'Design dashboard layout', 'Create wireframe and implement dashboard', 'in_progress', 'high', 'story', 'u003', 'u001'),
('t003', 'p001', 's002', 'API authentication', 'Implement JWT-based authentication system', 'done', 'critical', 'task', 'u002', 'u001'),
('t004', 'p001', 's002', 'Fix login redirect bug', 'Users not redirected after successful login', 'todo', 'medium', 'bug', 'u002', 'u004'),
('t005', 'p001', 's002', 'Add task filtering', 'Filter tasks by status, priority, assignee', 'todo', 'medium', 'story', 'u003', 'u001'),
('t006', 'p001', 's002', 'Write unit tests', 'Add tests for auth and task modules', 'review', 'low', 'task', 'u004', 'u001'),
('t007', 'p001', 's003', 'Mobile responsive design', 'Make all pages mobile-friendly', 'todo', 'high', 'story', 'u003', 'u001'),
('t008', 'p001', NULL, 'Documentation', 'Write project documentation and README', 'todo', 'low', 'task', NULL, 'u001');

-- Comments
INSERT INTO comments (id, task_id, user_id, content) VALUES
('c001', 't002', 'u003', 'Started working on the dashboard wireframe. Will share mockups by EOD.'),
('c002', 't002', 'u001', 'Looks good! Make sure to include the sprint progress chart.'),
('c003', 't004', 'u004', 'Reproducible on Chrome and Firefox. Happens after session timeout.');

-- Activity Log
INSERT INTO activity_log (id, project_id, user_id, action, entity_type, entity_id, details) VALUES
('a001', 'p001', 'u001', 'created', 'project', 'p001', 'Created project "Mini Jira Development"'),
('a002', 'p001', 'u002', 'updated', 'task', 't001', 'Moved "Create login page" to Done'),
('a003', 'p001', 'u003', 'updated', 'task', 't002', 'Started working on "Design dashboard layout"'),
('a004', 'p001', 'u004', 'created', 'task', 't004', 'Reported bug "Fix login redirect bug"');
