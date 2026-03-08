<?php
// =====================================================
// Mini Jira — Tasks API (PHP)
// Role: Backend Developer
// =====================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$taskId = $_GET['id'] ?? null;
$projectId = $_GET['project_id'] ?? null;
$userId = getAuthUserId();
$db = getDB();

// ── GET: List tasks for a project ────────────────────
if ($method === 'GET' && $projectId && !$taskId) {
    $sql = '
        SELECT t.*,
               a.name as assignee_name,
               r.name as reporter_name
        FROM tasks t
        LEFT JOIN users a ON a.id = t.assignee_id
        LEFT JOIN users r ON r.id = t.reporter_id
        WHERE t.project_id = ?
    ';
    $params = [$projectId];

    // Optional filters
    if (!empty($_GET['status'])) { $sql .= ' AND t.status = ?'; $params[] = $_GET['status']; }
    if (!empty($_GET['priority'])) { $sql .= ' AND t.priority = ?'; $params[] = $_GET['priority']; }
    if (!empty($_GET['sprint_id'])) { $sql .= ' AND t.sprint_id = ?'; $params[] = $_GET['sprint_id']; }
    if (!empty($_GET['assignee_id'])) { $sql .= ' AND t.assignee_id = ?'; $params[] = $_GET['assignee_id']; }

    $sql .= ' ORDER BY t.position ASC, t.created_at DESC';

    if (!empty($_GET['limit'])) { $sql .= ' LIMIT ' . intval($_GET['limit']); }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse($stmt->fetchAll());
}

// ── GET: Single task ─────────────────────────────────
if ($method === 'GET' && $taskId) {
    $stmt = $db->prepare('
        SELECT t.*, a.name as assignee_name, r.name as reporter_name
        FROM tasks t
        LEFT JOIN users a ON a.id = t.assignee_id
        LEFT JOIN users r ON r.id = t.reporter_id
        WHERE t.id = ?
    ');
    $stmt->execute([$taskId]);
    $task = $stmt->fetch();
    if (!$task) jsonResponse(['error' => 'Task not found'], 404);
    jsonResponse($task);
}

// ── POST: Create task ────────────────────────────────
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['title'], $data['project_id'])) {
        jsonResponse(['error' => 'Title and project_id are required'], 400);
    }

    $tId = generateUUID();

    // Get next position
    $stmt = $db->prepare('SELECT COALESCE(MAX(position), 0) + 1 as next_pos FROM tasks WHERE project_id = ? AND status = ?');
    $stmt->execute([$data['project_id'], $data['status'] ?? 'todo']);
    $nextPos = $stmt->fetch()['next_pos'];

    $stmt = $db->prepare('
        INSERT INTO tasks (id, project_id, sprint_id, title, description, status, priority, assignee_id, reporter_id, position, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $tId,
        $data['project_id'],
        $data['sprint_id'] ?? null,
        $data['title'],
        $data['description'] ?? null,
        $data['status'] ?? 'todo',
        $data['priority'] ?? 'medium',
        $data['assignee_id'] ?? null,
        $userId,
        $nextPos,
        $data['due_date'] ?? null
    ]);

    jsonResponse(['message' => 'Task created', 'id' => $tId], 201);
}

// ── PUT: Update task ─────────────────────────────────
if ($method === 'PUT' && $taskId) {
    $data = json_decode(file_get_contents('php://input'), true);

    $fields = [];
    $values = [];

    foreach (['title', 'description', 'status', 'priority', 'assignee_id', 'sprint_id', 'due_date', 'position'] as $field) {
        if (array_key_exists($field, $data)) {
            $fields[] = "$field = ?";
            $values[] = $data[$field];
        }
    }

    if (empty($fields)) jsonResponse(['error' => 'No fields to update'], 400);

    $values[] = $taskId;
    $stmt = $db->prepare('UPDATE tasks SET ' . implode(', ', $fields) . ' WHERE id = ?');
    $stmt->execute($values);

    jsonResponse(['message' => 'Task updated']);
}

// ── DELETE: Delete task ──────────────────────────────
if ($method === 'DELETE' && $taskId) {
    $stmt = $db->prepare('DELETE FROM tasks WHERE id = ?');
    $stmt->execute([$taskId]);
    jsonResponse(['message' => 'Task deleted']);
}

jsonResponse(['error' => 'Invalid request'], 400);
?>
