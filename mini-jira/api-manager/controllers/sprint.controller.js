// Mini Jira — Sprint Controller | Role: API Manager
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mini_jira_db' });
function uuid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16); }); }

exports.list = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM sprints WHERE project_id=? ORDER BY start_date DESC', [req.query.project_id]);
    res.json(rows);
};
exports.create = async (req, res) => {
    const { project_id, name, goal, start_date, end_date } = req.body;
    const id = uuid();
    await pool.query('INSERT INTO sprints (id,project_id,name,goal,status,start_date,end_date) VALUES (?,?,?,?,?,?,?)', [id, project_id, name, goal||null, 'planned', start_date, end_date]);
    res.status(201).json({ message: 'Created', id });
};
exports.update = async (req, res) => {
    const fields = []; const vals = [];
    ['name','goal','status','start_date','end_date'].forEach(f => { if (req.body[f] !== undefined) { fields.push(`${f}=?`); vals.push(req.body[f]); } });
    vals.push(req.params.id);
    await pool.query(`UPDATE sprints SET ${fields.join(',')} WHERE id=?`, vals);
    res.json({ message: 'Updated' });
};
exports.remove = async (req, res) => {
    await pool.query('UPDATE tasks SET sprint_id=NULL WHERE sprint_id=?', [req.params.id]);
    await pool.query('DELETE FROM sprints WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
};
