// =====================================================
// Mini Jira — Activity Log
// =====================================================

document.addEventListener('DOMContentLoaded', loadActivity);

async function loadActivity() {
    const pid = getProjectId();
    try {
        const endpoint = pid ? '/activity.php?project_id=' + pid : '/activity.php';
        const activities = await API.get(endpoint);
        const el = document.getElementById('activityList');

        if (!activities.length) {
            el.innerHTML = '<p class="text-muted text-center py-5">No activity yet</p>';
            return;
        }

        el.innerHTML = activities.map(a => `
            <div class="activity-item">
                <div class="activity-dot action-${a.action}"></div>
                <div class="flex-grow-1">
                    <div><strong>${a.user_name}</strong> ${a.details || (a.action + ' a ' + a.entity_type)}</div>
                    <small class="text-muted">${timeAgo(a.created_at)}</small>
                </div>
            </div>
        `).join('');
    } catch (e) {
        showToast('Failed to load activity', 'error');
    }
}
