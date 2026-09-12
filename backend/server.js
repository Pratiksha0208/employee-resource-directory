const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const db = require("./db");
const employeeRoutes = require("./src/routes/employeeRoutes");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Employee Resource Directory API is running",
  });
});

// Database health check
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS database_status");

    res.status(200).json({
      message: "API and database are connected",
      database: rows[0].database_status === 1 ? "connected" : "error",
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Employee routes
app.use("/api/employees", employeeRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;