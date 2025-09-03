// backend/models/QRCode.js
const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "QR Code must be linked to an event"],
      index: true, // ✅ faster lookups for QR codes by event
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date, // ✅ better than String for filtering/sorting
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
      unique: true, // ✅ ensures no duplicate QR codes
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // ✅ TTL index for auto-deletion after expiry
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Optional: pre-validate to ensure expiry is in the future
qrCodeSchema.pre("save", function (next) {
  if (this.expiresAt <= new Date()) {
    return next(new Error("Expiry date must be in the future"));
  }
  next();
});

const QRCode = mongoose.model("QRCode", qrCodeSchema);
module.exports = QRCode;
