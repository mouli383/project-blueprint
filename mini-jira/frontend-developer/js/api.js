// =====================================================
// Mini Jira — API Helper
// Role: Frontend Developer
// [PLACEHOLDER: Backend Developer will set the real BASE_URL]
// =====================================================

const API = {
    // ── [BACKEND INTEGRATION POINT] ──────────────────
    // Change this to your actual server URL when backend is ready:
    // BASE_URL: 'http://localhost:3000/api'
    // For PHP endpoints: 'http://localhost/mini-jira/backend-developer/php'
    // ─────────────────────────────────────────────────
    BASE_URL: 'http://localhost:3000/api',

    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem('token');
    },

    // Set default headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        return headers;
    },

    // ── GET Request ──────────────────────────────────
    async get(endpoint) {
        try {
            const response = await fetch(this.BASE_URL + endpoint, {
                method: 'GET',
                headers: this.getHeaders()
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('[API GET]', endpoint, error);
            throw error;
        }
    },

    // ── POST Request ─────────────────────────────────
    async post(endpoint, data) {
        try {
            const response = await fetch(this.BASE_URL + endpoint, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('[API POST]', endpoint, error);
            throw error;
        }
    },

    // ── PUT Request ──────────────────────────────────
    async put(endpoint, data) {
        try {
            const response = await fetch(this.BASE_URL + endpoint, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('[API PUT]', endpoint, error);
            throw error;
        }
    },

    // ── DELETE Request ───────────────────────────────
    async delete(endpoint) {
        try {
            const response = await fetch(this.BASE_URL + endpoint, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('[API DELETE]', endpoint, error);
            throw error;
        }
    }
};

// ── Toast Notification ───────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;

    // Remove old type classes
    toast.classList.remove('jira-toast-success', 'jira-toast-error', 'jira-toast-warning');
    toast.classList.add('jira-toast-' + type);

    msgEl.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ── Modal Helpers ────────────────────────────────────
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

// ── Sidebar Toggle (mobile) ─────────────────────────
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

// ── Format Date ──────────────────────────────────────
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    return formatDate(dateStr);
}

// ── Get Initials ─────────────────────────────────────
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
}
