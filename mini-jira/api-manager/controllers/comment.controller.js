// Mini Jira — Comment Controller | Role: API Manager
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mini_jira_db' });
function uuid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16); }); }

exports.list = async (req, res) => {
    const [rows] = await pool.query('SELECT c.*,u.name as author_name FROM comments c JOIN users u ON u.id=c.author_id WHERE c.task_id=? ORDER BY c.created_at ASC', [req.query.task_id]);
    res.json(rows);
};
exports.create = async (req, res) => {
    const { task_id, body } = req.body;
    const id = uuid();
    await pool.query('INSERT INTO comments (id,task_id,author_id,body) VALUES (?,?,?,?)', [id, task_id, req.userId, body]);
    res.status(201).json({ message: 'Added', id });
};
exports.remove = async (req, res) => {
    await pool.query('DELETE FROM comments WHERE id=? AND author_id=?', [req.params.id, req.userId]);
    res.json({ message: 'Deleted' });
};
