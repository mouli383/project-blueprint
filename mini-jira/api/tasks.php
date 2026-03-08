<?php
require_once __DIR__ . '/config.php';

$userId = getAuthUserId();
$method = getMethod();
$id = $_GET['id'] ?? '';
$projectId = $_GET['project_id'] ?? '';
$db = getDB();

if ($method === 'GET' && !$id) {
    $sql = 'SELECT t.*, 
            a.name as assignee_name, r.name as reporter_name, s.name as sprint_name,
            (SELECT COUNT(*) FROM comments WHERE task_id = t.id) as comment_count
            FROM tasks t
            LEFT JOIN users a ON t.assignee_id = a.id
            LEFT JOIN users r ON t.reporter_id = r.id
            LEFT JOIN sprints s ON t.sprint_id = s.id';
    $params = [];
    
    if ($projectId) {
        $sql .= ' WHERE t.project_id = ?';
        $params[] = $projectId;
    }
    $sql .= ' ORDER BY t.created_at DESC';
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond($stmt->fetchAll());

} elseif ($method === 'GET' && $id) {
    $stmt = $db->prepare('SELECT t.*, a.name as assignee_name, r.name as reporter_name
        FROM tasks t LEFT JOIN users a ON t.assignee_id=a.id LEFT JOIN users r ON t.reporter_id=r.id WHERE t.id=?');
    $stmt->execute([$id]);
    $task = $stmt->fetch();
    if (!$task) respond(['error'=>'Task not found'], 404);
    
    // Get comments
    $cstmt = $db->prepare('SELECT c.*, u.name as user_name FROM comments c JOIN users u ON c.user_id=u.id WHERE c.task_id=? ORDER BY c.created_at ASC');
    $cstmt->execute([$id]);
    $task['comments'] = $cstmt->fetchAll();
    
    respond($task);

} elseif ($method === 'POST') {
    $data = getInput();
    if (empty($data['title']) || empty($data['project_id'])) respond(['error'=>'Title and project required'], 400);
    
    $id = generateUUID();
    $db->prepare('INSERT INTO tasks (id,project_id,sprint_id,title,description,status,priority,task_type,assignee_id,reporter_id,due_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
       ->execute([
           $id, $data['project_id'], $data['sprint_id']??null,
           $data['title'], $data['description']??'',
           $data['status']??'todo', $data['priority']??'medium', $data['task_type']??'task',
           $data['assignee_id']??null, $userId, $data['due_date']??null
       ]);
    
    // Log activity
    $db->prepare('INSERT INTO activity_log (id,project_id,user_id,action,entity_type,entity_id,details) VALUES (?,?,?,?,?,?,?)')
       ->execute([generateUUID(), $data['project_id'], $userId, 'created', 'task', $id, 'Created task "'.$data['title'].'"']);
    
    respond(['id'=>$id, 'message'=>'Task created'], 201);

} elseif ($method === 'PUT' && $id) {
    $data = getInput();
    
    // If just updating status
    if (isset($data['status']) && count($data) <= 2) {
        $db->prepare('UPDATE tasks SET status=? WHERE id=?')->execute([$data['status'], $id]);
        
        // Get task for logging
        $stmt = $db->prepare('SELECT title, project_id FROM tasks WHERE id=?');
        $stmt->execute([$id]);
        $task = $stmt->fetch();
        if ($task) {
            $db->prepare('INSERT INTO activity_log (id,project_id,user_id,action,entity_type,entity_id,details) VALUES (?,?,?,?,?,?,?)')
               ->execute([generateUUID(), $task['project_id'], $userId, 'updated', 'task', $id, 'Changed status of "'.$task['title'].'" to '.$data['status']]);
        }
        respond(['message'=>'Task status updated']);
    }
    
    $db->prepare('UPDATE tasks SET title=?,description=?,status=?,priority=?,task_type=?,assignee_id=?,sprint_id=?,due_date=? WHERE id=?')
       ->execute([
           $data['title']??'', $data['description']??'', $data['status']??'todo',
           $data['priority']??'medium', $data['task_type']??'task',
           $data['assignee_id']??null, $data['sprint_id']??null, $data['due_date']??null, $id
       ]);
    respond(['message'=>'Task updated']);

} elseif ($method === 'DELETE' && $id) {
    $db->prepare('DELETE FROM tasks WHERE id=?')->execute([$id]);
    respond(['message'=>'Task deleted']);

} else {
    respond(['error'=>'Invalid endpoint'], 404);
}
