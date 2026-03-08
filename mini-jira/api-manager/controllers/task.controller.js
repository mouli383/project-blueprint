// Mini Jira — Task Controller | Role: API Manager
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mini_jira_db' });
function uuid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16); }); }

exports.list = async (req, res) => {
    const { project_id, status, priority, sprint_id } = req.query;
    if (!project_id) return res.status(400).json({ error: 'project_id required' });
    let sql = 'SELECT t.*,a.name as assignee_name,r.name as reporter_name FROM tasks t LEFT JOIN users a ON a.id=t.assignee_id LEFT JOIN users r ON r.id=t.reporter_id WHERE t.project_id=?';
    const p = [project_id];
    if (status) { sql += ' AND t.status=?'; p.push(status); }
    if (priority) { sql += ' AND t.priority=?'; p.push(priority); }
    if (sprint_id) { sql += ' AND t.sprint_id=?'; p.push(sprint_id); }
    sql += ' ORDER BY t.position ASC';
    const [rows] = await pool.query(sql, p);
    res.json(rows);
};

exports.getOne = async (req, res) => {
    const [rows] = await pool.query('SELECT t.*,a.name as assignee_name,r.name as reporter_name FROM tasks t LEFT JOIN users a ON a.id=t.assignee_id LEFT JOIN users r ON r.id=t.reporter_id WHERE t.id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
};

exports.create = async (req, res) => {
    const { project_id, title, description, status, priority, assignee_id, sprint_id, due_date } = req.body;
    if (!project_id || !title) return res.status(400).json({ error: 'project_id and title required' });
    const id = uuid();
    const [[{next_pos}]] = await pool.query('SELECT COALESCE(MAX(position),0)+1 as next_pos FROM tasks WHERE project_id=?', [project_id]);
    await pool.query('INSERT INTO tasks (id,project_id,sprint_id,title,description,status,priority,assignee_id,reporter_id,position,due_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [id, project_id, sprint_id||null, title, description||null, status||'todo', priority||'medium', assignee_id||null, req.userId, next_pos, due_date||null]);
    res.status(201).json({ message: 'Created', id });
};

exports.update = async (req, res) => {
    const fields = []; const vals = [];
    ['title','description','status','priority','assignee_id','sprint_id','due_date','position'].forEach(f => {
        if (req.body[f] !== undefined) { fields.push(`${f}=?`); vals.push(req.body[f]); }
    });
    if (!fields.length) return res.status(400).json({ error: 'No fields' });
    vals.push(req.params.id);
    await pool.query(`UPDATE tasks SET ${fields.join(',')} WHERE id=?`, vals);
    res.json({ message: 'Updated' });
};

exports.remove = async (req, res) => {
    await pool.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
};

exports.getComments = async (req, res) => {
    const [rows] = await pool.query('SELECT c.*,u.name as author_name FROM comments c JOIN users u ON u.id=c.author_id WHERE c.task_id=? ORDER BY c.created_at ASC', [req.params.id]);
    res.json(rows);
};

exports.addComment = async (req, res) => {
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: 'Body required' });
    const id = uuid();
    await pool.query('INSERT INTO comments (id,task_id,author_id,body) VALUES (?,?,?,?)', [id, req.params.id, req.userId, body]);
    res.status(201).json({ message: 'Added', id });
};
