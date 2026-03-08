// =====================================================
// Mini Jira — Project Routes (Express)
// Role: API Manager
// =====================================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const projectController = require('../controllers/project.controller');

router.use(authMiddleware);

router.get('/', projectController.list);
router.post('/', projectController.create);
router.get('/:id', projectController.getOne);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);
router.get('/:id/members', projectController.getMembers);
router.post('/:id/members', projectController.addMember);
router.delete('/:id/members/:memberId', projectController.removeMember);
router.get('/:id/stats', projectController.getStats);

module.exports = router;
