/**
 * Admin business controller handling various admin operations
 */
class AdminBusinessController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  async showIdeas(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getIdeas({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        offset: (page - 1) * limit,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          ideas: result.ideas,
          pagination: result.pagination,
          filters: { search, sortBy, sortOrder },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/ideas', {
          title: 'Ideas Management - Admin Panel',
          layout: 'admin',
          ideas: result.ideas,
          pagination: result.pagination,
          filters: { search, sortBy, sortOrder },
          activeIdeas: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading ideas page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading ideas.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'error-admin',
          message: 'An error occurred while loading ideas management.',
          user: req.user,
        });
      }
    }
  }

  async showIdeaDetails(req, res) {
    try {
      const { ideaId } = req.params;
      res.render('pages/admin/idea-details', {
        title: 'Idea Details - Admin Panel',
        layout: 'admin',
        activeIdeas: true,
        user: req.user,
        ideaId,
      });
    } catch (error) {
      console.error('Error loading idea details:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading idea details.',
        user: req.user,
      });
    }
  }

  async getIdea(req, res) {
    try {
      const { ideaId } = req.params;
      const idea = await this.adminService.getIdea(parseInt(ideaId));
      res.json({ success: true, idea });
    } catch (error) {
      console.error('Error getting idea:', error);
      res.status(500).json({ success: false, error: 'Failed to get idea' });
    }
  }

  async updateLandingPageSectionOrder(req, res) {
    try {
      const { sectionId } = req.params;
      const { order } = req.body;
      const section = await this.adminService.updateLandingPageSectionOrder(
        parseInt(sectionId),
        order
      );
      res.json({
        success: true,
        section,
        message: 'Order updated successfully',
      });
    } catch (error) {
      console.error('Error updating landing page section order:', error);
      res.status(500).json({ success: false, error: 'Failed to update order' });
    }
  }

  async showCollaborations(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'timestamp';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getCollaborations({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        offset: (page - 1) * limit,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          collaborations: result.collaborations,
          pagination: result.pagination,
          filters: result.filters,
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/collaborations', {
          title: 'Collaborations Management - Admin Panel',
          layout: 'admin',
          collaborations: result.collaborations,
          pagination: result.pagination,
          filters: result.filters,
          activeCollaborations: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading collaborations page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading collaborations.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'error-admin',
          message: 'An error occurred while loading collaborations management.',
          user: req.user,
        });
      }
    }
  }

  async showCollaborationDetails(req, res) {
    try {
      const { projectId } = req.params;
      res.render('pages/admin/collaboration-details', {
        title: 'Collaboration Details - Admin Panel',
        layout: 'admin',
        activeCollaborations: true,
        user: req.user,
        projectId,
      });
    } catch (error) {
      console.error('Error loading collaboration details:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading collaboration details.',
        user: req.user,
      });
    }
  }

  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const project = await this.adminService.getProject(parseInt(projectId));
      res.json({ success: true, project });
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ success: false, error: 'Failed to get project' });
    }
  }

  async updateProjectStatus(req, res) {
    try {
      const { projectId } = req.params;
      const { status } = req.body;
      const project = await this.adminService.updateProjectStatus(
        parseInt(projectId),
        status
      );
      res.json({
        success: true,
        project,
        message: 'Status updated successfully',
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      res
        .status(500)
        .json({ success: false, error: 'Failed to update status' });
    }
  }

  async removeUserFromProject(req, res) {
    try {
      const { projectId, userId } = req.params;
      const success = await this.adminService.removeUserFromProject(
        parseInt(projectId),
        parseInt(userId)
      );
      res.json({
        success,
        message: success ? 'User removed successfully' : 'User not found',
      });
    } catch (error) {
      console.error('Error removing user from project:', error);
      res.status(500).json({ success: false, error: 'Failed to remove user' });
    }
  }

  async deleteProject(req, res) {
    try {
      const { projectId } = req.params;
      const success = await this.adminService.deleteProject(
        parseInt(projectId)
      );
      res.json({
        success,
        message: success ? 'Project deleted successfully' : 'Project not found',
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res
        .status(500)
        .json({ success: false, error: 'Failed to delete project' });
    }
  }

  async getPackage(req, res) {
    try {
      const { packageId } = req.params;
      const packageDetails = await this.adminService.getPackageById(packageId);

      res.json({
        success: true,
        package: packageDetails,
      });
    } catch (error) {
      console.error('Error getting package:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching package details',
      });
    }
  }

  async showPackages(req, res) {
    try {
      const packagesResult = await this.adminService.getPackages({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      });

      res.render('pages/admin/packages', {
        title: 'Package Management - Admin Panel',
        layout: 'admin',
        packages: packagesResult.packages,
        pagination: packagesResult.pagination,
        activePackages: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading packages page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading packages.',
        user: req.user,
      });
    }
  }

  async showPackageDetails(req, res) {
    try {
      // Package details implementation would go here
      const { packageId } = req.params;
      const packageDetails = await this.adminService.getPackageById(packageId);

      res.render('pages/admin/package-details', {
        // Note: This template may not exist yet
        title: `Package Details - ${packageDetails.name} - Admin Panel`,
        layout: 'admin',
        package: packageDetails,
        activePackages: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading package details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading package details.',
        user: req.user,
      });
    }
  }

  async createPackage(req, res) {
    try {
      const packageData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const packageResult = await this.adminService.createPackage(
        packageData,
        adminInfo
      );

      res.json({
        success: true,
        package: packageResult,
        message: 'Package created successfully',
      });
    } catch (error) {
      console.error('Error creating package:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating package',
      });
    }
  }

  async updatePackage(req, res) {
    try {
      const { packageId } = req.params;
      const packageData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const packageResult = await this.adminService.updatePackage(
        parseInt(packageId),
        packageData,
        adminInfo
      );

      if (!packageResult) {
        return res.status(404).json({
          success: false,
          error: 'Package not found',
        });
      }

      res.json({
        success: true,
        package: packageResult,
        message: 'Package updated successfully',
      });
    } catch (error) {
      console.error('Error updating package:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating package',
      });
    }
  }

  async deletePackage(req, res) {
    try {
      const { packageId } = req.params;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deletePackage(
        parseInt(packageId),
        adminInfo
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Package not found',
        });
      }

      res.json({
        success: true,
        message: 'Package deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting package:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting package',
      });
    }
  }

  async getBillingTransaction(req, res) {
    try {
      const { billingId } = req.params;
      const transaction =
        await this.adminService.getBillingTransactionById(billingId);

      res.json({
        success: true,
        transaction: transaction,
      });
    } catch (error) {
      console.error('Error getting billing transaction:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching billing transaction details',
      });
    }
  }

  async showBilling(req, res) {
    try {
      const billingResult = await this.adminService.getBillingTransactions({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      });

      res.render('pages/admin/billing', {
        title: 'Billing Management - Admin Panel',
        layout: 'admin',
        transactions: billingResult.transactions,
        pagination: billingResult.pagination,
        activeBilling: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading billing page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading billing.',
        user: req.user,
      });
    }
  }

  async showBillingDetails(req, res) {
    try {
      const { billingId } = req.params;
      const transaction =
        await this.adminService.getBillingTransactionById(billingId);

      res.render('pages/admin/billing-details', {
        // Note: This template may not exist yet
        title: `Billing Details - Transaction ${transaction.id} - Admin Panel`,
        layout: 'admin',
        transaction,
        activeBilling: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading billing details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading billing details.',
        user: req.user,
      });
    }
  }

  async createBillingTransaction(req, res) {
    try {
      const billingData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const transaction = await this.adminService.createBillingTransaction(
        billingData,
        adminInfo
      );

      res.json({
        success: true,
        transaction,
        message: 'Billing transaction created successfully',
      });
    } catch (error) {
      console.error('Error creating billing transaction:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating billing transaction',
      });
    }
  }

  async updateBillingStatus(req, res) {
    try {
      const { billingId } = req.params;
      const { status } = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const transaction =
        await this.adminService.updateBillingTransactionStatus(
          parseInt(billingId),
          status,
          adminInfo
        );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Billing transaction not found',
        });
      }

      res.json({
        success: true,
        transaction,
        message: 'Billing transaction status updated successfully',
      });
    } catch (error) {
      console.error('Error updating billing transaction:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating billing transaction',
      });
    }
  }

  async processRefund(req, res) {
    try {
      const { billingId } = req.params;
      const { refundAmount, refundReason } = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const result = await this.adminService.processRefund(
        parseInt(billingId),
        refundAmount,
        refundReason,
        adminInfo
      );

      res.json({
        success: true,
        result,
        message: 'Refund processed successfully',
      });
    } catch (error) {
      console.error('Error processing refund:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while processing refund',
      });
    }
  }

  async getReward(req, res) {
    try {
      const { rewardId } = req.params;
      const reward = await this.adminService.getRewardById(rewardId);

      res.json({
        success: true,
        reward: reward,
      });
    } catch (error) {
      console.error('Error getting reward:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching reward details',
      });
    }
  }

  async showRewards(req, res) {
    try {
      const rewardsResult = await this.adminService.getRewards({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      });

      res.render('pages/admin/rewards', {
        title: 'Rewards Management - Admin Panel',
        layout: 'admin',
        rewards: rewardsResult.rewards,
        stats: rewardsResult.stats,
        pagination: rewardsResult.pagination,
        activeRewards: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading rewards page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading rewards.',
        user: req.user,
      });
    }
  }

  async showRewardDetails(req, res) {
    try {
      const { rewardId } = req.params;
      const reward = await this.adminService.getRewardById(rewardId);

      res.render('pages/admin/reward-details', {
        // Note: This template may not exist yet
        title: `Reward Details - ${reward.id} - Admin Panel`,
        layout: 'admin',
        reward,
        activeRewards: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading reward details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading reward details.',
        user: req.user,
      });
    }
  }

  async createReward(req, res) {
    try {
      const rewardData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const reward = await this.adminService.createReward(
        rewardData,
        adminInfo
      );

      res.json({
        success: true,
        reward,
        message: 'Reward created successfully',
      });
    } catch (error) {
      console.error('Error creating reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating reward',
      });
    }
  }

  async grantReward(req, res) {
    try {
      const { userId, type, title, credits } = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const result = await this.adminService.grantRewardToUser(
        parseInt(userId),
        type,
        title,
        parseInt(credits),
        adminInfo
      );

      res.json({
        success: true,
        result,
        message: 'Reward granted successfully',
      });
    } catch (error) {
      console.error('Error granting reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while granting reward',
      });
    }
  }

  async updateReward(req, res) {
    try {
      const { rewardId } = req.params;
      const rewardData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const reward = await this.adminService.updateReward(
        parseInt(rewardId),
        rewardData,
        adminInfo
      );

      if (!reward) {
        return res.status(404).json({
          success: false,
          error: 'Reward not found',
        });
      }

      res.json({
        success: true,
        reward,
        message: 'Reward updated successfully',
      });
    } catch (error) {
      console.error('Error updating reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating reward',
      });
    }
  }

  async deleteReward(req, res) {
    try {
      const { rewardId } = req.params;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteReward(
        parseInt(rewardId),
        adminInfo
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Reward not found',
        });
      }

      res.json({
        success: true,
        message: 'Reward deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting reward:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting reward',
      });
    }
  }

  async updateIdea(req, res) {
    try {
      const { ideaId } = req.params;
      const ideaData = req.body;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const idea = await this.adminService.updateIdea(
        parseInt(ideaId),
        ideaData,
        adminInfo
      );

      res.json({
        success: true,
        idea,
        message: 'Idea updated successfully',
      });
    } catch (error) {
      console.error('Error updating idea:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating idea',
      });
    }
  }

  async deleteIdea(req, res) {
    try {
      const { ideaId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteIdea(
        parseInt(ideaId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'Idea deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Idea not found',
        });
      }
    } catch (error) {
      console.error('Error deleting idea:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting idea',
      });
    }
  }
}

module.exports = AdminBusinessController;
