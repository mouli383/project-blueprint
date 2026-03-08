// =====================================================
// Mini Jira — Activity Log Logic
// Role: Frontend Developer
// [PLACEHOLDER: Backend Developer will connect API/MongoDB]
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    loadActivity();
});

async function loadActivity() {
    const container = document.getElementById('activity-list');
    if (!container) return;

    try {
        // ── [BACKEND INTEGRATION POINT] ──────────────
        // const activities = await API.get('/projects/' + getCurrentProjectId() + '/activity');
        // ─────────────────────────────────────────────

        const activities = [
            { actor: 'Rahul Sharma', action: 'created project', entity: 'Mini Jira Project', type: 'project', time: '2026-03-01T10:00:00', color: 'var(--jira-accent)' },
            { actor: 'Rahul Sharma', action: 'created task', entity: 'Design Login Page', type: 'task', time: '2026-03-01T10:05:00', color: 'var(--jira-info)' },
            { actor: 'Priya Patel', action: 'completed task', entity: 'Design Login Page', type: 'task', time: '2026-03-02T14:30:00', color: 'var(--jira-accent)' },
            { actor: 'Arjun Kumar', action: 'completed task', entity: 'Setup MySQL Schema', type: 'task', time: '2026-03-02T16:00:00', color: 'var(--jira-accent)' },
            { actor: 'Sneha Reddy', action: 'started working on', entity: 'Build Kanban Board', type: 'task', time: '2026-03-03T09:00:00', color: 'var(--jira-warning)' },
            { actor: 'Sneha Reddy', action: 'added comment on', entity: 'Build Kanban Board', type: 'comment', time: '2026-03-03T11:30:00', color: 'var(--jira-orange)' },
            { actor: 'Rahul Sharma', action: 'created sprint', entity: 'Sprint 1', type: 'sprint', time: '2026-03-01T10:02:00', color: 'var(--jira-purple)' },
        ];

        activities.sort((a, b) => new Date(b.time) - new Date(a.time));

        container.innerHTML = activities.map(a => `
            <div class="jira-activity-item" data-type="${a.type}">
                <div class="jira-activity-dot" style="background:${a.color};"></div>
                <div>
                    <div class="jira-activity-text">
                        <strong>${a.actor}</strong> ${a.action} <strong>${a.entity}</strong>
                    </div>
                    <div class="jira-activity-time">${formatTime(a.time)}</div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = '<div class="jira-empty"><p>Failed to load activity</p></div>';
    }
}

function filterActivity(type) {
    const items = document.querySelectorAll('.jira-activity-item');
    items.forEach(item => {
        if (!type || item.dataset.type === type) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}
