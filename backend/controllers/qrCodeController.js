// backend/controllers/qrController.js
const QRCode = require('../models/QRCode');

const saveQRCode = async (req, res) => {
  try {
    const { eventId, eventName, date } = req.body;
    const qrCode = req.qrCode;

    // 1️⃣ Validate required fields
    if (!eventId || !eventName || !date || !qrCode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (eventId, eventName, date, qrCode)",
      });
    }

    // 2️⃣ Ensure the event date is valid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // 3️⃣ Set expiration (default 30s)
    const expiresAt = new Date(Date.now() + 30 * 1000);

    // 4️⃣ Save QR code
    const savedQR = await QRCode.create({
      eventId,
      eventName,
      date: parsedDate,
      qrCode,
      expiresAt,
      used: false,
    });

    console.log("✅ QR Code saved:", savedQR);

    return res.status(201).json({
      success: true,
      message: "QR Code generated and saved successfully",
      data: savedQR,
    });
  } catch (error) {
    console.error("❌ Failed to save QR code:", error);

    // 5️⃣ Handle specific errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    if (error.code === 11000) { // Duplicate key error in MongoDB
      return res.status(409).json({
        success: false,
        message: "A QR code for this event already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

module.exports = { saveQRCode };
