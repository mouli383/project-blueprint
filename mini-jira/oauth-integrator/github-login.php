<?php
// =====================================================
// Mini Jira — GitHub OAuth Login
// Role: OAuth Integrator
// =====================================================
// SETUP: Register at https://github.com/settings/developers
// Set callback URL to:
// http://localhost/mini-jira/oauth-integrator/github-callback.php
// =====================================================

session_start();

define('GITHUB_CLIENT_ID', 'YOUR_GITHUB_CLIENT_ID');
define('GITHUB_REDIRECT_URI', 'http://localhost/mini-jira/oauth-integrator/github-callback.php');

$authUrl = 'https://github.com/login/oauth/authorize?' . http_build_query([
    'client_id' => GITHUB_CLIENT_ID,
    'redirect_uri' => GITHUB_REDIRECT_URI,
    'scope' => 'user:email read:user',
    'state' => bin2hex(random_bytes(16))
]);

header('Location: ' . $authUrl);
exit;
?>
