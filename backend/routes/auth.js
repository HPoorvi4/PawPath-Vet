const express = require("express");
const router = express.Router();
const upload = require("../middleware/auth");
const { registerVet } = require("../controllers/authController");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require('../config/database');


// Vet Registration with file upload
router.post(
  "/vet-register",
  upload.fields([
    { name: "license_file", maxCount: 1 },
    { name: "face_image", maxCount: 1 },
    { name: "profile_photo", maxCount: 1 }
  ]),
  registerVet
);

// Vet Login
router.post("/vet-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const vet = await pool.query("SELECT * FROM vets WHERE email = $1", [email]);

    if (!vet.rows.length) {
      return res.status(400).json({ success: false, message: "Vet not found" });
    }

    const vetUser = vet.rows[0];

    const validPassword = await bcrypt.compare(password, vetUser.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    if (!vetUser.is_approved) {
      return res.status(403).json({ success: false, message: "Account not approved yet" });
    }

    const token = jwt.sign(
      { id: vetUser.id, role: "vet", name: vetUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.json({
      success: true,
      token,
      vet: {
        id: vetUser.id,
        name: vetUser.name,
        email: vetUser.email,
        is_online: vetUser.is_online,
        specialization: vetUser.specialization,
        profile_image: vetUser.profile_image
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
