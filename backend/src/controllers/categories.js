const { Category } = require('../models');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const exists = await Category.findOne({ where: { name }});
    if (exists) return res.status(400).json({ error: 'Category exists' });
    const cat = await Category.create({ name, created_by: req.user.id });
    return res.json(cat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    cat.name = name || cat.name;
    await cat.save();
    return res.json(cat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    await cat.destroy();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const listCategories = async (req, res) => {
  try {
    const cats = await Category.findAll();
    return res.json(cats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createCategory, updateCategory, deleteCategory, listCategories };
