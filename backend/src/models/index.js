const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const CategoryModel = require('./category');
const TaskModel = require('./task');
const TokenModel = require('./token');

const sequelize = new Sequelize(process.env.DB_NAME || 'taskdb',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password', {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
});

const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Task = TaskModel(sequelize);
const Token = TokenModel(sequelize);

User.hasMany(Task, { foreignKey: 'assigned_to' });
Task.belongsTo(User, { foreignKey: 'assigned_to' });

Category.hasMany(Task, { foreignKey: 'category_id' });
Task.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Task,
  Token
};
