// =====================================================
// Mini Jira — Project Controller
// Role: API Manager
// =====================================================
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mini_jira_db' });

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

exports.list = async (req, res) => {
    const [rows] = await pool.query('SELECT p.*, pm.role as user_role FROM projects p JOIN project_members pm ON pm.project_id = p.id WHERE pm.user_id = ?', [req.userId]);
    res.json(rows);
};

exports.getOne = async (req, res) => {
    const [rows] = await pool.query('SELECT p.*, pm.role as user_role FROM projects p JOIN project_members pm ON pm.project_id = p.id WHERE p.id = ? AND pm.user_id = ?', [req.params.id, req.userId]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
};

exports.create = async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const id = generateUUID(); const mid = generateUUID();
    await pool.query('INSERT INTO projects (id,name,description,owner_id) VALUES (?,?,?,?)', [id, name, description || null, req.userId]);
    await pool.query('INSERT INTO project_members (id,project_id,user_id,role) VALUES (?,?,?,?)', [mid, id, req.userId, 'owner']);
    res.status(201).json({ message: 'Created', id });
};

exports.update = async (req, res) => {
    const { name, description } = req.body;
    await pool.query('UPDATE projects SET name=COALESCE(?,name), description=COALESCE(?,description) WHERE id=?', [name, description, req.params.id]);
    res.json({ message: 'Updated' });
};

exports.remove = async (req, res) => {
    await pool.query('DELETE FROM projects WHERE id=? AND owner_id=?', [req.params.id, req.userId]);
    res.json({ message: 'Deleted' });
};

exports.getMembers = async (req, res) => {
    const [rows] = await pool.query('SELECT u.id,u.name,u.email,u.avatar_url,pm.role,pm.joined_at FROM project_members pm JOIN users u ON u.id=pm.user_id WHERE pm.project_id=?', [req.params.id]);
    res.json(rows);
};

exports.addMember = async (req, res) => {
    const { email, role } = req.body;
    const [users] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (!users.length) return res.status(404).json({ error: 'User not found' });
    const mid = generateUUID();
    await pool.query('INSERT INTO project_members (id,project_id,user_id,role) VALUES (?,?,?,?)', [mid, req.params.id, users[0].id, role || 'member']);
    res.status(201).json({ message: 'Member added' });
};

exports.removeMember = async (req, res) => {
    await pool.query('DELETE FROM project_members WHERE project_id=? AND user_id=?', [req.params.id, req.params.memberId]);
    res.json({ message: 'Removed' });
};

exports.getStats = async (req, res) => {
    const pid = req.params.id;
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM tasks WHERE project_id=?', [pid]);
    const [[{ in_progress }]] = await pool.query("SELECT COUNT(*) as in_progress FROM tasks WHERE project_id=? AND status='in_progress'", [pid]);
    const [[{ done }]] = await pool.query("SELECT COUNT(*) as done FROM tasks WHERE project_id=? AND status='done'", [pid]);
    const [[{ overdue }]] = await pool.query("SELECT COUNT(*) as overdue FROM tasks WHERE project_id=? AND due_date < CURDATE() AND status != 'done'", [pid]);
    res.json({ total, in_progress, done, overdue });
};
