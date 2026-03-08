<?php
require_once __DIR__ . '/config.php';

$userId = getAuthUserId();
$method = getMethod();
$id = $_GET['id'] ?? '';
$projectId = $_GET['project_id'] ?? '';
$db = getDB();

if ($method === 'GET' && !$id) {
    $sql = 'SELECT s.*, 
            (SELECT COUNT(*) FROM tasks WHERE sprint_id=s.id) as task_count,
            (SELECT COUNT(*) FROM tasks WHERE sprint_id=s.id AND status="done") as done_count
            FROM sprints s';
    $params = [];
    if ($projectId) { $sql .= ' WHERE s.project_id=?'; $params[] = $projectId; }
    $sql .= ' ORDER BY s.start_date DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond($stmt->fetchAll());

} elseif ($method === 'GET' && $id) {
    $stmt = $db->prepare('SELECT * FROM sprints WHERE id=?');
    $stmt->execute([$id]);
    $sprint = $stmt->fetch();
    if (!$sprint) respond(['error'=>'Sprint not found'], 404);
    respond($sprint);

} elseif ($method === 'POST') {
    $data = getInput();
    if (empty($data['name']) || empty($data['project_id'])) respond(['error'=>'Name and project required'], 400);
    $id = generateUUID();
    $db->prepare('INSERT INTO sprints (id,project_id,name,goal,start_date,end_date,status) VALUES (?,?,?,?,?,?,?)')
       ->execute([$id, $data['project_id'], $data['name'], $data['goal']??'', $data['start_date']??null, $data['end_date']??null, $data['status']??'planning']);
    respond(['id'=>$id, 'message'=>'Sprint created'], 201);

} elseif ($method === 'PUT' && $id) {
    $data = getInput();
    $db->prepare('UPDATE sprints SET name=?,goal=?,start_date=?,end_date=?,status=? WHERE id=?')
       ->execute([$data['name']??'', $data['goal']??'', $data['start_date']??null, $data['end_date']??null, $data['status']??'planning', $id]);
    respond(['message'=>'Sprint updated']);

} elseif ($method === 'DELETE' && $id) {
    $db->prepare('DELETE FROM sprints WHERE id=?')->execute([$id]);
    respond(['message'=>'Sprint deleted']);

} else {
    respond(['error'=>'Invalid endpoint'], 404);
}
