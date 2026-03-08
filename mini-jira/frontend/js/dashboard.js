// =====================================================
// Mini Jira — Dashboard
// =====================================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    loadDashboard();
});

async function loadProjects() {
    try {
        const projects = await API.get('/projects.php');
        const sel = document.getElementById('projectSelector');
        if (!projects.length) {
            sel.innerHTML = '<option value="">No projects found</option>';
            return;
        }
        sel.innerHTML = projects.map(p =>
            `<option value="${p.id}" ${p.id === getProjectId() ? 'selected' : ''}>${p.name} (${p.project_key})</option>`
        ).join('');

        if (!getProjectId() && projects.length) {
            setProjectId(projects[0].id);
        }
    } catch (e) {
        showToast('Failed to load projects', 'error');
    }
}

function switchProject() {
    const sel = document.getElementById('projectSelector');
    setProjectId(sel.value);
    loadDashboard();
}

async function loadDashboard() {
    const pid = getProjectId();
    if (!pid) return;

    try {
        const data = await API.get('/dashboard.php?project_id=' + pid);

        document.getElementById('statTotal').textContent = data.stats.total_tasks;
        document.getElementById('statProgress').textContent = data.stats.in_progress;
        document.getElementById('statDone').textContent = data.stats.done_tasks;
        document.getElementById('statMembers').textContent = data.stats.member_count;

        const pct = data.stats.total_tasks ? Math.round((data.stats.done_tasks / data.stats.total_tasks) * 100) : 0;
        document.getElementById('progressBar').style.width = pct + '%';
        document.getElementById('progressPercent').textContent = pct + '%';

        // Recent tasks
        const tbody = document.getElementById('recentTasks');
        if (data.recent_tasks.length) {
            tbody.innerHTML = data.recent_tasks.map(t => `
                <tr>
                    <td><i class="bi ${getTypeIcon(t.task_type)}"></i> ${t.title}</td>
                    <td><span class="badge status-${t.status}">${t.status.replace('_',' ')}</span></td>
                    <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
                    <td>${t.assignee_name || '<span class="text-muted">Unassigned</span>'}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No tasks yet</td></tr>';
        }

        // Recent activity
        const actDiv = document.getElementById('recentActivity');
        if (data.recent_activity.length) {
            actDiv.innerHTML = data.recent_activity.map(a => `
                <div class="activity-item">
                    <div class="activity-dot action-${a.action}"></div>
                    <div>
                        <strong>${a.user_name}</strong> ${a.details || a.action + ' ' + a.entity_type}
                        <div class="text-muted" style="font-size:12px">${timeAgo(a.created_at)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            actDiv.innerHTML = '<p class="text-muted text-center">No activity yet</p>';
        }
    } catch (e) {
        showToast('Failed to load dashboard', 'error');
    }
}
