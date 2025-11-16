/**
 * Enterprise controller part 2 handling delete, statistics, bulk operations, export
 */
class EnterpriseControllerPart2 {
  constructor(enterpriseService) {
    this.enterpriseService = enterpriseService;
  }

  /**
   * Delete an enterprise
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteEnterprise(req, res) {
    try {
      const { id } = req.params;
      const success = await this.enterpriseService.deleteEnterprise(
        parseInt(id)
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Enterprise not found',
        });
      }

      res.json({
        success: true,
        message: 'Enterprise deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting enterprise:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting enterprise',
      });
    }
  }

  /**
   * Get enterprise statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStatistics(req, res) {
    try {
      const stats = await this.enterpriseService.getStatistics();

      res.json({
        success: true,
        statistics: stats,
      });
    } catch (error) {
      console.error('Error getting enterprise statistics:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching statistics',
      });
    }
  }

  /**
   * Bulk update enterprise status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUpdateStatus(req, res) {
    try {
      const { enterpriseIds, status } = req.body;

      if (!Array.isArray(enterpriseIds) || enterpriseIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'enterpriseIds must be a non-empty array',
        });
      }

      if (!['active', 'inactive', 'acquired', 'failed'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status',
        });
      }

      const updatedCount = await this.enterpriseService.bulkUpdateStatus(
        enterpriseIds,
        status
      );

      res.json({
        success: true,
        message: `${updatedCount} enterprise(s) updated successfully`,
        updatedCount,
      });
    } catch (error) {
      console.error('Error bulk updating enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while updating enterprises',
      });
    }
  }

  /**
   * Bulk delete enterprises
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkDelete(req, res) {
    try {
      const { enterpriseIds } = req.body;

      if (!Array.isArray(enterpriseIds) || enterpriseIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'enterpriseIds must be a non-empty array',
        });
      }

      const deletedCount =
        await this.enterpriseService.bulkDelete(enterpriseIds);

      res.json({
        success: true,
        message: `${deletedCount} enterprise(s) deleted successfully`,
        deletedCount,
      });
    } catch (error) {
      console.error('Error bulk deleting enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting enterprises',
      });
    }
  }

  /**
   * Export enterprises to CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportToCSV(req, res) {
    try {
      const filters = req.query;
      const csvContent = await this.enterpriseService.exportToCSV(filters);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="enterprises.csv"'
      );
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while exporting enterprises',
      });
    }
  }
}

module.exports = EnterpriseControllerPart2;
