<?php
// =====================================================
// Mini Jira — Sprints API (PHP)
// Role: Backend Developer
// =====================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$sprintId = $_GET['id'] ?? null;
$projectId = $_GET['project_id'] ?? null;
$userId = getAuthUserId();
$db = getDB();

// GET: List sprints
if ($method === 'GET' && $projectId) {
    $stmt = $db->prepare('SELECT * FROM sprints WHERE project_id = ? ORDER BY start_date DESC');
    $stmt->execute([$projectId]);
    jsonResponse($stmt->fetchAll());
}

// POST: Create sprint
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['name'], $data['project_id'], $data['start_date'], $data['end_date'])) {
        jsonResponse(['error' => 'Name, project_id, start_date, end_date required'], 400);
    }
    $sId = generateUUID();
    $stmt = $db->prepare('INSERT INTO sprints (id, project_id, name, goal, status, start_date, end_date) VALUES (?,?,?,?,?,?,?)');
    $stmt->execute([$sId, $data['project_id'], $data['name'], $data['goal'] ?? null, 'planned', $data['start_date'], $data['end_date']]);
    jsonResponse(['message' => 'Sprint created', 'id' => $sId], 201);
}

// PUT: Update sprint
if ($method === 'PUT' && $sprintId) {
    $data = json_decode(file_get_contents('php://input'), true);
    $fields = []; $values = [];
    foreach (['name', 'goal', 'status', 'start_date', 'end_date'] as $f) {
        if (array_key_exists($f, $data)) { $fields[] = "$f = ?"; $values[] = $data[$f]; }
    }
    if (empty($fields)) jsonResponse(['error' => 'No fields'], 400);
    $values[] = $sprintId;
    $stmt = $db->prepare('UPDATE sprints SET ' . implode(', ', $fields) . ' WHERE id = ?');
    $stmt->execute($values);
    jsonResponse(['message' => 'Sprint updated']);
}

// DELETE
if ($method === 'DELETE' && $sprintId) {
    $db->prepare('UPDATE tasks SET sprint_id = NULL WHERE sprint_id = ?')->execute([$sprintId]);
    $db->prepare('DELETE FROM sprints WHERE id = ?')->execute([$sprintId]);
    jsonResponse(['message' => 'Sprint deleted']);
}

jsonResponse(['error' => 'Invalid request'], 400);
?>
