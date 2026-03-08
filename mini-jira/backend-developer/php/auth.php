<?php
// =====================================================
// Mini Jira — Auth API (PHP)
// Role: Backend Developer
// Endpoints: POST /auth/register, POST /auth/login
// =====================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['name'], $data['email'], $data['password'])) {
        jsonResponse(['error' => 'Name, email and password are required'], 400);
    }

    $db = getDB();

    // Check if email exists
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already registered'], 409);
    }

    $userId = generateUUID();
    $hash = password_hash($data['password'], PASSWORD_BCRYPT);

    $stmt = $db->prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)');
    $stmt->execute([$userId, $data['name'], $data['email'], $hash]);

    $token = generateJWT($userId);

    jsonResponse([
        'message' => 'Account created successfully',
        'token' => $token,
        'user' => [
            'id' => $userId,
            'name' => $data['name'],
            'email' => $data['email'],
            'avatar_url' => null
        ]
    ], 201);

} elseif ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['email'], $data['password'])) {
        jsonResponse(['error' => 'Email and password are required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT id, name, email, password_hash, avatar_url FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid email or password'], 401);
    }

    $token = generateJWT($user['id']);

    jsonResponse([
        'message' => 'Login successful',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'avatar_url' => $user['avatar_url']
        ]
    ]);

} else {
    jsonResponse(['error' => 'Invalid endpoint'], 404);
}
?>
