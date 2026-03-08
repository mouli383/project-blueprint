<?php
// =====================================================
// Mini Jira — Google OAuth Login
// Role: OAuth Integrator
// =====================================================
// SETUP: Register at https://console.cloud.google.com
// Create OAuth 2.0 credentials, set redirect URI to:
// http://localhost/mini-jira/oauth-integrator/google-callback.php
// =====================================================

session_start();
require_once __DIR__ . '/../backend-developer/config/db.php';

// ── OAuth Config ─────────────────────────────────────
define('GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID');
define('GOOGLE_CLIENT_SECRET', 'YOUR_GOOGLE_CLIENT_SECRET');
define('GOOGLE_REDIRECT_URI', 'http://localhost/mini-jira/oauth-integrator/google-callback.php');

// Step 1: Redirect to Google
$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
    'client_id' => GOOGLE_CLIENT_ID,
    'redirect_uri' => GOOGLE_REDIRECT_URI,
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'access_type' => 'offline',
    'state' => bin2hex(random_bytes(16))
]);

$_SESSION['oauth_state'] = $state ?? '';
header('Location: ' . $authUrl);
exit;
?>
