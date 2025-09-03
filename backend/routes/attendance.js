// backend/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const { checkIn } = require("../controllers/attendanceController");
const { authenticateToken } = require("../middleware/authMiddleware");

// ✅ User check-in route (protected)
router.post("/checkin", authenticateToken, async (req, res) => {
  try {
    // Ensure request contains required data
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or missing token",
      });
    }

    // Example: require eventId or locationId in body
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required to check in",
      });
    }

    // Call controller logic
    const result = await checkIn(req.user._id, eventId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || "Check-in failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Check-in successful",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error during check-in:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error during check-in",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
