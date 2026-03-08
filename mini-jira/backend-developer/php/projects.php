<?php
// =====================================================
// Mini Jira — Projects API (PHP)
// Role: Backend Developer
// Endpoints: GET/POST /projects, GET/PUT/DELETE /projects/:id
// =====================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$projectId = $_GET['id'] ?? null;
$userId = getAuthUserId();
$db = getDB();

// ── GET: List user's projects ────────────────────────
if ($method === 'GET' && !$projectId) {
    $stmt = $db->prepare('
        SELECT p.*, pm.role as user_role
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.id
        WHERE pm.user_id = ?
        ORDER BY p.updated_at DESC
    ');
    $stmt->execute([$userId]);
    jsonResponse($stmt->fetchAll());
}

// ── GET: Single project ──────────────────────────────
if ($method === 'GET' && $projectId) {
    $stmt = $db->prepare('
        SELECT p.*, pm.role as user_role
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.id
        WHERE p.id = ? AND pm.user_id = ?
    ');
    $stmt->execute([$projectId, $userId]);
    $project = $stmt->fetch();
    if (!$project) jsonResponse(['error' => 'Project not found'], 404);
    jsonResponse($project);
}

// ── POST: Create project ─────────────────────────────
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['name'])) {
        jsonResponse(['error' => 'Project name is required'], 400);
    }

    $projId = generateUUID();
    $memberId = generateUUID();

    $db->beginTransaction();
    try {
        $stmt = $db->prepare('INSERT INTO projects (id, name, description, owner_id) VALUES (?, ?, ?, ?)');
        $stmt->execute([$projId, $data['name'], $data['description'] ?? null, $userId]);

        $stmt = $db->prepare('INSERT INTO project_members (id, project_id, user_id, role) VALUES (?, ?, ?, ?)');
        $stmt->execute([$memberId, $projId, $userId, 'owner']);

        $db->commit();
        jsonResponse(['message' => 'Project created', 'id' => $projId], 201);
    } catch (Exception $e) {
        $db->rollBack();
        jsonResponse(['error' => 'Failed to create project'], 500);
    }
}

// ── PUT: Update project ──────────────────────────────
if ($method === 'PUT' && $projectId) {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $db->prepare('SELECT role FROM project_members WHERE project_id = ? AND user_id = ?');
    $stmt->execute([$projectId, $userId]);
    $member = $stmt->fetch();
    if (!$member || !in_array($member['role'], ['owner', 'admin'])) {
        jsonResponse(['error' => 'Permission denied'], 403);
    }

    $stmt = $db->prepare('UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?');
    $stmt->execute([$data['name'] ?? null, $data['description'] ?? null, $projectId]);
    jsonResponse(['message' => 'Project updated']);
}

// ── DELETE: Delete project ───────────────────────────
if ($method === 'DELETE' && $projectId) {
    $stmt = $db->prepare('SELECT owner_id FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    if (!$project || $project['owner_id'] !== $userId) {
        jsonResponse(['error' => 'Only owner can delete'], 403);
    }

    $stmt = $db->prepare('DELETE FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    jsonResponse(['message' => 'Project deleted']);
}

jsonResponse(['error' => 'Invalid request'], 400);
?>
