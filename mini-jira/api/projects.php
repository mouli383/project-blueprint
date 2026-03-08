<?php
require_once __DIR__ . '/config.php';

$userId = getAuthUserId();
$method = getMethod();
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';
$db = getDB();

if ($method === 'GET' && !$id) {
    // List projects for current user
    $stmt = $db->prepare('
        SELECT p.*, u.name as owner_name,
            (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
            (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
        FROM projects p
        JOIN users u ON p.owner_id = u.id
        JOIN project_members pm ON pm.project_id = p.id
        WHERE pm.user_id = ?
        ORDER BY p.updated_at DESC
    ');
    $stmt->execute([$userId]);
    respond($stmt->fetchAll());

} elseif ($method === 'GET' && $id) {
    $stmt = $db->prepare('SELECT p.*, u.name as owner_name FROM projects p JOIN users u ON p.owner_id = u.id WHERE p.id = ?');
    $stmt->execute([$id]);
    $project = $stmt->fetch();
    if (!$project) respond(['error'=>'Project not found'], 404);
    respond($project);

} elseif ($method === 'POST') {
    $data = getInput();
    if (empty($data['name']) || empty($data['project_key'])) respond(['error'=>'Name and key required'], 400);
    
    $id = generateUUID();
    $db->prepare('INSERT INTO projects (id,name,description,project_key,owner_id) VALUES (?,?,?,?,?)')
       ->execute([$id, $data['name'], $data['description']??'', strtoupper($data['project_key']), $userId]);
    
    $memberId = generateUUID();
    $db->prepare('INSERT INTO project_members (id,project_id,user_id,role) VALUES (?,?,?,?)')
       ->execute([$memberId, $id, $userId, 'owner']);
    
    respond(['id'=>$id, 'message'=>'Project created'], 201);

} elseif ($method === 'PUT' && $id) {
    $data = getInput();
    $db->prepare('UPDATE projects SET name=?, description=?, status=? WHERE id=?')
       ->execute([$data['name']??'', $data['description']??'', $data['status']??'active', $id]);
    respond(['message'=>'Project updated']);

} elseif ($method === 'DELETE' && $id) {
    $db->prepare('DELETE FROM projects WHERE id=?')->execute([$id]);
    respond(['message'=>'Project deleted']);

} else {
    respond(['error'=>'Invalid endpoint'], 404);
}
