<?php
require_once __DIR__ . '/config.php';

$userId = getAuthUserId();
$method = getMethod();
$taskId = $_GET['task_id'] ?? '';
$id = $_GET['id'] ?? '';
$db = getDB();

if ($method === 'GET' && $taskId) {
    $stmt = $db->prepare('SELECT c.*, u.name as user_name FROM comments c JOIN users u ON c.user_id=u.id WHERE c.task_id=? ORDER BY c.created_at ASC');
    $stmt->execute([$taskId]);
    respond($stmt->fetchAll());

} elseif ($method === 'POST') {
    $data = getInput();
    if (empty($data['task_id']) || empty($data['content'])) respond(['error'=>'Task ID and content required'], 400);
    $id = generateUUID();
    $db->prepare('INSERT INTO comments (id,task_id,user_id,content) VALUES (?,?,?,?)')
       ->execute([$id, $data['task_id'], $userId, $data['content']]);
    respond(['id'=>$id, 'message'=>'Comment added'], 201);

} elseif ($method === 'DELETE' && $id) {
    $db->prepare('DELETE FROM comments WHERE id=? AND user_id=?')->execute([$id, $userId]);
    respond(['message'=>'Comment deleted']);

} else {
    respond(['error'=>'Invalid endpoint'], 404);
}
