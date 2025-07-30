const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const pool = require("./config/database"); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("PawPath Vet API running.");
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);

  
  pool.connect()
    .then(() => console.log(" PostgreSQL connected"))
    .catch(err => console.error(" DB connection error:", err));
});
