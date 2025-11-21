require('dotenv').config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Category } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const pw = await bcrypt.hash('Admin@123', 10);
    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: { name: 'Admin', password: pw, role: 'admin' }
    });
    await Category.findOrCreate({ where: { name: 'Work' }, defaults: { created_by: admin.id }});
    await Category.findOrCreate({ where: { name: 'Personal' }, defaults: { created_by: admin.id }});
    console.log('Seed complete. Admin:', admin.email, 'password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
