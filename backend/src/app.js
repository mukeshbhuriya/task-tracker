require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const taskRoutes = require("./routes/tasks");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

async function connectWithRetry() {
  try {
    console.log("Attempting DB connection...");
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    await sequelize.sync();
    console.log("Models synced!");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error(
      "DB connection failed. Retrying in 5 seconds...",
      err.message
    );
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();
