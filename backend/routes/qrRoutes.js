const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { generateAttendanceQR, verifyQR, saveQRCode } = require("../middleware/qrMiddleware");

const router = express.Router();

// Debugging logs (remove in production)
console.log("generateAttendanceQR type:", typeof generateAttendanceQR);
console.log("verifyQR type:", typeof verifyQR);
console.log("saveQRCode type:", typeof saveQRCode);
console.log("authenticateToken type:", typeof authenticateToken);

// Generate QR code route
router.post("/generate", authenticateToken, async (req, res) => {
    try {
        // Pass request body/user info to QR generator
        const qrData = await generateAttendanceQR(req.body);

        // Save QR code data
        await saveQRCode(qrData);

        return res.json({
            success: true,
            message: "QR generated and saved successfully",
            qrData,
        });
    } catch (error) {
        console.error("Error generating QR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate QR",
            error: error.message,
        });
    }
});

// Verify QR code route
router.post("/verify", authenticateToken, async (req, res) => {
    try {
        const { qrCode } = req.body;
        if (!qrCode) {
            return res.status(400).json({ success: false, message: "QR code is required" });
        }

        // Verify QR code data
        const verificationResult = await verifyQR(qrCode);

        return res.json({
            success: true,
            message: "QR verified successfully",
            verificationResult,
        });
    } catch (error) {
        console.error("Error verifying QR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify QR",
            error: error.message,
        });
    }
});

module.exports = router;
