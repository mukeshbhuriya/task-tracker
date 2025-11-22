const { Task, User, Category } = require("../models");
const { Op } = require("sequelize");

const adminListTasks = async (req, res) => {
  try {
    const { user_id, due_date, status } = req.query;

    const where = {};
    if (user_id && user_id !== "all") where.assigned_to = user_id;
    if (due_date) where.due_date = { [Op.eq]: new Date(due_date) };
    if (status && status !== "all") where.status = status;

    const tasks = await Task.findAll({
      where,
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Category, attributes: ["id", "name"] },
      ],
      order: [["due_date", "ASC"]],
    });

    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const adminUsersList = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ADMIN — LIST USERS
 */
const adminListUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
      order: [["createdAt", "DESC"]],
    });

    return res.json(users);
  } catch (err) {
    console.error("Admin users list error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * ADMIN — UPDATE USER ROLE
 */
const adminUpdateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();

    return res.json({ message: "Role updated", user });
  } catch (err) {
    console.error("Update user role error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * ADMIN — DELETE USER
 * (prevents deleting self or deleting last admin)
 */
const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // prevent self-delete
    if (req.user.id == id) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // prevent deleting last admin
    if (user.role === "admin") {
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res.status(400).json({ error: "Cannot delete the last admin user" });
      }
    }

    await user.destroy();
    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { adminListTasks, adminUsersList, adminUpdateUserRole, adminDeleteUser, adminListUsers };
