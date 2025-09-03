// backend/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: (value) => value >= new Date(),
        message: "Event date must be in the future",
      },
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event must have a creator"],
    },
  },
  { timestamps: true }
);

// ✅ Index for faster queries (common queries: date, creator)
eventSchema.index({ date: 1 });
eventSchema.index({ createdBy: 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
