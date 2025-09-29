const express = require('express');
const { createIssue } = require('../controllers/issueController');
const { protect } = require('../middleware/auth'); // Your JWT authentication middleware
const upload = require('../middleware/upload'); // Your multer middleware

const router = express.Router();

// The 'upload.array('media', 5)' part tells Multer to expect up to 5 files
// in a field named 'media'.
router.route('/').post(protect, upload.array('media', 5), createIssue);

module.exports = router;