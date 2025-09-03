// backend/middleware/qrMiddleware.js
const generateAttendanceQR = async (req) => {
  try {
    if (!req || !req.body || !req.body.eventId) {
      throw new Error("Missing required field: eventId");
    }

    // In real scenario: generate QR code with library like `qrcode`
    console.log("✅ QR Code Generated for event:", req.body.eventId);

    return {
      qrCode: "sample_qr_code_data",
      eventId: req.body.eventId,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error("❌ Error generating QR:", error.message);
    throw new Error("Failed to generate QR code");
  }
};

const verifyQR = async (qrCode) => {
  try {
    if (!qrCode) {
      throw new Error("QR code data is missing");
    }

    // In real scenario: decode & validate QR contents
    console.log("✅ QR Code Verified:", qrCode);

    return {
      verified: true,
      qrCode,
      verifiedAt: new Date(),
    };
  } catch (error) {
    console.error("❌ Error verifying QR:", error.message);
    throw new Error("Failed to verify QR code");
  }
};

const saveQRCode = async (qrData) => {
  try {
    if (!qrData || !qrData.qrCode) {
      throw new Error("Invalid QR data: qrCode missing");
    }

    // In real scenario: save to DB
    console.log("✅ QR Code Saved:", qrData);

    return true;
  } catch (error) {
    console.error("❌ Error saving QR:", error.message);
    throw new Error("Failed to save QR code");
  }
};

module.exports = { generateAttendanceQR, verifyQR, saveQRCode };
