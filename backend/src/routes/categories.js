const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { createCategory, updateCategory, deleteCategory, listCategories } = require('../controllers/categories');

router.get('/', authMiddleware, listCategories);
router.post('/', authMiddleware, adminOnly, createCategory);
router.put('/:id', authMiddleware, adminOnly, updateCategory);
router.delete('/:id', authMiddleware, adminOnly, deleteCategory);

module.exports = router;
