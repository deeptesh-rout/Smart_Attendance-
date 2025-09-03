// backend/models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    checkInTime: {
      type: Date,
      default: Date.now,
      immutable: true, // check-in time should not be modified later
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt fields
  }
);

// ✅ Prevent duplicate check-ins (same user for the same event)
attendanceSchema.index({ event: 1, user: 1 }, { unique: true });

// Optional: Pre hook to validate referenced event & user
attendanceSchema.pre("save", async function (next) {
  try {
    if (!this.event || !this.user) {
      throw new Error("Both event and user are required");
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
