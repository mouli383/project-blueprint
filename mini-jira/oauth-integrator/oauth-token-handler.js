// =====================================================
// Mini Jira — OAuth Token Handler (Frontend)
// Role: OAuth Integrator
// Reads token from URL after OAuth redirect
// =====================================================

(function() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', decodeURIComponent(userStr));
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
            console.log('[OAuth] Login successful via OAuth');
        } catch (e) {
            console.error('[OAuth] Failed to parse user data');
        }
    }
})();
