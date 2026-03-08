// =====================================================
// Mini Jira — Auth Controller
// Role: API Manager
// =====================================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-please';

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost', user: 'root', password: '', database: 'mini_jira_db'
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length) return res.status(409).json({ error: 'Email already registered' });

        const id = generateUUID();
        const hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (id, name, email, password_hash) VALUES (?,?,?,?)', [id, name, email, hash]);

        const token = jwt.sign({ user_id: id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user: { id, name, email, avatar_url: null } });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.logout = (req, res) => {
    // JWT is stateless; client removes token
    res.json({ message: 'Logged out' });
};
