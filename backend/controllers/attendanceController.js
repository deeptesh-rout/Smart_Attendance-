// backend/controllers/attendanceController.js
const Attendance = require('../models/Attendance');

exports.checkIn = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // 1️⃣ Validate input
    if (!eventId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: eventId and userId are required",
      });
    }

    // 2️⃣ Prevent duplicate check-ins
    const existingRecord = await Attendance.findOne({ event: eventId, user: userId });
    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message: "User already checked in for this event",
      });
    }

    // 3️⃣ Save attendance
    const attendance = await Attendance.create({ event: eventId, user: userId });

    return res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: attendance,
    });

  } catch (error) {
    console.error("❌ Error during check-in:", error);

    // 4️⃣ Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({
        success: false,
        message: "Duplicate entry: User already checked in",
      });
    }

    // 5️⃣ Fallback
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
