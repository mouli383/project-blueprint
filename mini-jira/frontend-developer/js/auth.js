// =====================================================
// Mini Jira — Auth Handler
// Role: Frontend Developer
// [PLACEHOLDER: Backend & OAuth Integrator will complete]
// =====================================================

// ── Check if user is logged in ───────────────────────
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // ── [BACKEND INTEGRATION POINT] ──────────────────
    // When backend is ready, validate token with server:
    // API.get('/auth/verify').catch(() => { logout(); });
    // ─────────────────────────────────────────────────

    // Skip auth check on login/register pages
    const page = window.location.pathname.split('/').pop();
    if (page === 'index.html' || page === 'register.html' || page === '') {
        // If already logged in, redirect to dashboard
        if (token && user) {
            window.location.href = 'dashboard.html';
        }
        return;
    }

    // If not logged in, redirect to login
    if (!token || !user) {
        // ── [TEMPORARY] ─────────────────────────────────
        // For frontend testing, we'll use a mock user
        // Remove this block when backend is connected
        const mockUser = {
            id: 'u1000001-aaaa-bbbb-cccc-000000000001',
            name: 'Rahul Sharma',
            email: 'rahul@example.com'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock-token-for-frontend-testing');
        // ─────────────────────────────────────────────────
    }

    // Set avatar initials
    try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const initialsEl = document.getElementById('avatar-initials');
        if (initialsEl && userData) {
            initialsEl.textContent = getInitials(userData.name);
        }
        const welcomeEl = document.getElementById('welcome-text');
        if (welcomeEl && userData) {
            welcomeEl.textContent = 'Welcome back, ' + userData.name.split(' ')[0] + '!';
        }
    } catch (e) {
        console.warn('[Auth] Could not parse user data');
    }
}

// ── Logout ───────────────────────────────────────────
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // ── [BACKEND INTEGRATION POINT] ──────────────────
    // API.post('/auth/logout', {}).catch(() => {});
    // ─────────────────────────────────────────────────
    window.location.href = 'index.html';
}

// ── Get current user ─────────────────────────────────
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        return null;
    }
}

// ── Get current project ID ───────────────────────────
function getCurrentProjectId() {
    // ── [BACKEND INTEGRATION POINT] ──────────────────
    // Get from URL params or localStorage
    // ─────────────────────────────────────────────────
    return localStorage.getItem('currentProjectId') || 'p2000001-aaaa-bbbb-cccc-000000000001';
}

// ── User Menu Toggle ─────────────────────────────────
function toggleUserMenu() {
    // Simple logout for now
    if (confirm('Do you want to logout?')) {
        logout();
    }
}

// ── OAuth Handlers ───────────────────────────────────
// [PLACEHOLDER: OAuth Integrator will implement these]
function handleGoogleLogin() {
    // window.location.href = '/oauth/google-login.php';
    showToast('Google OAuth - will be integrated', 'warning');
}

function handleGithubLogin() {
    // window.location.href = '/oauth/github-login.php';
    showToast('GitHub OAuth - will be integrated', 'warning');
}

function connectGoogle() {
    // [OAUTH INTEGRATION POINT]
    showToast('Google connect - will be integrated', 'warning');
}

function connectGithub() {
    // [OAUTH INTEGRATION POINT]
    showToast('GitHub connect - will be integrated', 'warning');
}

// ── Init auth on every page ──────────────────────────
document.addEventListener('DOMContentLoaded', checkAuth);
