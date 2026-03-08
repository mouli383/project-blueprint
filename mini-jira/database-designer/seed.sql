-- =====================================================
-- Mini Jira/Trello — Seed Data
-- Database: mini_jira_db
-- Role: Database Designer
-- Run AFTER schema.sql
-- =====================================================

USE mini_jira_db;

-- =====================================================
-- Sample Users (passwords are bcrypt hash of "password123")
-- =====================================================
INSERT INTO users (id, name, email, password_hash, avatar_url) VALUES
('u1000001-aaaa-bbbb-cccc-000000000001', 'Rahul Sharma', 'rahul@example.com', '$2b$10$xJHPqK5tZ6QUJx1pQdZkEe8GjK7kL3mN5oP9qR1sT3uV5wX7yZ0aB', NULL),
('u1000001-aaaa-bbbb-cccc-000000000002', 'Priya Patel', 'priya@example.com', '$2b$10$xJHPqK5tZ6QUJx1pQdZkEe8GjK7kL3mN5oP9qR1sT3uV5wX7yZ0aB', NULL),
('u1000001-aaaa-bbbb-cccc-000000000003', 'Arjun Kumar', 'arjun@example.com', '$2b$10$xJHPqK5tZ6QUJx1pQdZkEe8GjK7kL3mN5oP9qR1sT3uV5wX7yZ0aB', NULL),
('u1000001-aaaa-bbbb-cccc-000000000004', 'Sneha Reddy', 'sneha@example.com', '$2b$10$xJHPqK5tZ6QUJx1pQdZkEe8GjK7kL3mN5oP9qR1sT3uV5wX7yZ0aB', NULL),
('u1000001-aaaa-bbbb-cccc-000000000005', 'Vikram Singh', 'vikram@example.com', '$2b$10$xJHPqK5tZ6QUJx1pQdZkEe8GjK7kL3mN5oP9qR1sT3uV5wX7yZ0aB', NULL),
('u1000001-aaaa-bbbb-cccc-000000000006', 'Ananya Gupta', 'ananya@example.com', '$2b$10$xJHPqK5tZ6QUJx1pQdZkEe8GjK7kL3mN5oP9qR1sT3uV5wX7yZ0aB', NULL);

-- =====================================================
-- Sample Project
-- =====================================================
INSERT INTO projects (id, name, description, owner_id) VALUES
('p2000001-aaaa-bbbb-cccc-000000000001', 'Mini Jira Project', 'Our academic full-stack project management tool', 'u1000001-aaaa-bbbb-cccc-000000000001');

-- =====================================================
-- Project Members
-- =====================================================
INSERT INTO project_members (id, project_id, user_id, role) VALUES
('m3000001-aaaa-bbbb-cccc-000000000001', 'p2000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000001', 'owner'),
('m3000001-aaaa-bbbb-cccc-000000000002', 'p2000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000002', 'admin'),
('m3000001-aaaa-bbbb-cccc-000000000003', 'p2000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000003', 'member'),
('m3000001-aaaa-bbbb-cccc-000000000004', 'p2000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000004', 'member'),
('m3000001-aaaa-bbbb-cccc-000000000005', 'p2000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000005', 'member'),
('m3000001-aaaa-bbbb-cccc-000000000006', 'p2000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000006', 'member');

-- =====================================================
-- Sample Sprint
-- =====================================================
INSERT INTO sprints (id, project_id, name, goal, status, start_date, end_date) VALUES
('s4000001-aaaa-bbbb-cccc-000000000001', 'p2000001-aaaa-bbbb-cccc-000000000001', 'Sprint 1', 'Complete core features', 'active', '2026-03-01', '2026-03-15');

-- =====================================================
-- Sample Tasks
-- =====================================================
INSERT INTO tasks (id, project_id, sprint_id, title, description, status, priority, assignee_id, reporter_id, position) VALUES
('t5000001-aaaa-bbbb-cccc-000000000001', 'p2000001-aaaa-bbbb-cccc-000000000001', 's4000001-aaaa-bbbb-cccc-000000000001', 'Design Login Page', 'Create HTML/CSS login page with Bootstrap', 'done', 'high', 'u1000001-aaaa-bbbb-cccc-000000000002', 'u1000001-aaaa-bbbb-cccc-000000000001', 1),
('t5000001-aaaa-bbbb-cccc-000000000002', 'p2000001-aaaa-bbbb-cccc-000000000001', 's4000001-aaaa-bbbb-cccc-000000000001', 'Setup MySQL Schema', 'Create all tables in phpMyAdmin', 'done', 'critical', 'u1000001-aaaa-bbbb-cccc-000000000003', 'u1000001-aaaa-bbbb-cccc-000000000001', 2),
('t5000001-aaaa-bbbb-cccc-000000000003', 'p2000001-aaaa-bbbb-cccc-000000000001', 's4000001-aaaa-bbbb-cccc-000000000001', 'Build Kanban Board', 'Implement drag-and-drop task board', 'in_progress', 'high', 'u1000001-aaaa-bbbb-cccc-000000000004', 'u1000001-aaaa-bbbb-cccc-000000000001', 3),
('t5000001-aaaa-bbbb-cccc-000000000004', 'p2000001-aaaa-bbbb-cccc-000000000001', 's4000001-aaaa-bbbb-cccc-000000000001', 'Implement OAuth Login', 'Google OAuth integration', 'todo', 'medium', 'u1000001-aaaa-bbbb-cccc-000000000005', 'u1000001-aaaa-bbbb-cccc-000000000001', 4),
('t5000001-aaaa-bbbb-cccc-000000000005', 'p2000001-aaaa-bbbb-cccc-000000000001', NULL, 'Setup Git Workflow', 'Configure branches and webhooks', 'todo', 'low', 'u1000001-aaaa-bbbb-cccc-000000000006', 'u1000001-aaaa-bbbb-cccc-000000000001', 5);

-- =====================================================
-- Sample Comments
-- =====================================================
INSERT INTO comments (id, task_id, author_id, body) VALUES
('c6000001-aaaa-bbbb-cccc-000000000001', 't5000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000002', 'Login page design is complete with responsive layout!'),
('c6000001-aaaa-bbbb-cccc-000000000002', 't5000001-aaaa-bbbb-cccc-000000000003', 'u1000001-aaaa-bbbb-cccc-000000000004', 'Working on the drag-and-drop functionality now.');

-- =====================================================
-- Sample Activity Log
-- =====================================================
INSERT INTO activity_log (id, project_id, entity_type, entity_id, actor_id, action, metadata) VALUES
('a7000001-aaaa-bbbb-cccc-000000000001', 'p2000001-aaaa-bbbb-cccc-000000000001', 'project', 'p2000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000001', 'created_project', '{"project_name": "Mini Jira Project"}'),
('a7000001-aaaa-bbbb-cccc-000000000002', 'p2000001-aaaa-bbbb-cccc-000000000001', 'task', 't5000001-aaaa-bbbb-cccc-000000000001', 'u1000001-aaaa-bbbb-cccc-000000000001', 'created_task', '{"task_title": "Design Login Page"}');
