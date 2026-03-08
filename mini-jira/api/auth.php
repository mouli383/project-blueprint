<?php
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$method = getMethod();

if ($method === 'POST' && $action === 'register') {
    $data = getInput();
    if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
        respond(['error' => 'Name, email and password are required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) respond(['error' => 'Email already registered'], 409);
    
    $id = generateUUID();
    $hash = password_hash($data['password'], PASSWORD_BCRYPT);
    $db->prepare('INSERT INTO users (id,name,email,password_hash) VALUES (?,?,?,?)')
       ->execute([$id, $data['name'], $data['email'], $hash]);
    
    $token = generateJWT($id);
    respond(['token'=>$token, 'user'=>['id'=>$id,'name'=>$data['name'],'email'=>$data['email'],'role'=>'member']], 201);

} elseif ($method === 'POST' && $action === 'login') {
    $data = getInput();
    if (empty($data['email']) || empty($data['password'])) {
        respond(['error' => 'Email and password required'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        respond(['error' => 'Invalid email or password'], 401);
    }
    
    $token = generateJWT($user['id']);
    respond(['token'=>$token, 'user'=>['id'=>$user['id'],'name'=>$user['name'],'email'=>$user['email'],'role'=>$user['role']]]);

} elseif ($method === 'POST' && $action === 'logout') {
    respond(['message' => 'Logged out']);

} else {
    respond(['error' => 'Invalid endpoint'], 404);
}
