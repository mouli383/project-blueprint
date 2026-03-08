// =====================================================
// Mini Jira — Members Logic
// Role: Frontend Developer
// [PLACEHOLDER: Backend Developer will connect real APIs]
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
});

async function loadMembers() {
    const tbody = document.getElementById('members-table-body');
    if (!tbody) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const members = await API.get('/projects/' + getCurrentProjectId() + '/members');
        // ─────────────────────────────────────────────

        const members = [
            { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'owner', joined: '2026-03-01' },
            { name: 'Priya Patel', email: 'priya@example.com', role: 'admin', joined: '2026-03-01' },
            { name: 'Arjun Kumar', email: 'arjun@example.com', role: 'member', joined: '2026-03-01' },
            { name: 'Sneha Reddy', email: 'sneha@example.com', role: 'member', joined: '2026-03-02' },
            { name: 'Vikram Singh', email: 'vikram@example.com', role: 'member', joined: '2026-03-02' },
            { name: 'Ananya Gupta', email: 'ananya@example.com', role: 'member', joined: '2026-03-02' },
        ];

        tbody.innerHTML = members.map(m => `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="jira-avatar" style="width:28px;height:28px;font-size:0.6rem;">${getInitials(m.name)}</div>
                        <span style="font-weight:600; color:var(--jira-text);">${m.name}</span>
                    </div>
                </td>
                <td>${m.email}</td>
                <td><span class="jira-sprint-badge ${m.role === 'owner' ? 'jira-sprint-active' : m.role === 'admin' ? 'jira-sprint-completed' : 'jira-sprint-planned'}">${m.role}</span></td>
                <td style="font-size:0.8rem;">${formatDate(m.joined)}</td>
                <td>
                    ${m.role !== 'owner' ? `<button class="jira-btn jira-btn-outline jira-btn-sm" onclick="removeMember('${m.email}')"><i class="bi bi-x-lg"></i></button>` : ''}
                </td>
            </tr>
        `).join('');

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="color:var(--jira-danger);">Failed to load members</td></tr>';
    }
}

function openInviteModal() {
    openModal('invite-modal');
}

async function handleInvite(event) {
    event.preventDefault();
    const email = document.getElementById('invite-email').value;
    const role = document.getElementById('invite-role').value;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // await API.post('/projects/' + getCurrentProjectId() + '/members', { email, role });
        // ─────────────────────────────────────────────

        console.log('[Members] Invite:', { email, role });
        closeModal('invite-modal');
        showToast('Invitation sent (Backend not connected)', 'warning');

    } catch (error) {
        showToast('Failed to send invite', 'error');
    }
}

async function removeMember(email) {
    if (!confirm('Remove this member from the project?')) return;

    // ── [BACKEND INTEGRATION POINT] ──────────────
    // await API.delete('/projects/' + getCurrentProjectId() + '/members/' + memberId);
    // loadMembers();
    // ─────────────────────────────────────────────

    showToast('Member removed (Backend not connected)', 'warning');
}
