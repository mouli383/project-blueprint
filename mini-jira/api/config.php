<?php
// =====================================================
// Mini Jira — PHP API Configuration
// =====================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'mini_jira_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('JWT_SECRET', 'mini-jira-secret-key-change-in-production');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER, DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
            );
        } catch (PDOException $e) {
            respond(['error' => 'Database connection failed'], 500);
        }
    }
    return $pdo;
}

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function getInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff),
        mt_rand(0,0x0fff)|0x4000, mt_rand(0,0x3fff)|0x8000,
        mt_rand(0,0xffff), mt_rand(0,0xffff), mt_rand(0,0xffff));
}

function generateJWT($userId) {
    $header = base64url_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $payload = base64url_encode(json_encode(['user_id'=>$userId,'iat'=>time(),'exp'=>time()+86400]));
    $sig = base64url_encode(hash_hmac('sha256',"$header.$payload",JWT_SECRET,true));
    return "$header.$payload.$sig";
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function getAuthUserId() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/Bearer\s(\S+)/', $auth, $m)) respond(['error'=>'Unauthorized'], 401);
    
    $parts = explode('.', $m[1]);
    if (count($parts) !== 3) respond(['error'=>'Invalid token'], 401);
    
    $payload = json_decode(base64url_decode($parts[1]), true);
    if (!$payload || !isset($payload['user_id'])) respond(['error'=>'Invalid token'], 401);
    if (isset($payload['exp']) && $payload['exp'] < time()) respond(['error'=>'Token expired'], 401);
    
    // Verify signature
    $validSig = base64url_encode(hash_hmac('sha256', $parts[0].'.'.$parts[1], JWT_SECRET, true));
    if ($validSig !== $parts[2]) respond(['error'=>'Invalid token signature'], 401);
    
    return $payload['user_id'];
}

function getMethod() {
    return $_SERVER['REQUEST_METHOD'];
}
