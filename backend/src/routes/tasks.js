const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createTask, listMyTasks, updateTask, getMyTask, updateStatus } = require('../controllers/tasks');

router.use(authMiddleware);

router.post('/', createTask);
router.get('/my', listMyTasks);
router.get('/:id', getMyTask);
router.put('/:id', updateTask);
router.patch("/:id/status", updateStatus);

module.exports = router;
