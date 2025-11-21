const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createTask, listMyTasks, updateTask, getMyTask } = require('../controllers/tasks');

router.use(authMiddleware);

router.post('/', createTask);
router.get('/my', listMyTasks);
router.get('/:id', getMyTask);
router.put('/:id', updateTask);

module.exports = router;
