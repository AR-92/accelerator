const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../../shared/middleware/auth/auth');
const {
  validateProfileUpdate,
  validatePasswordChange,
} = require('../../validators/authValidators');

// Import auth controller from container
// This will be registered by the auth module
let authController;

router.use((req, res, next) => {
  if (!authController) {
    const container = require('../../../../container');
    authController = container.get('authController');
  }
  next();
});

// GET user profile
router.get('/profile', requireAuth, (req, res) =>
  authController.getProfile(req, res)
);

// PUT update user profile
router.put('/profile', requireAuth, validateProfileUpdate, (req, res) =>
  authController.updateProfile(req, res)
);

// PUT change password
router.put('/password', requireAuth, validatePasswordChange, (req, res) =>
  authController.changePassword(req, res)
);

// GET users by role (admin only)
router.get('/users/role/:role', requireAuth, (req, res) =>
  authController.getUsersByRole(req, res)
);

// GET search users
router.get('/users/search', requireAuth, (req, res) =>
  authController.searchUsers(req, res)
);

module.exports = router;
