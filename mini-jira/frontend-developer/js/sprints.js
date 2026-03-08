// =====================================================
// Mini Jira — Sprints Logic
// Role: Frontend Developer
// [PLACEHOLDER: Backend Developer will connect real APIs]
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    loadSprints();
});

async function loadSprints() {
    // ── [BACKEND INTEGRATION POINT] ──────────────
    // const sprints = await API.get('/projects/' + getCurrentProjectId() + '/sprints');
    // renderSprints(sprints);
    // ─────────────────────────────────────────────

    // Using the static HTML sprint for now
    console.log('[Sprints] Loaded with mock data');
}

function openCreateSprintModal() {
    openModal('create-sprint-modal');
}

async function handleCreateSprint(event) {
    event.preventDefault();

    const sprintData = {
        name: document.getElementById('sprint-name').value,
        goal: document.getElementById('sprint-goal').value,
        start_date: document.getElementById('sprint-start').value,
        end_date: document.getElementById('sprint-end').value,
        project_id: getCurrentProjectId()
    };

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.post('/sprints', sprintData);
        // closeModal('create-sprint-modal');
        // showToast('Sprint created!', 'success');
        // loadSprints();
        // ─────────────────────────────────────────────

        console.log('[Sprints] Create sprint:', sprintData);
        closeModal('create-sprint-modal');
        showToast('Sprint created (Backend not connected)', 'warning');

    } catch (error) {
        showToast('Failed to create sprint', 'error');
    }
}
