// =====================================================
// Mini Jira — Tasks List Logic
// Role: Frontend Developer
// [PLACEHOLDER: Backend Developer will connect real APIs]
// =====================================================

let allTasks = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAllTasks();
});

async function loadAllTasks() {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // allTasks = await API.get('/projects/' + getCurrentProjectId() + '/tasks');
        // ─────────────────────────────────────────────

        // TEMPORARY: Mock data
        allTasks = [
            { id: 'TASK-001', title: 'Design Login Page', status: 'done', priority: 'high', assignee: 'Priya Patel', due_date: null },
            { id: 'TASK-002', title: 'Setup MySQL Schema', status: 'done', priority: 'critical', assignee: 'Arjun Kumar', due_date: null },
            { id: 'TASK-003', title: 'Build Kanban Board', status: 'in_progress', priority: 'high', assignee: 'Sneha Reddy', due_date: '2026-03-12' },
            { id: 'TASK-004', title: 'Implement OAuth Login', status: 'todo', priority: 'medium', assignee: 'Vikram Singh', due_date: '2026-03-14' },
            { id: 'TASK-005', title: 'Setup Git Workflow', status: 'todo', priority: 'low', assignee: 'Ananya Gupta', due_date: null },
        ];

        renderTasksTable(allTasks);

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="color:var(--jira-danger);">Failed to load tasks</td></tr>';
    }
}

function renderTasksTable(tasks) {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;

    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding:40px; color:var(--jira-text-dim);">No tasks found</td></tr>';
        return;
    }

    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td><span class="jira-task-id">${task.id}</span></td>
            <td style="font-weight:600; color:var(--jira-text);">${task.title}</td>
            <td><span class="jira-status jira-status-${task.status}">${task.status.replace('_', ' ')}</span></td>
            <td><span class="jira-priority jira-priority-${task.priority}">${task.priority}</span></td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="jira-avatar" style="width:22px;height:22px;font-size:0.55rem;">${getInitials(task.assignee)}</div>
                    <span style="font-size:0.8rem;">${task.assignee}</span>
                </div>
            </td>
            <td style="font-size:0.8rem;">${task.due_date ? formatDate(task.due_date) : '-'}</td>
            <td>
                <button class="jira-btn jira-btn-outline jira-btn-sm" onclick="window.location.href='board.html'" title="View on board">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function applyFilters() {
    const statusFilter = document.getElementById('filter-status').value;
    const priorityFilter = document.getElementById('filter-priority').value;

    let filtered = [...allTasks];
    if (statusFilter) filtered = filtered.filter(t => t.status === statusFilter);
    if (priorityFilter) filtered = filtered.filter(t => t.priority === priorityFilter);

    renderTasksTable(filtered);
}

function filterTasks(searchText) {
    if (!searchText) {
        renderTasksTable(allTasks);
        return;
    }
    const filtered = allTasks.filter(t =>
        t.title.toLowerCase().includes(searchText.toLowerCase()) ||
        t.id.toLowerCase().includes(searchText.toLowerCase())
    );
    renderTasksTable(filtered);
}

function openCreateTaskModal() {
    window.location.href = 'board.html';
}
