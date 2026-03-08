// =====================================================
// Mini Jira — Projects
// =====================================================

document.addEventListener('DOMContentLoaded', loadProjectList);

async function loadProjectList() {
    try {
        const projects = await API.get('/projects.php');
        const container = document.getElementById('projectList');

        if (!projects.length) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="bi bi-folder fs-1 d-block mb-2"></i>No projects yet. Create your first project!</div>';
            return;
        }

        container.innerHTML = projects.map(p => `
            <div class="col-md-6 col-lg-4">
                <div class="project-card" onclick="selectProject('${p.id}')">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">${p.name}</h6>
                        <span class="project-key">${p.project_key}</span>
                    </div>
                    <p class="text-muted small mb-3">${p.description || 'No description'}</p>
                    <div class="d-flex justify-content-between text-muted small">
                        <span><i class="bi bi-check2-square"></i> ${p.task_count || 0} tasks</span>
                        <span><i class="bi bi-people"></i> ${p.member_count || 0} members</span>
                    </div>
                    <div class="mt-2 d-flex gap-1">
                        <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation();deleteProject('${p.id}')"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        showToast('Failed to load projects', 'error');
    }
}

function selectProject(id) {
    setProjectId(id);
    window.location.href = 'dashboard.html';
}

async function createProject(e) {
    e.preventDefault();
    try {
        await API.post('/projects.php', {
            name: document.getElementById('projName').value,
            project_key: document.getElementById('projKey').value,
            description: document.getElementById('projDesc').value
        });
        closeModal('projectModal');
        showToast('Project created!');
        loadProjectList();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('Delete this project and all its data?')) return;
    try {
        await API.delete('/projects.php?id=' + id);
        showToast('Project deleted');
        loadProjectList();
    } catch (e) {
        showToast(e.message, 'error');
    }
}
