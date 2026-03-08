// =====================================================
// Mini Jira — Kanban Board Logic
// Role: Frontend Developer
// Features: Drag & Drop, Task CRUD
// [PLACEHOLDER: Backend Developer will connect real APIs]
// =====================================================

let boardTasks = [];
let draggedTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadBoardTasks();
    loadSprintFilter();
});

// ── Load Board Tasks ─────────────────────────────────
async function loadBoardTasks() {
    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // boardTasks = await API.get('/projects/' + getCurrentProjectId() + '/tasks');
        // ─────────────────────────────────────────────

        // TEMPORARY: Mock data
        boardTasks = [
            { id: 't1', title: 'Design Login Page', description: 'Create HTML/CSS login page with Bootstrap', status: 'done', priority: 'high', assignee_name: 'Priya Patel', reporter_name: 'Rahul Sharma', due_date: null, sprint_id: 's1' },
            { id: 't2', title: 'Setup MySQL Schema', description: 'Create all tables in phpMyAdmin', status: 'done', priority: 'critical', assignee_name: 'Arjun Kumar', reporter_name: 'Rahul Sharma', due_date: null, sprint_id: 's1' },
            { id: 't3', title: 'Build Kanban Board', description: 'Implement drag-and-drop task board', status: 'in_progress', priority: 'high', assignee_name: 'Sneha Reddy', reporter_name: 'Rahul Sharma', due_date: '2026-03-12', sprint_id: 's1' },
            { id: 't4', title: 'Implement OAuth Login', description: 'Google OAuth integration', status: 'todo', priority: 'medium', assignee_name: 'Vikram Singh', reporter_name: 'Rahul Sharma', due_date: '2026-03-14', sprint_id: 's1' },
            { id: 't5', title: 'Setup Git Workflow', description: 'Configure branches and webhooks', status: 'todo', priority: 'low', assignee_name: 'Ananya Gupta', reporter_name: 'Rahul Sharma', due_date: null, sprint_id: null },
        ];

        renderBoard();

    } catch (error) {
        console.error('[Board] Failed to load tasks:', error);
        showToast('Failed to load board tasks', 'error');
    }
}

