// backend/middleware/checkRole.js
const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing user role",
        });
      }

      // Normalize: if a single role is passed, wrap it in an array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      if (!allowedRoles.includes(req.user.role)) {
        console.warn(
          `🚨 Access denied: User ${req.user._id} with role '${req.user.role}' tried to access '${req.originalUrl}'`
        );
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to access this resource",
        });
      }

      next(); // ✅ Role check passed
    } catch (error) {
      console.error("❌ Error in checkRole middleware:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error in role verification",
      });
    }
  };
};

module.exports = checkRole;
