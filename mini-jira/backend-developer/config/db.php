<?php
// =====================================================
// Mini Jira — MySQL Database Connection
// Role: Backend Developer
// =====================================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'mini_jira_db');
define('DB_USER', 'root');        // Change for production
define('DB_PASS', '');            // Change for production
define('DB_CHARSET', 'utf8mb4');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
        }
    }
    return $pdo;
}

// ── JSON Response Helper ─────────────────────────────
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// ── Get Bearer Token ─────────────────────────────────
function getBearerToken() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
        return $matches[1];
    }
    return null;
}

// ── Verify JWT and get user ID ───────────────────────
// [PLACEHOLDER: OAuth Integrator will enhance with OAuth tokens]
function getAuthUserId() {
    $token = getBearerToken();
    if (!$token) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }

    // Decode JWT (simple implementation - use firebase/php-jwt in production)
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        jsonResponse(['error' => 'Invalid token'], 401);
    }

    $payload = json_decode(base64_decode($parts[1]), true);
    if (!$payload || !isset($payload['user_id'])) {
        jsonResponse(['error' => 'Invalid token payload'], 401);
    }

    // Check expiry
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        jsonResponse(['error' => 'Token expired'], 401);
    }

    return $payload['user_id'];
}

// ── Generate JWT ─────────────────────────────────────
define('JWT_SECRET', 'your-secret-key-change-in-production-please');

function generateJWT($userId) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode([
        'user_id' => $userId,
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

// ── UUID Generator ───────────────────────────────────
function generateUUID() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
?>
