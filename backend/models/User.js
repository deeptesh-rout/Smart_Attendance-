// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ROLES = require("../utils/roles");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"], // adjust for your region
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // ✅ don't expose password by default in queries
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    provider: {
      type: String,
      default: "local",
      enum: ["local", "google", "github", "facebook"], // ✅ restrict to known providers
    },
    providerId: {
      type: String,
      sparse: true, // ensures providerId is unique per provider
    },
  },
  { timestamps: true } // ✅ replaces manual createdAt with automatic createdAt + updatedAt
);

// ✅ Pre-save middleware to hash password if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Method to compare passwords (for login)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Index for faster searches by email/phone
UserSchema.index({ email: 1, phoneNumber: 1 });

const User = mongoose.model("User", UserSchema);
module.exports = User;
