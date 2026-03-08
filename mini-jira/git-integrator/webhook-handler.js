// =====================================================
// Mini Jira — GitHub Webhook Handler
// Role: Git Integrator
// Receives GitHub push events, links commits to tasks
// =====================================================

const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

const router = express.Router();
const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mini_jira_db' });

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'your-webhook-secret';

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Verify GitHub signature
function verifySignature(req) {
    const sig = req.headers['x-hub-signature-256'];
    if (!sig) return false;
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(JSON.stringify(req.body));
    const expected = 'sha256=' + hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

// Extract task IDs from commit messages (format: TASK-xxx or #xxx)
function extractTaskIds(message) {
    const matches = message.match(/(?:TASK-|#)([a-zA-Z0-9-]+)/gi);
    return matches ? matches.map(m => m.replace(/^(TASK-|#)/i, '')) : [];
}

router.post('/webhook', async (req, res) => {
    // Verify signature
    if (!verifySignature(req)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.headers['x-github-event'];

    if (event === 'push') {
        const { commits, repository } = req.body;
        const repoUrl = repository.html_url;

        for (const commit of commits) {
            const taskIds = extractTaskIds(commit.message);

            for (const taskId of taskIds) {
                // Check if task exists
                const [tasks] = await pool.query('SELECT id FROM tasks WHERE id LIKE ?', [`%${taskId}%`]);
                if (tasks.length) {
                    const id = uuid();
                    await pool.query(
                        'INSERT INTO github_commits (id, task_id, commit_sha, commit_message, author_github, repo_url, committed_at) VALUES (?,?,?,?,?,?,?)',
                        [id, tasks[0].id, commit.id, commit.message, commit.author.username, repoUrl, new Date(commit.timestamp)]
                    );
                    console.log(`[Git] Linked commit ${commit.id.substring(0,7)} to task ${tasks[0].id}`);
                }
            }
        }
        res.json({ message: 'Processed', commits: commits.length });
    } else {
        res.json({ message: 'Event ignored', event });
    }
});

// GET: Commits for a task
router.get('/commits/:taskId', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM github_commits WHERE task_id=? ORDER BY committed_at DESC', [req.params.taskId]);
    res.json(rows);
});

module.exports = router;
