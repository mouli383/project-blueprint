// =====================================================
// Mini Jira — Members
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    loadAllUsers();
});

async function loadMembers() {
    const pid = getProjectId();
    if (!pid) {
        document.getElementById('memberList').innerHTML = '<div class="col-12 text-center text-muted py-5">Select a project first</div>';
        return;
    }
    try {
        const members = await API.get('/members.php?project_id=' + pid);
        const el = document.getElementById('memberList');

        if (!members.length) {
            el.innerHTML = '<div class="col-12 text-center text-muted py-5">No members yet</div>';
            return;
        }

        el.innerHTML = members.map(m => `
            <div class="col-md-4 col-lg-3">
                <div class="member-card">
                    <div class="member-avatar">${getInitials(m.name)}</div>
                    <h6>${m.name}</h6>
                    <p class="text-muted small mb-2">${m.email}</p>
                    <span class="badge bg-${m.role === 'owner' ? 'primary' : m.role === 'admin' ? 'warning' : 'secondary'}">${m.role}</span>
                    ${m.role !== 'owner' ? `<div class="mt-2"><button class="btn btn-sm btn-outline-danger" onclick="removeMember('${m.id}')"><i class="bi bi-person-dash"></i></button></div>` : ''}
                </div>
            </div>
        `).join('');
    } catch (e) {
        showToast('Failed to load members', 'error');
    }
}

async function loadAllUsers() {
    try {
        const users = await API.get('/members.php');
        const sel = document.getElementById('memberUser');
        sel.innerHTML = users.map(u => `<option value="${u.id}">${u.name} (${u.email})</option>`).join('');
    } catch (e) {}
}

async function addMember(e) {
    e.preventDefault();
    try {
        await API.post('/members.php', {
            project_id: getProjectId(),
            user_id: document.getElementById('memberUser').value,
            role: document.getElementById('memberRole').value
        });
        closeModal('memberModal');
        showToast('Member added');
        loadMembers();
    } catch (err) { showToast(err.message, 'error'); }
}

async function removeMember(id) {
    if (!confirm('Remove this member?')) return;
    try {
        await API.delete('/members.php?id=' + id);
        showToast('Member removed');
        loadMembers();
    } catch (e) { showToast(e.message, 'error'); }
}
