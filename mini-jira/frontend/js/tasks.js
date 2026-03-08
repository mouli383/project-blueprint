// =====================================================
// Mini Jira — Tasks
// =====================================================

let allTasks = [];

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadDropdowns();
});

async function loadDropdowns() {
    const pid = getProjectId();
    if (!pid) return;
    try {
        const [members, sprints] = await Promise.all([
            API.get('/members.php?project_id=' + pid),
            API.get('/sprints.php?project_id=' + pid)
        ]);
        const assignee = document.getElementById('taskAssignee');
        assignee.innerHTML = '<option value="">Unassigned</option>' + members.map(m => `<option value="${m.user_id}">${m.name}</option>`).join('');
        const sprint = document.getElementById('taskSprint');
        sprint.innerHTML = '<option value="">Backlog</option>' + sprints.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    } catch (e) {}
}

async function loadTasks() {
    const pid = getProjectId();
    if (!pid) {
        document.getElementById('taskList').innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Select a project first (go to Projects page)</td></tr>';
        return;
    }
    try {
        allTasks = await API.get('/tasks.php?project_id=' + pid);
        renderTasks();
    } catch (e) {
        showToast('Failed to load tasks', 'error');
    }
}

function renderTasks() {
    let tasks = [...allTasks];
    const status = document.getElementById('filterStatus').value;
    const priority = document.getElementById('filterPriority').value;
    const search = document.getElementById('filterSearch').value.toLowerCase();

    if (status) tasks = tasks.filter(t => t.status === status);
    if (priority) tasks = tasks.filter(t => t.priority === priority);
    if (search) tasks = tasks.filter(t => t.title.toLowerCase().includes(search));

    const tbody = document.getElementById('taskList');
    if (!tasks.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No tasks found</td></tr>';
        return;
    }

    tbody.innerHTML = tasks.map(t => `
        <tr style="cursor:pointer" onclick="viewTask('${t.id}')">
            <td><i class="bi ${getTypeIcon(t.task_type)}" title="${t.task_type}"></i></td>
            <td><strong>${t.title}</strong>${t.comment_count ? ' <span class="text-muted small"><i class="bi bi-chat"></i> '+t.comment_count+'</span>' : ''}</td>
            <td><span class="badge status-${t.status}">${t.status.replace('_',' ')}</span></td>
            <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
            <td>${t.assignee_name || '<span class="text-muted">-</span>'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="event.stopPropagation();editTask('${t.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation();deleteTask('${t.id}')" title="Delete"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function saveTask(e) {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const payload = {
        project_id: getProjectId(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDesc').value,
        task_type: document.getElementById('taskType').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        assignee_id: document.getElementById('taskAssignee').value || null,
        sprint_id: document.getElementById('taskSprint').value || null,
        due_date: document.getElementById('taskDue').value || null
    };
    try {
        if (id) {
            await API.put('/tasks.php?id=' + id, payload);
            showToast('Task updated');
        } else {
            await API.post('/tasks.php', payload);
            showToast('Task created');
        }
        closeModal('taskModal');
        loadTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function editTask(id) {
    const t = allTasks.find(x => x.id === id);
    if (!t) return;
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskId').value = t.id;
    document.getElementById('taskTitle').value = t.title;
    document.getElementById('taskDesc').value = t.description || '';
    document.getElementById('taskType').value = t.task_type;
    document.getElementById('taskPriority').value = t.priority;
    document.getElementById('taskStatus').value = t.status;
    document.getElementById('taskAssignee').value = t.assignee_id || '';
    document.getElementById('taskSprint').value = t.sprint_id || '';
    document.getElementById('taskDue').value = t.due_date || '';
    openModal('taskModal');
}

async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    try {
        await API.delete('/tasks.php?id=' + id);
        showToast('Task deleted');
        loadTasks();
    } catch (e) { showToast(e.message, 'error'); }
}

async function viewTask(id) {
    try {
        const t = await API.get('/tasks.php?id=' + id);
        document.getElementById('detailTitle').textContent = t.title;
        document.getElementById('commentTaskId').value = t.id;
        document.getElementById('taskDetailContent').innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <p>${t.description || '<span class="text-muted">No description</span>'}</p>
                </div>
                <div class="col-md-4">
                    <p><strong>Status:</strong> <span class="badge status-${t.status}">${t.status.replace('_',' ')}</span></p>
                    <p><strong>Priority:</strong> <span class="badge badge-${t.priority}">${t.priority}</span></p>
                    <p><strong>Type:</strong> <i class="bi ${getTypeIcon(t.task_type)}"></i> ${t.task_type}</p>
                    <p><strong>Assignee:</strong> ${t.assignee_name || 'Unassigned'}</p>
                    <p><strong>Reporter:</strong> ${t.reporter_name || '-'}</p>
                    <p><strong>Due:</strong> ${formatDate(t.due_date)}</p>
                </div>
            </div>
        `;
        renderComments(t.comments || []);
        openModal('taskDetailModal');
    } catch (e) { showToast(e.message, 'error'); }
}

function renderComments(comments) {
    const el = document.getElementById('commentList');
    if (!comments.length) { el.innerHTML = '<p class="text-muted small">No comments yet</p>'; return; }
    el.innerHTML = comments.map(c => `
        <div class="comment-item">
            <div class="comment-meta"><strong>${c.user_name}</strong> · ${timeAgo(c.created_at)}</div>
            <div>${c.content}</div>
        </div>
    `).join('');
}

async function addComment(e) {
    e.preventDefault();
    const taskId = document.getElementById('commentTaskId').value;
    const content = document.getElementById('commentInput').value;
    try {
        await API.post('/comments.php', { task_id: taskId, content });
        document.getElementById('commentInput').value = '';
        const comments = await API.get('/comments.php?task_id=' + taskId);
        renderComments(comments);
        showToast('Comment added');
    } catch (err) { showToast(err.message, 'error'); }
}

// Reset form when opening for new task
document.querySelector('[onclick*="taskModal"]')?.addEventListener('click', () => {
    document.getElementById('taskModalTitle').textContent = 'Create Task';
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDesc').value = '';
    document.getElementById('taskType').value = 'task';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskStatus').value = 'todo';
    document.getElementById('taskAssignee').value = '';
    document.getElementById('taskSprint').value = '';
    document.getElementById('taskDue').value = '';
});
