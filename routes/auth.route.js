const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

/*  URL: api/auth/ */
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/verify', auth, AuthController.authVerify);

module.exports = router;