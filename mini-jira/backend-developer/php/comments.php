<?php
// =====================================================
// Mini Jira — Comments API (PHP)
// Role: Backend Developer
// =====================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$taskId = $_GET['task_id'] ?? null;
$commentId = $_GET['id'] ?? null;
$userId = getAuthUserId();
$db = getDB();

// GET: List comments for a task
if ($method === 'GET' && $taskId) {
    $stmt = $db->prepare('
        SELECT c.*, u.name as author_name, u.avatar_url as author_avatar
        FROM comments c
        JOIN users u ON u.id = c.author_id
        WHERE c.task_id = ?
        ORDER BY c.created_at ASC
    ');
    $stmt->execute([$taskId]);
    jsonResponse($stmt->fetchAll());
}

// POST: Add comment
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['task_id'], $data['body'])) {
        jsonResponse(['error' => 'task_id and body required'], 400);
    }
    $cId = generateUUID();
    $stmt = $db->prepare('INSERT INTO comments (id, task_id, author_id, body) VALUES (?,?,?,?)');
    $stmt->execute([$cId, $data['task_id'], $userId, $data['body']]);
    jsonResponse(['message' => 'Comment added', 'id' => $cId], 201);
}

// DELETE: Remove comment
if ($method === 'DELETE' && $commentId) {
    $stmt = $db->prepare('SELECT author_id FROM comments WHERE id = ?');
    $stmt->execute([$commentId]);
    $comment = $stmt->fetch();
    if (!$comment || $comment['author_id'] !== $userId) {
        jsonResponse(['error' => 'Permission denied'], 403);
    }
    $db->prepare('DELETE FROM comments WHERE id = ?')->execute([$commentId]);
    jsonResponse(['message' => 'Comment deleted']);
}

jsonResponse(['error' => 'Invalid request'], 400);
?>