// ── Render Kanban Board ──────────────────────────────
function renderBoard(filterText = '') {
    const statuses = ['todo', 'in_progress', 'done'];

    statuses.forEach(status => {
        const col = document.getElementById('col-' + status);
        const count = document.getElementById('count-' + (status === 'in_progress' ? 'progress' : status));
        if (!col) return;

        let tasks = boardTasks.filter(t => t.status === status);

        // Apply search filter
        if (filterText) {
            tasks = tasks.filter(t =>
                t.title.toLowerCase().includes(filterText.toLowerCase())
            );
        }

        if (count) count.textContent = tasks.length;

        if (tasks.length === 0) {
            col.innerHTML = '<div class="jira-empty" style="padding:20px;"><p>No tasks</p></div>';
            return;
        }

        col.innerHTML = tasks.map(task => `
            <div class="jira-task-card" draggable="true"
                 data-task-id="${task.id}"
                 ondragstart="handleDragStart(event, '${task.id}')"
                 ondragend="handleDragEnd(event)"
                 onclick="openTaskDetail('${task.id}')">
                <div class="jira-task-title">${task.title}</div>
                <div class="jira-task-meta">
                    <span class="jira-priority jira-priority-${task.priority}">${task.priority}</span>
                    <div class="d-flex align-items-center gap-2">
                        ${task.due_date ? `<span style="font-size:0.7rem; color:var(--jira-text-dim);"><i class="bi bi-calendar"></i> ${formatDate(task.due_date)}</span>` : ''}
                        ${task.assignee_name ? `<div class="jira-avatar" style="width:22px;height:22px;font-size:0.55rem;" title="${task.assignee_name}">${getInitials(task.assignee_name)}</div>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// ── Drag & Drop ──────────────────────────────────────
function handleDragStart(event, taskId) {
    draggedTaskId = taskId;
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    draggedTaskId = null;
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

async function handleDrop(event, newStatus) {
    event.preventDefault();
    if (!draggedTaskId) return;

    const task = boardTasks.find(t => t.id === draggedTaskId);
    if (!task || task.status === newStatus) return;

    const oldStatus = task.status;
    task.status = newStatus;
    renderBoard();

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.put('/tasks/' + draggedTaskId, { status: newStatus });
        // ─────────────────────────────────────────────

        console.log(`[Board] Moved task ${draggedTaskId}: ${oldStatus} → ${newStatus}`);
        showToast(`Task moved to ${newStatus.replace('_', ' ')}`, 'success');

    } catch (error) {
        // Revert on failure
        task.status = oldStatus;
        renderBoard();
        showToast('Failed to update task', 'error');
    }
}

// ── Task Detail ──────────────────────────────────────
let currentDetailTaskId = null;

function openTaskDetail(taskId) {
    const task = boardTasks.find(t => t.id === taskId);
    if (!task) return;

    currentDetailTaskId = taskId;

    document.getElementById('detail-task-title').textContent = task.title;
    document.getElementById('detail-task-desc').textContent = task.description || 'No description';
    document.getElementById('detail-status').value = task.status;
    document.getElementById('detail-assignee').textContent = task.assignee_name || 'Unassigned';
    document.getElementById('detail-reporter').textContent = task.reporter_name || '-';
    document.getElementById('detail-due').textContent = task.due_date ? formatDate(task.due_date) : 'No due date';

    const priorityEl = document.getElementById('detail-priority');
    priorityEl.textContent = task.priority;
    priorityEl.className = 'jira-priority jira-priority-' + task.priority;

    // Load comments
    loadTaskComments(taskId);

    // Load commits
    // ── [GIT INTEGRATOR INTEGRATION POINT] ───────────
    // loadTaskCommits(taskId);
    // ─────────────────────────────────────────────────

    openModal('task-detail-modal');
}

// ── Update Task Status from Detail ───────────────────
async function updateTaskStatus() {
    if (!currentDetailTaskId) return;
    const newStatus = document.getElementById('detail-status').value;
    const task = boardTasks.find(t => t.id === currentDetailTaskId);
    if (!task) return;

    task.status = newStatus;
    renderBoard();

    // ── [BACKEND INTEGRATION POINT] ──────────────
    // await API.put('/tasks/' + currentDetailTaskId, { status: newStatus });
    // ─────────────────────────────────────────────
    showToast('Status updated', 'success');
}

// ── Delete Task ──────────────────────────────────────
async function deleteTask() {
    if (!currentDetailTaskId) return;
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.delete('/tasks/' + currentDetailTaskId);
        // ─────────────────────────────────────────────

        boardTasks = boardTasks.filter(t => t.id !== currentDetailTaskId);
        renderBoard();
        closeModal('task-detail-modal');
        showToast('Task deleted', 'success');

    } catch (error) {
        showToast('Failed to delete task', 'error');
    }
}

// ── Comments ─────────────────────────────────────────
async function loadTaskComments(taskId) {
    const container = document.getElementById('detail-comments');
    if (!container) return;

    // ── [BACKEND INTEGRATION POINT] ──────────────
    // const comments = await API.get('/tasks/' + taskId + '/comments');
    // ─────────────────────────────────────────────

    // TEMPORARY: Mock
    const comments = [
        { author: 'Priya Patel', body: 'Looking good! Almost done.', time: '1 hour ago' }
    ];

    if (comments.length === 0) {
        container.innerHTML = '<div class="jira-empty" style="padding:10px;"><p>No comments yet</p></div>';
        return;
    }

    container.innerHTML = comments.map(c => `
        <div class="jira-comment">
            <div class="jira-avatar" style="width:28px;height:28px;font-size:0.6rem;">${getInitials(c.author)}</div>
            <div class="jira-comment-body">
                <span class="jira-comment-author">${c.author}</span>
                <span class="jira-comment-time">${c.time}</span>
                <p class="jira-comment-text">${c.body}</p>
            </div>
        </div>
    `).join('');
}

async function addComment() {
    const input = document.getElementById('comment-input');
    if (!input || !input.value.trim()) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.post('/tasks/' + currentDetailTaskId + '/comments', {
        //     body: input.value
        // });
        // loadTaskComments(currentDetailTaskId);
        // ─────────────────────────────────────────────

        console.log('[Board] Add comment:', input.value);
        showToast('Comment added (Backend not connected)', 'warning');
        input.value = '';

    } catch (error) {
        showToast('Failed to add comment', 'error');
    }
}

// ── Sprint Filter ────────────────────────────────────
async function loadSprintFilter() {
    // ── [BACKEND INTEGRATION POINT] ──────────────
    // const sprints = await API.get('/projects/' + getCurrentProjectId() + '/sprints');
    // ─────────────────────────────────────────────
    const select = document.getElementById('sprint-filter');
    if (select) {
        select.innerHTML = '<option value="">All Sprints</option><option value="s1">Sprint 1</option>';
    }
}

function filterBySprint(sprintId) {
    // Filter logic when backend is ready
    console.log('[Board] Filter by sprint:', sprintId);
}

function filterBoardTasks(text) {
    renderBoard(text);
}

// ── Create Task from Board ───────────────────────────
function openCreateTaskModal() {
    openModal('create-task-modal');
}

async function handleCreateTask(event) {
    event.preventDefault();

    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        status: 'todo',
        assignee_id: document.getElementById('task-assignee').value || null,
        due_date: document.getElementById('task-due-date').value || null,
        project_id: getCurrentProjectId()
    };

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const result = await API.post('/tasks', taskData);
        // ─────────────────────────────────────────────

        // TEMPORARY: Add to local array
        boardTasks.push({
            id: 't' + Date.now(),
            ...taskData,
            assignee_name: 'You',
            reporter_name: getCurrentUser()?.name || 'Unknown'
        });

        renderBoard();
        closeModal('create-task-modal');
        showToast('Task created!', 'success');
        document.getElementById('create-task-form').reset();

    } catch (error) {
        showToast('Failed to create task', 'error');
    }
}

function refreshBoard() {
    loadBoardTasks();
    showToast('Board refreshed', 'success');
}
