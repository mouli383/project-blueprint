// =====================================================
// Mini Jira — Auth Routes (Express)
// Role: API Manager
// =====================================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// [PLACEHOLDER: OAuth Integrator will add OAuth routes]
// router.get('/google', oauthController.googleLogin);
// router.get('/google/callback', oauthController.googleCallback);
// router.get('/github', oauthController.githubLogin);
// router.get('/github/callback', oauthController.githubCallback);

module.exports = router;
