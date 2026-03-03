const express = require('express');
const router = express.Router();
const { register, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.get('/me', auth, getMe);

module.exports = router;
