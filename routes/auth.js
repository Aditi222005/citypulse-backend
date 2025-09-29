// File: routes/authRoutes.js

const express = require('express');
const { register, login, getMe, refreshToken } = require('../controllers/authController');
const upload = require('../middleware/upload'); // <-- 1. Import the upload middleware
const { protect } = require('../middleware/auth');

const router = express.Router();

// 2. Apply the middleware to the register route
// This tells Multer to look for a single file with the field name "avatar"
router.post('/register', upload.single('avatar'), register); 

router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

module.exports = router;