// =====================================================
// Mini Jira — API Helper
// =====================================================

const API = {
    // CHANGE THIS to your XAMPP URL:
    // e.g., 'http://localhost/mini-jira/api'
    BASE_URL: 'http://localhost/mini-jira/api',

    getToken() {
        return localStorage.getItem('token');
    },

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const token = this.getToken();
        if (token) headers['Authorization'] = 'Bearer ' + token;
        return headers;
    },

    async get(endpoint) {
        const res = await fetch(this.BASE_URL + endpoint, { headers: this.getHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    },

    async post(endpoint, body) {
        const res = await fetch(this.BASE_URL + endpoint, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    },

    async put(endpoint, body) {
        const res = await fetch(this.BASE_URL + endpoint, { method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    },

    async delete(endpoint) {
        const res = await fetch(this.BASE_URL + endpoint, { method: 'DELETE', headers: this.getHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    }
};

// Toast
function showToast(message, type = 'success') {
    const t = document.getElementById('toast');
    const m = document.getElementById('toast-message');
    if (!t || !m) return;
    t.className = 'app-toast show' + (type !== 'success' ? ' toast-' + type : '');
    m.textContent = message;
    setTimeout(() => t.classList.remove('show'), 3500);
}

// Modal
function openModal(id) { document.getElementById(id)?.classList.add('show'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }

// Sidebar
function toggleSidebar() { document.getElementById('sidebar')?.classList.toggle('open'); }

// Date formatting
function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(d) {
    if (!d) return '';
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    return Math.floor(hrs / 24) + 'd ago';
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
}

function getProjectId() {
    return localStorage.getItem('currentProjectId') || '';
}

function setProjectId(id) {
    localStorage.setItem('currentProjectId', id);
}

function getTypeIcon(type) {
    const icons = { story: 'bi-bookmark-fill type-story', bug: 'bi-bug-fill type-bug', task: 'bi-check2-square type-task', epic: 'bi-lightning-fill type-epic' };
    return icons[type] || icons.task;
}
