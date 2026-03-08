const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const commentController = require('../controllers/comment.controller');

router.use(authMiddleware);
router.get('/', commentController.list);
router.post('/', commentController.create);
router.delete('/:id', commentController.remove);

module.exports = router;
