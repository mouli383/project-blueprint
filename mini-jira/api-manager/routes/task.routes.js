const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const taskController = require('../controllers/task.controller');

router.use(authMiddleware);

router.get('/', taskController.list);           // ?project_id=xxx
router.post('/', taskController.create);
router.get('/:id', taskController.getOne);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);
router.get('/:id/comments', taskController.getComments);
router.post('/:id/comments', taskController.addComment);

module.exports = router;
