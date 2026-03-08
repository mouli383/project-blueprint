// =====================================================
// Mini Jira — Auth Handler
// =====================================================

function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const page = window.location.pathname.split('/').pop();

    if (page === 'index.html' || page === 'register.html' || page === '') {
        if (token && user) window.location.href = 'dashboard.html';
        return;
    }

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    // Set user info in sidebar
    try {
        const u = JSON.parse(user);
        const initEl = document.getElementById('avatar-initials');
        if (initEl) initEl.textContent = getInitials(u.name);
        const nameEl = document.getElementById('user-display-name');
        if (nameEl) nameEl.textContent = u.name;
        const welcomeEl = document.getElementById('welcome-text');
        if (welcomeEl) welcomeEl.textContent = 'Welcome back, ' + u.name.split(' ')[0] + '!';
    } catch (e) {}
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentProjectId');
    window.location.href = 'index.html';
}

function toggleUserMenu() {
    if (confirm('Do you want to logout?')) logout();
}

function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('user')); } catch (e) { return null; }
}

document.addEventListener('DOMContentLoaded', checkAuth);
