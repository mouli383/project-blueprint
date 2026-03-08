<?php
require_once __DIR__ . '/config.php';

$userId = getAuthUserId();
$method = getMethod();
$projectId = $_GET['project_id'] ?? '';
$id = $_GET['id'] ?? '';
$db = getDB();

if ($method === 'GET' && $projectId) {
    $stmt = $db->prepare('SELECT pm.*, u.name, u.email, u.role as user_role FROM project_members pm JOIN users u ON pm.user_id=u.id WHERE pm.project_id=? ORDER BY pm.joined_at');
    $stmt->execute([$projectId]);
    respond($stmt->fetchAll());

} elseif ($method === 'GET' && !$projectId) {
    // List all users (for assigning)
    $stmt = $db->query('SELECT id, name, email, role FROM users ORDER BY name');
    respond($stmt->fetchAll());

} elseif ($method === 'POST') {
    $data = getInput();
    if (empty($data['project_id']) || empty($data['user_id'])) respond(['error'=>'Project and user required'], 400);
    $id = generateUUID();
    try {
        $db->prepare('INSERT INTO project_members (id,project_id,user_id,role) VALUES (?,?,?,?)')
           ->execute([$id, $data['project_id'], $data['user_id'], $data['role']??'member']);
        respond(['id'=>$id, 'message'=>'Member added'], 201);
    } catch (PDOException $e) {
        respond(['error'=>'Member already in project'], 409);
    }

} elseif ($method === 'DELETE' && $id) {
    $db->prepare('DELETE FROM project_members WHERE id=?')->execute([$id]);
    respond(['message'=>'Member removed']);

} else {
    respond(['error'=>'Invalid endpoint'], 404);
}
