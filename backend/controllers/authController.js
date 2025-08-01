const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ✅ Vet Registration Controller
const registerVet = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !req.files?.license_file || !req.files?.profile_photo) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if email already exists
    const emailCheck = await pool.query("SELECT * FROM vet WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // File paths
    const licensePath = path.join("uploads", req.files.license_file[0].filename);
    const photoPath = path.join("uploads", req.files.profile_photo[0].filename);

    // Insert vet into DB (default approval false)
    await pool.query(
      `INSERT INTO vet (name, email, password, license_file, profile_photo, isApproved) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, hashedPassword, licensePath, photoPath, false]
    );

    return res.status(201).json({ success: true, message: "Registration successful. Awaiting admin approval." });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Vet Login Controller
const loginVet = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Check vet exists
    const result = await pool.query("SELECT * FROM vet WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const vet = result.rows[0];

    // Check approval
    if (!vet.isapproved) {
      return res.status(403).json({ success: false, message: "Vet not approved yet. Please wait for admin approval." });
    }

    // Verify password
    const match = await bcrypt.compare(password, vet.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: vet.id, email: vet.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      vet: {
        id: vet.id,
        name: vet.name,
        email: vet.email,
        profile_photo: vet.profile_photo,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  registerVet,
  loginVet,
};
