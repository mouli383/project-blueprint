// =====================================================
// Mini Jira — Dashboard Logic
// Role: Frontend Developer
// [PLACEHOLDER: Backend Developer will connect real APIs]
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadRecentTasks();
    loadActivityFeed();
    loadSidebarProjects();
});

// ── Load Stats ───────────────────────────────────────
async function loadDashboardStats() {
    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const stats = await API.get('/projects/' + getCurrentProjectId() + '/stats');
        // document.getElementById('stat-total').textContent = stats.total;
        // document.getElementById('stat-progress').textContent = stats.in_progress;
        // document.getElementById('stat-done').textContent = stats.done;
        // document.getElementById('stat-overdue').textContent = stats.overdue;
        // ─────────────────────────────────────────────

        // TEMPORARY: Mock data for frontend
        document.getElementById('stat-total').textContent = '5';
        document.getElementById('stat-progress').textContent = '1';
        document.getElementById('stat-done').textContent = '2';
        document.getElementById('stat-overdue').textContent = '0';

    } catch (error) {
        console.error('[Dashboard] Failed to load stats:', error);
    }
}

// ── Load Recent Tasks ────────────────────────────────
async function loadRecentTasks() {
    const tbody = document.getElementById('recent-tasks-body');
    if (!tbody) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const tasks = await API.get('/projects/' + getCurrentProjectId() + '/tasks?limit=5');
        // ─────────────────────────────────────────────

        // TEMPORARY: Mock data
        const tasks = [
            { id: 'TASK-001', title: 'Design Login Page', status: 'done', priority: 'high', assignee: 'Priya Patel' },
            { id: 'TASK-002', title: 'Setup MySQL Schema', status: 'done', priority: 'critical', assignee: 'Arjun Kumar' },
            { id: 'TASK-003', title: 'Build Kanban Board', status: 'in_progress', priority: 'high', assignee: 'Sneha Reddy' },
            { id: 'TASK-004', title: 'Implement OAuth Login', status: 'todo', priority: 'medium', assignee: 'Vikram Singh' },
            { id: 'TASK-005', title: 'Setup Git Workflow', status: 'todo', priority: 'low', assignee: 'Ananya Gupta' },
        ];

        tbody.innerHTML = tasks.map(task => `
            <tr style="cursor:pointer;" onclick="window.location.href='board.html'">
                <td><span class="jira-task-id">${task.id}</span> ${task.title}</td>
                <td><span class="jira-status jira-status-${task.status}">${task.status.replace('_', ' ')}</span></td>
                <td><span class="jira-priority jira-priority-${task.priority}">${task.priority}</span></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="jira-avatar" style="width:24px;height:24px;font-size:0.6rem;">${getInitials(task.assignee)}</div>
                        <span style="font-size:0.8rem;">${task.assignee}</span>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="color:var(--jira-danger);">Failed to load tasks</td></tr>';
    }
}

// ── Load Activity Feed ───────────────────────────────
async function loadActivityFeed() {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const activities = await API.get('/projects/' + getCurrentProjectId() + '/activity?limit=10');
        // ─────────────────────────────────────────────

        // TEMPORARY: Mock data
        const activities = [
            { actor: 'Rahul Sharma', action: 'created project', entity: 'Mini Jira Project', time: '2 hours ago', color: 'var(--jira-accent)' },
            { actor: 'Priya Patel', action: 'completed task', entity: 'Design Login Page', time: '1 hour ago', color: 'var(--jira-info)' },
            { actor: 'Sneha Reddy', action: 'started working on', entity: 'Build Kanban Board', time: '45 min ago', color: 'var(--jira-warning)' },
            { actor: 'Arjun Kumar', action: 'added comment on', entity: 'Setup MySQL Schema', time: '30 min ago', color: 'var(--jira-orange)' },
        ];

        feed.innerHTML = activities.map(a => `
            <div class="jira-activity-item">
                <div class="jira-activity-dot" style="background:${a.color};"></div>
                <div>
                    <div class="jira-activity-text"><strong>${a.actor}</strong> ${a.action} <strong>${a.entity}</strong></div>
                    <div class="jira-activity-time">${a.time}</div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        feed.innerHTML = '<div class="jira-empty"><p>Failed to load activity</p></div>';
    }
}

// ── Load Sidebar Projects ────────────────────────────
async function loadSidebarProjects() {
    const container = document.getElementById('sidebar-projects');
    if (!container) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const projects = await API.get('/projects');
        // ─────────────────────────────────────────────

        // TEMPORARY: Mock
        const projects = [
            { id: 'p1', name: 'Mini Jira Project', active: true }
        ];

        container.innerHTML = projects.map(p => `
            <a href="board.html?project=${p.id}" class="jira-sidebar-link ${p.active ? 'active' : ''}">
                <i class="bi bi-folder2${p.active ? '-open' : ''}"></i> ${p.name}
            </a>
        `).join('');

    } catch (error) {
        container.innerHTML = '<div style="padding:8px 12px; font-size:0.8rem; color:var(--jira-danger);">Error loading</div>';
    }
}

// ── Create Task Handler ──────────────────────────────
function openCreateTaskModal() {
    openModal('create-task-modal');
}

async function handleCreateTask(event) {
    event.preventDefault();

    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status')?.value || 'todo',
        assignee_id: document.getElementById('task-assignee').value || null,
        sprint_id: document.getElementById('task-sprint')?.value || null,
        due_date: document.getElementById('task-due-date').value || null,
        project_id: getCurrentProjectId()
    };

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const result = await API.post('/tasks', taskData);
        // closeModal('create-task-modal');
        // showToast('Task created successfully!', 'success');
        // loadRecentTasks();
        // ─────────────────────────────────────────────

        console.log('[Dashboard] Create task:', taskData);
        closeModal('create-task-modal');
        showToast('Task created! (Backend not connected yet)', 'warning');
        document.getElementById('create-task-form').reset();

    } catch (error) {
        showToast('Failed to create task: ' + error.message, 'error');
    }
}

// ── Create Project Handler ───────────────────────────
function openCreateProjectModal() {
    openModal('create-project-modal');
}

async function handleCreateProject(event) {
    event.preventDefault();

    const projectData = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value
    };

    try {
        const result = await API.post('/projects', projectData);
        closeModal('create-project-modal');
        showToast('Project created successfully!', 'success');
        loadSidebarProjects();
        document.getElementById('create-project-form')?.reset();
    } catch (error) {
        showToast('Failed to create project: ' + error.message, 'error');
    }
}
