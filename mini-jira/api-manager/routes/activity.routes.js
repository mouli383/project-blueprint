const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getDB } = require('../../database-designer/mongodb-config');

router.use(authMiddleware);

// GET activity for a project (from MongoDB)
router.get('/', async (req, res) => {
    try {
        const { project_id, entity_type, limit = 50 } = req.query;
        if (!project_id) return res.status(400).json({ error: 'project_id required' });

        const db = getDB();
        const filter = { project_id };
        if (entity_type) filter.entity_type = entity_type;

        const activities = await db.collection('activity_feed')
            .find(filter)
            .sort({ created_at: -1 })
            .limit(parseInt(limit))
            .toArray();

        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

module.exports = router;
