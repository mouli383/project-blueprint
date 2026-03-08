// =====================================================
// Mini Jira — Sprints
// =====================================================

document.addEventListener('DOMContentLoaded', loadSprints);

async function loadSprints() {
    const pid = getProjectId();
    if (!pid) {
        document.getElementById('sprintList').innerHTML = '<p class="text-muted text-center py-5">Select a project first</p>';
        return;
    }
    try {
        const sprints = await API.get('/sprints.php?project_id=' + pid);
        const el = document.getElementById('sprintList');

        if (!sprints.length) {
            el.innerHTML = '<div class="text-center text-muted py-5"><i class="bi bi-arrow-repeat fs-1 d-block mb-2"></i>No sprints yet</div>';
            return;
        }

        el.innerHTML = sprints.map(s => {
            const pct = s.task_count ? Math.round((s.done_count / s.task_count) * 100) : 0;
            return `
                <div class="sprint-card sprint-${s.status}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h6 class="mb-1">${s.name}</h6>
                            <small class="text-muted">${s.goal || 'No goal set'}</small>
                        </div>
                        <div class="d-flex gap-1 align-items-center">
                            <span class="badge bg-${s.status === 'active' ? 'success' : s.status === 'planning' ? 'warning' : 'secondary'}">${s.status}</span>
                            <button class="btn btn-sm btn-outline-primary" onclick="editSprint('${s.id}')"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteSprint('${s.id}')"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                    <div class="d-flex gap-3 text-muted small mb-2">
                        <span><i class="bi bi-calendar"></i> ${formatDate(s.start_date)} – ${formatDate(s.end_date)}</span>
                        <span><i class="bi bi-check2-square"></i> ${s.done_count}/${s.task_count} tasks</span>
                    </div>
                    <div class="progress" style="height:6px">
                        <div class="progress-bar bg-success" style="width:${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        showToast('Failed to load sprints', 'error');
    }
}

async function saveSprint(e) {
    e.preventDefault();
    const id = document.getElementById('sprintId').value;
    const data = {
        project_id: getProjectId(),
        name: document.getElementById('sprintName').value,
        goal: document.getElementById('sprintGoal').value,
        start_date: document.getElementById('sprintStart').value || null,
        end_date: document.getElementById('sprintEnd').value || null,
        status: document.getElementById('sprintStatus').value
    };
    try {
        if (id) {
            await API.put('/sprints.php?id=' + id, data);
            showToast('Sprint updated');
        } else {
            await API.post('/sprints.php', data);
            showToast('Sprint created');
        }
        closeModal('sprintModal');
        loadSprints();
    } catch (err) { showToast(err.message, 'error'); }
}

async function editSprint(id) {
    try {
        const s = await API.get('/sprints.php?id=' + id);
        document.getElementById('sprintModalTitle').textContent = 'Edit Sprint';
        document.getElementById('sprintId').value = s.id;
        document.getElementById('sprintName').value = s.name;
        document.getElementById('sprintGoal').value = s.goal || '';
        document.getElementById('sprintStart').value = s.start_date || '';
        document.getElementById('sprintEnd').value = s.end_date || '';
        document.getElementById('sprintStatus').value = s.status;
        openModal('sprintModal');
    } catch (e) { showToast(e.message, 'error'); }
}

async function deleteSprint(id) {
    if (!confirm('Delete this sprint?')) return;
    try {
        await API.delete('/sprints.php?id=' + id);
        showToast('Sprint deleted');
        loadSprints();
    } catch (e) { showToast(e.message, 'error'); }
}

// Reset form for new sprint
document.querySelector('[onclick*="sprintModal"]')?.addEventListener('click', () => {
    document.getElementById('sprintModalTitle').textContent = 'Create Sprint';
    document.getElementById('sprintId').value = '';
    document.getElementById('sprintName').value = '';
    document.getElementById('sprintGoal').value = '';
    document.getElementById('sprintStart').value = '';
    document.getElementById('sprintEnd').value = '';
    document.getElementById('sprintStatus').value = 'planning';
});
