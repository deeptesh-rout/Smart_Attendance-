// backend/routes/attendanceRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { checkIn } = require("../controllers/attendanceController");

const router = express.Router();

// ✅ User Check-in Route
router.post("/check-in", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or missing token",
      });
    }

    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required to check in",
      });
    }

    // Call controller and pass only required params
    const result = await checkIn(req.user._id, eventId);

    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Check-in failed",
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
