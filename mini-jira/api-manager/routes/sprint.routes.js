const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const sprintController = require('../controllers/sprint.controller');

router.use(authMiddleware);
router.get('/', sprintController.list);
router.post('/', sprintController.create);
router.put('/:id', sprintController.update);
router.delete('/:id', sprintController.remove);

module.exports = router;
