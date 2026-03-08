// =====================================================
// Mini Jira — Kanban Board
// =====================================================

let boardTasks = [];

document.addEventListener('DOMContentLoaded', loadBoard);

async function loadBoard() {
    const pid = getProjectId();
    if (!pid) {
        showToast('Select a project first', 'warning');
        return;
    }
    try {
        boardTasks = await API.get('/tasks.php?project_id=' + pid);
        renderBoard();
    } catch (e) {
        showToast('Failed to load board', 'error');
    }
}

function renderBoard() {
    const cols = { todo: [], in_progress: [], review: [], done: [] };
    boardTasks.forEach(t => { if (cols[t.status]) cols[t.status].push(t); });

    document.getElementById('countTodo').textContent = cols.todo.length;
    document.getElementById('countProgress').textContent = cols.in_progress.length;
    document.getElementById('countReview').textContent = cols.review.length;
    document.getElementById('countDone').textContent = cols.done.length;

    document.getElementById('colTodo').innerHTML = cols.todo.map(cardHTML).join('') || emptyCol();
    document.getElementById('colProgress').innerHTML = cols.in_progress.map(cardHTML).join('') || emptyCol();
    document.getElementById('colReview').innerHTML = cols.review.map(cardHTML).join('') || emptyCol();
    document.getElementById('colDone').innerHTML = cols.done.map(cardHTML).join('') || emptyCol();
}

function cardHTML(t) {
    return `
        <div class="board-card" draggable="true" ondragstart="dragTask(event,'${t.id}')" id="card-${t.id}">
            <div class="task-title"><i class="bi ${getTypeIcon(t.task_type)} me-1"></i>${t.title}</div>
            <div class="task-meta">
                <span class="badge badge-${t.priority}">${t.priority}</span>
                <span>${t.assignee_name ? getInitials(t.assignee_name) : '-'}</span>
            </div>
        </div>
    `;
}

function emptyCol() {
    return '<div class="text-center text-muted small py-4">No tasks</div>';
}

function dragTask(e, id) {
    e.dataTransfer.setData('text/plain', id);
}

async function dropTask(e, newStatus) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    try {
        await API.put('/tasks.php?id=' + id, { status: newStatus });
        // Update local state
        const task = boardTasks.find(t => t.id === id);
        if (task) task.status = newStatus;
        renderBoard();
        showToast('Task moved to ' + newStatus.replace('_', ' '));
    } catch (err) {
        showToast(err.message, 'error');
    }
}
