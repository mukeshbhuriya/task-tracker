const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('todo','doing','done'),
      defaultValue: 'todo'
    },
    due_date: DataTypes.DATE,
    category_id: DataTypes.UUID,
    assigned_to: DataTypes.UUID
  }, {
    tableName: 'tasks',
    timestamps: true
  });
  return Task;
};
