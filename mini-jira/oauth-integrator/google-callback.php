<?php
// =====================================================
// Mini Jira — Google OAuth Callback
// Role: OAuth Integrator
// =====================================================

session_start();
require_once __DIR__ . '/../backend-developer/config/db.php';

define('GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID');
define('GOOGLE_CLIENT_SECRET', 'YOUR_GOOGLE_CLIENT_SECRET');
define('GOOGLE_REDIRECT_URI', 'http://localhost/mini-jira/oauth-integrator/google-callback.php');

if (!isset($_GET['code'])) {
    die('Authorization failed: no code received');
}

// Exchange code for token
$tokenResponse = file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'code' => $_GET['code'],
            'client_id' => GOOGLE_CLIENT_ID,
            'client_secret' => GOOGLE_CLIENT_SECRET,
            'redirect_uri' => GOOGLE_REDIRECT_URI,
            'grant_type' => 'authorization_code'
        ])
    ]
]));

$tokenData = json_decode($tokenResponse, true);
if (!isset($tokenData['access_token'])) {
    die('Failed to get access token');
}

// Get user info
$userInfo = json_decode(file_get_contents('https://www.googleapis.com/oauth2/v2/userinfo', false, stream_context_create([
    'http' => ['header' => 'Authorization: Bearer ' . $tokenData['access_token']]
])), true);

$email = $userInfo['email'];
$name = $userInfo['name'];
$avatar = $userInfo['picture'] ?? null;

// Find or create user
$db = getDB();
$stmt = $db->prepare('SELECT id, name, email, avatar_url FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    $userId = generateUUID();
    $randomPassword = password_hash(bin2hex(random_bytes(16)), PASSWORD_BCRYPT);
    $stmt = $db->prepare('INSERT INTO users (id, name, email, password_hash, avatar_url) VALUES (?,?,?,?,?)');
    $stmt->execute([$userId, $name, $email, $randomPassword, $avatar]);
    $user = ['id' => $userId, 'name' => $name, 'email' => $email, 'avatar_url' => $avatar];
}

$token = generateJWT($user['id']);

// Redirect to frontend with token
$frontendUrl = 'http://localhost/mini-jira/frontend-developer/dashboard.html';
header("Location: {$frontendUrl}?token={$token}&user=" . urlencode(json_encode($user)));
exit;
?>
