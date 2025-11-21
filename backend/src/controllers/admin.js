const { Task } = require('../models');
const { Op } = require('sequelize');

const adminListTasks = async (req, res) => {
  try {
    const { user_id, due_date, status } = req.query;
    const where = {};
    if (user_id) where.assigned_to = user_id;
    if (due_date) {
      const d = new Date(due_date);
      where.due_date = { [Op.eq]: d };
    }
    if (status) where.status = status;
    const tasks = await Task.findAll({ where, order: [['due_date','ASC']] });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { adminListTasks };
