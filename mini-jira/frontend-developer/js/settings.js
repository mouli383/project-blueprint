// =====================================================
// Mini Jira — Settings Logic
// Role: Frontend Developer
// [PLACEHOLDER: Backend Developer will connect APIs]
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    loadProfileSettings();
    loadProjectSettings();
});

async function loadProfileSettings() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById('settings-name').value = user.name || '';
    document.getElementById('settings-email').value = user.email || '';
    document.getElementById('settings-avatar').value = user.avatar_url || '';
}

async function loadProjectSettings() {
    // ── [BACKEND INTEGRATION POINT] ──────────────
    // const project = await API.get('/projects/' + getCurrentProjectId());
    // ─────────────────────────────────────────────

    document.getElementById('settings-project-name').value = 'Mini Jira Project';
    document.getElementById('settings-project-desc').value = 'Our academic full-stack project management tool';
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('settings-name').value,
        avatar_url: document.getElementById('settings-avatar').value
    };

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.put('/users/profile', data);
        // ─────────────────────────────────────────────
        const user = getCurrentUser();
        user.name = data.name;
        localStorage.setItem('user', JSON.stringify(user));
        showToast('Profile updated!', 'success');
    } catch (error) {
        showToast('Failed to update profile', 'error');
    }
}

async function handleUpdateProject(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('settings-project-name').value,
        description: document.getElementById('settings-project-desc').value
    };

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.put('/projects/' + getCurrentProjectId(), data);
        // ─────────────────────────────────────────────
        showToast('Project updated!', 'success');
    } catch (error) {
        showToast('Failed to update project', 'error');
    }
}

async function handleChangePassword(event) {
    event.preventDefault();
    const newPwd = document.getElementById('new-password').value;
    const confirmPwd = document.getElementById('confirm-password').value;

    if (newPwd !== confirmPwd) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.put('/users/password', {
        //     current_password: document.getElementById('current-password').value,
        //     new_password: newPwd
        // });
        // ─────────────────────────────────────────────
        showToast('Password updated!', 'success');
        document.getElementById('password-form').reset();
    } catch (error) {
        showToast('Failed to update password', 'error');
    }
}

function confirmDeleteProject() {
    if (confirm('⚠️ This will permanently delete the project and all its data. Are you sure?')) {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.delete('/projects/' + getCurrentProjectId());
        // window.location.href = 'dashboard.html';
        // ─────────────────────────────────────────────
        showToast('Project deletion (Backend not connected)', 'warning');
    }
}
