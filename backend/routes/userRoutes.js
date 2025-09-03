// backend/routes/userRoutes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const Attendance = require("../models/Attendance");

// ✅ Rate limiter to prevent spamming requests
const attendanceHistoryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each user to 5 requests per minute
  message: {
    success: false,
    message: "Too many requests. Please try again after 1 minute.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable deprecated X-RateLimit headers
});

// ✅ GET /api/user/attendance-history
router.get(
  "/attendance-history",
  authenticateToken,
  attendanceHistoryLimiter,
  async (req, res) => {
    try {
      // 1. Ensure valid user object from token
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid or missing user token",
        });
      }

      // 2. Defensive check for malformed MongoDB ObjectId
      if (!req.user._id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      // 3. Attempt to query DB safely
      let attendanceHistory;
      try {
        attendanceHistory = await Attendance.find({ userId: req.user._id })
          .sort({ date: -1 })
          .lean();
      } catch (dbError) {
        console.error("❌ Database query failed:", dbError.message);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching attendance history",
          error:
            process.env.NODE_ENV === "development" ? dbError.message : undefined,
        });
      }

      // 4. Handle empty results gracefully
      if (!attendanceHistory || attendanceHistory.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No attendance records found",
          count: 0,
          records: [],
        });
      }

      // 5. Success response
      return res.status(200).json({
        success: true,
        message: "Attendance history fetched successfully",
        count: attendanceHistory.length,
        records: attendanceHistory,
      });
    } catch (err) {
      // 6. Catch any unexpected runtime error
      console.error("❌ Unexpected error in /attendance-history:", err);

      return res.status(500).json({
        success: false,
        message: "Unexpected server error while fetching attendance history",
        error:
          process.env.NODE_ENV === "development"
            ? err.stack || err.message
            : undefined,
      });
    }
  }
);

module.exports = router;
