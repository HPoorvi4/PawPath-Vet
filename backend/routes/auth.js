const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../middleware/auth");
const { registerVet, loginVet } = require("../controllers/authController");

// Vet Registration with file upload
router.post(
  "/vet-register",
  upload.fields([
    { name: "license_file", maxCount: 1 },
    { name: "profile_photo", maxCount: 1 }
  ]),
  handleMulterError,
  registerVet
);

// Vet Login
router.post("/vet-login", loginVet);

module.exports = router;