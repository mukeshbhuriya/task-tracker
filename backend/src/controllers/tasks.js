const { Task, Category } = require('../models');

const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date, category_id } = req.body;
    if (!title || !due_date || !category_id) return res.status(400).json({ error: 'Missing fields' });
    const cat = await Category.findByPk(category_id);
    if (!cat) return res.status(400).json({ error: 'Invalid category' });
    const task = await Task.create({
      title, description, status: status || 'todo', due_date, category_id, assigned_to: req.user.id
    });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const listMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { assigned_to: req.user.id }, order: [['due_date','ASC']] });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getMyTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id, assigned_to: req.user.id }});
    if (!task) return res.status(404).json({ error: 'Not found' });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date, category_id } = req.body;
    const task = await Task.findOne({ where: { id, assigned_to: req.user.id }});
    if (!task) return res.status(404).json({ error: 'Not found or not allowed' });

    if (status && new Date() > new Date(task.due_date)) {
      return res.status(400).json({ error: 'Cannot change status after due date' });
    }

    if (category_id) {
      const cat = await Category.findByPk(category_id);
      if (!cat) return res.status(400).json({ error: 'Invalid category' });
      task.category_id = category_id;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.due_date = due_date || task.due_date;
    task.status = status || task.status;

    await task.save();
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findOne({
      where: { id, assigned_to: req.user.id },
    });

    if (!task) return res.status(404).json({ error: "Not found" });

    if (new Date() > new Date(task.due_date)) {
      return res
        .status(400)
        .json({ error: "Cannot change status after due date" });
    }

    task.status = status;
    await task.save();

    return res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { createTask, listMyTasks, updateTask, getMyTask, updateStatus };
