// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { email, username, password, phoneNumber, role } = req.body;

    // 1. Validate required fields
    if (!email || !username || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3. Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    // 7. Success response (exclude password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);

    // Handle duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }

    // Validation errors (from Mongoose schema)
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: Object.values(err.errors).map((e) => e.message) });
    }

    // Fallback
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup };
