const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { adminListTasks, adminUsersList, adminListUsers, adminUpdateUserRole, adminDeleteUser } = require('../controllers/admin');

router.get('/tasks', authMiddleware, adminOnly, adminListTasks);
router.get("/list-users", authMiddleware, adminOnly, adminUsersList);

router.get("/users", authMiddleware, adminOnly, adminListUsers);
router.patch("/users/:id", authMiddleware, adminOnly, adminUpdateUserRole);
router.delete("/users/:id", authMiddleware, adminOnly, adminDeleteUser);

module.exports = router;
