<?php
require_once __DIR__ . '/config.php';

$userId = getAuthUserId();
$db = getDB();
$projectId = $_GET['project_id'] ?? '';

// Get stats
if ($projectId) {
    $totalTasks = $db->prepare('SELECT COUNT(*) as c FROM tasks WHERE project_id=?');
    $totalTasks->execute([$projectId]);
    $total = $totalTasks->fetch()['c'];
    
    $doneTasks = $db->prepare('SELECT COUNT(*) as c FROM tasks WHERE project_id=? AND status="done"');
    $doneTasks->execute([$projectId]);
    $done = $doneTasks->fetch()['c'];
    
    $inProgress = $db->prepare('SELECT COUNT(*) as c FROM tasks WHERE project_id=? AND status="in_progress"');
    $inProgress->execute([$projectId]);
    $progress = $inProgress->fetch()['c'];
    
    $todoCount = $db->prepare('SELECT COUNT(*) as c FROM tasks WHERE project_id=? AND status="todo"');
    $todoCount->execute([$projectId]);
    $todo = $todoCount->fetch()['c'];
    
    $members = $db->prepare('SELECT COUNT(*) as c FROM project_members WHERE project_id=?');
    $members->execute([$projectId]);
    $memberCount = $members->fetch()['c'];
    
    $sprints = $db->prepare('SELECT COUNT(*) as c FROM sprints WHERE project_id=? AND status="active"');
    $sprints->execute([$projectId]);
    $activeSprints = $sprints->fetch()['c'];
    
    // Recent tasks
    $recent = $db->prepare('SELECT t.*, a.name as assignee_name FROM tasks t LEFT JOIN users a ON t.assignee_id=a.id WHERE t.project_id=? ORDER BY t.updated_at DESC LIMIT 5');
    $recent->execute([$projectId]);
    
    // Recent activity
    $activity = $db->prepare('SELECT al.*, u.name as user_name FROM activity_log al JOIN users u ON al.user_id=u.id WHERE al.project_id=? ORDER BY al.created_at DESC LIMIT 10');
    $activity->execute([$projectId]);
    
    respond([
        'stats' => [
            'total_tasks' => $total,
            'done_tasks' => $done,
            'in_progress' => $progress,
            'todo_tasks' => $todo,
            'member_count' => $memberCount,
            'active_sprints' => $activeSprints
        ],
        'recent_tasks' => $recent->fetchAll(),
        'recent_activity' => $activity->fetchAll()
    ]);
} else {
    // Global stats
    $projects = $db->prepare('SELECT COUNT(*) as c FROM project_members WHERE user_id=?');
    $projects->execute([$userId]);
    
    $myTasks = $db->prepare('SELECT COUNT(*) as c FROM tasks WHERE assignee_id=? AND status != "done"');
    $myTasks->execute([$userId]);
    
    respond([
        'project_count' => $projects->fetch()['c'],
        'pending_tasks' => $myTasks->fetch()['c']
    ]);
}
