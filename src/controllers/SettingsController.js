/**
 * Settings controller handling HTTP requests for settings operations
 */
class SettingsController {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Update user profile settings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, email, bio } = req.body;

      const user = await this.authService.updateProfile(req.user.id, {
        firstName,
        lastName,
        email,
        bio,
      });

      // Update session
      req.session.user = user;

      res.send(
        '<div class="text-green-500">Profile updated successfully!</div>'
      );
    } catch (error) {
      console.error('Update profile error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.send(`<div class="text-red-500">${error.firstError}</div>`);
      }

      res.send(
        '<div class="text-red-500">An error occurred while updating profile</div>'
      );
    }
  }

  /**
   * Update user theme preference
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateTheme(req, res) {
    try {
      const { theme } = req.body;

      if (
        !['system', 'light', 'dark', 'green', 'purple', 'sunset'].includes(
          theme
        )
      ) {
        return res
          .status(400)
          .send('<div class="text-red-500">Invalid theme</div>');
      }

      const user = await this.authService.updateProfile(req.user.id, {
        theme,
      });

      // Update session
      req.session.user = user;

      res.json({ success: true, theme: user.theme });
    } catch (error) {
      console.error('Update theme error:', error);
      res.status(500).json({ success: false, error: 'Failed to update theme' });
    }
  }

  /**
   * Change user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      if (newPassword !== confirmNewPassword) {
        return res.send(
          '<div class="text-red-500">New passwords do not match.</div>'
        );
      }

      await this.authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.send(
        '<div class="text-green-500">Password updated successfully!</div>'
      );
    } catch (error) {
      console.error('Change password error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.send(`<div class="text-red-500">${error.firstError}</div>`);
      }

      res.send(
        '<div class="text-red-500">An error occurred while updating password</div>'
      );
    }
  }

  /**
   * Get user settings for display
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSettings(req, res) {
    try {
      const user = await this.authService.getUserById(req.user.id);
      res.json({
        success: true,
        settings: {
          theme: user.theme,
          bio: user.bio,
        },
      });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load settings',
      });
    }
  }
}

module.exports = SettingsController;
