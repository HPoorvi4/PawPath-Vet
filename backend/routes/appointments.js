const express = require("express");
const router = express.Router();
const pool = require('../config/database');
 // or '../db' if that's the filename

// GET all appointments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM appointments");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new appointment
router.post("/", async (req, res) => {
  const { pet_id, vet_id, appointment_date, reason } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO appointments (pet_id, vet_id, appointment_date, reason) VALUES ($1, $2, $3, $4) RETURNING *",
      [pet_id, vet_id, appointment_date, reason]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
