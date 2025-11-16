/**
 * Admin Corporate Controller
 * Handles admin operations for corporate management
 */
class AdminCorporateController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  async showCorporates(req, res) {
    try {
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getCorporates({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        offset: (page - 1) * limit,
      });

      if (isAjax) {
        res.json({
          success: true,
          corporates: result.corporates,
          pagination: result.pagination,
          filters: { search, sortBy, sortOrder },
        });
      } else {
        res.render('pages/admin/corporates', {
          title: 'Corporates Management - Admin Panel',
          layout: 'admin',
          corporates: result.corporates,
          pagination: result.pagination,
          filters: { search, sortBy, sortOrder },
          activeCorporates: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading corporates page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading corporates.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'error-admin',
          message: 'An error occurred while loading corporates management.',
          user: req.user,
        });
      }
    }
  }

  async createCorporate(req, res) {
    try {
      const corporateData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const corporate = await this.adminService.createCorporate(
        corporateData,
        adminInfo
      );

      res.json({
        success: true,
        corporate,
        message: 'Corporate created successfully',
      });
    } catch (error) {
      console.error('Error creating corporate:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: 'An error occurred while creating corporate',
      });
    }
  }

  async updateCorporate(req, res) {
    try {
      const { corporateId } = req.params;
      const corporateData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const corporate = await this.adminService.updateCorporate(
        parseInt(corporateId),
        corporateData,
        adminInfo
      );

      if (!corporate) {
        return res.status(404).json({
          success: false,
          error: 'Corporate not found',
        });
      }

      res.json({
        success: true,
        corporate,
        message: 'Corporate updated successfully',
      });
    } catch (error) {
      console.error('Error updating corporate:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: 'An error occurred while updating corporate',
      });
    }
  }

  async deleteCorporate(req, res) {
    try {
      const { corporateId } = req.params;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteCorporate(
        parseInt(corporateId),
        adminInfo
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Corporate not found',
        });
      }

      res.json({
        success: true,
        message: 'Corporate deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting corporate:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting corporate',
      });
    }
  }
}

module.exports = AdminCorporateController;
