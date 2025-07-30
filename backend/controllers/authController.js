const db = require('../config/database');
const bcrypt = require("bcryptjs");

exports.registerVet = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      location,
      specialization,
      license_number,
      available_days,
      available_time
    } = req.body;

    // Check if vet with same email or license exists
    const existingVet = await db.query(
      'SELECT * FROM vets WHERE email = $1 OR license_number = $2',
      [email, license_number]
    );

    if (existingVet.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Vet already registered with this email or license number' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle files
    const license_file = req.files?.license_file?.[0]?.filename || null;
    const face_image = req.files?.face_image?.[0]?.filename || null;
    const profile_image = req.files?.profile_photo?.[0]?.filename || null;

    const insertQuery = `
      INSERT INTO vets (
        name, specialization, email, password, phone, location,
        available_days, available_time, is_online, is_approved,
        license_number, license_file, face_image, profile_image
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14
      )
      RETURNING id
    `;

    const values = [
      name,
      specialization,
      email,
      hashedPassword,
      phone,
      location,
      available_days || '[]',  // stored as TEXT
      available_time || '',
      false, // is_online
      false, // is_approved
      license_number,
      license_file,
      face_image,
      profile_image
    ];

    const result = await db.query(insertQuery, values);

    return res.status(201).json({ success: true, vet_id: result.rows[0].id });
  } catch (error) {
    console.error("Vet Registration Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong during registration." });
  }
};
