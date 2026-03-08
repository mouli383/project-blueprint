<?php
require_once __DIR__ . '/config.php';

$userId = getAuthUserId();
$method = getMethod();
$projectId = $_GET['project_id'] ?? '';
$db = getDB();

if ($method === 'GET') {
    $sql = 'SELECT al.*, u.name as user_name FROM activity_log al JOIN users u ON al.user_id=u.id';
    $params = [];
    if ($projectId) { $sql .= ' WHERE al.project_id=?'; $params[] = $projectId; }
    $sql .= ' ORDER BY al.created_at DESC LIMIT 50';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond($stmt->fetchAll());
} else {
    respond(['error'=>'Invalid endpoint'], 404);
}
