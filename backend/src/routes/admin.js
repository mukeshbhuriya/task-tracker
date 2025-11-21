const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { adminListTasks } = require('../controllers/admin');

router.get('/tasks', authMiddleware, adminOnly, adminListTasks);

module.exports = router;
