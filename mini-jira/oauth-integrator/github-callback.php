<?php
// =====================================================
// Mini Jira — GitHub OAuth Callback
// Role: OAuth Integrator
// =====================================================

session_start();
require_once __DIR__ . '/../backend-developer/config/db.php';

define('GITHUB_CLIENT_ID', 'YOUR_GITHUB_CLIENT_ID');
define('GITHUB_CLIENT_SECRET', 'YOUR_GITHUB_CLIENT_SECRET');

if (!isset($_GET['code'])) { die('No code received'); }

// Exchange code for token
$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'client_id' => GITHUB_CLIENT_ID,
        'client_secret' => GITHUB_CLIENT_SECRET,
        'code' => $_GET['code']
    ]),
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
    CURLOPT_RETURNTRANSFER => true
]);
$tokenData = json_decode(curl_exec($ch), true);
curl_close($ch);

if (!isset($tokenData['access_token'])) { die('Token exchange failed'); }

// Get user info
$ch = curl_init('https://api.github.com/user');
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $tokenData['access_token'], 'User-Agent: MiniJira'],
    CURLOPT_RETURNTRANSFER => true
]);
$ghUser = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get email
$ch = curl_init('https://api.github.com/user/emails');
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $tokenData['access_token'], 'User-Agent: MiniJira'],
    CURLOPT_RETURNTRANSFER => true
]);
$emails = json_decode(curl_exec($ch), true);
curl_close($ch);

$email = $ghUser['email'];
if (!$email && is_array($emails)) {
    foreach ($emails as $e) { if ($e['primary']) { $email = $e['email']; break; } }
}

$name = $ghUser['name'] ?? $ghUser['login'];
$avatar = $ghUser['avatar_url'] ?? null;

// Find or create user
$db = getDB();
$stmt = $db->prepare('SELECT id,name,email,avatar_url FROM users WHERE email=?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    $userId = generateUUID();
    $stmt = $db->prepare('INSERT INTO users (id,name,email,password_hash,avatar_url) VALUES (?,?,?,?,?)');
    $stmt->execute([$userId, $name, $email, password_hash(bin2hex(random_bytes(16)), PASSWORD_BCRYPT), $avatar]);
    $user = ['id' => $userId, 'name' => $name, 'email' => $email, 'avatar_url' => $avatar];
}

$token = generateJWT($user['id']);
header("Location: http://localhost/mini-jira/frontend-developer/dashboard.html?token={$token}&user=" . urlencode(json_encode($user)));
exit;
?>
