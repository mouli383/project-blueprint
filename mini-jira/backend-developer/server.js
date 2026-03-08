// =====================================================
// Mini Jira — Express Server (Node.js)
// Role: Backend Developer
// Handles: API routing, MongoDB activity logging
// =====================================================

const express = require('express');
const cors = require('cors');
const { connectMongo, getDB } = require('../database-designer/mongodb-config');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Import API Routes (from API Manager) ─────────────
const authRoutes = require('../api-manager/routes/auth.routes');
const projectRoutes = require('../api-manager/routes/project.routes');
const taskRoutes = require('../api-manager/routes/task.routes');
const sprintRoutes = require('../api-manager/routes/sprint.routes');
const commentRoutes = require('../api-manager/routes/comment.routes');
const activityRoutes = require('../api-manager/routes/activity.routes');

// ── Mount Routes ─────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);

// ── Health Check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ──────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// ── Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[Server Error]', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ─────────────────────────────────────
async function start() {
    await connectMongo();
    app.listen(PORT, () => {
        console.log(`[Server] Mini Jira API running on http://localhost:${PORT}`);
        console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });
}

start();
