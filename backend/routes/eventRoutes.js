const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { authenticateToken, authorize } = require("../middleware/authMiddleware");
const ROLES = require("../utils/roles");

const router = express.Router();

// ✅ Admin-only event routes
router.post(
  "/create",
  authenticateToken,
  authorize([ROLES.ADMIN]),
  createEvent
);

router.get(
  "/all",
  authenticateToken,
  authorize([ROLES.ADMIN]),
  getAllEvents
);

router.get(
  "/:id",
  authenticateToken,
  authorize([ROLES.ADMIN]),
  getEventById
);

router.put(
  "/:id",
  authenticateToken,
  authorize([ROLES.ADMIN]),
  updateEvent
);

router.delete(
  "/:id",
  authenticateToken,
  authorize([ROLES.ADMIN]),
  deleteEvent
);

module.exports = router;
