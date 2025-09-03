const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../utils/roles');
const User = require('../models/User'); // Prevent duplicate import

// ✅ Signup Route
router.post('/signup', signup);

// ✅ Login Route
router.post('/login', login);

// ✅ Admin Dashboard Route (fixed typo in path)
router.get('/admin/dashboard', authenticateToken, authorize([ROLES.ADMIN]), (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

// ✅ User Profile Route (accessible by USER and ADMIN)
router.get('/user/profile', authenticateToken, authorize([ROLES.USER, ROLES.ADMIN]), (req, res) => {
  res.json({
    message: 'Welcome to your profile',
    user: req.user // Send the user data back
  });
});

// ✅ Admin Profile Route
router.get('/admin/profile', authenticateToken, authorize([ROLES.ADMIN]), (req, res) => {
  res.json({
    message: 'Welcome to the Admin Profile',
    admin: req.user
  });
});

// ✅ Assign Role Route (admin only)
router.put('/assign-role', authenticateToken, authorize([ROLES.ADMIN]), async (req, res) => {
  const { userId, role } = req.body;

  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Role updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating role',
      error: error.message
    });
  }
});

module.exports = router;
