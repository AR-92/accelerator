/**
 * Corporate controller part 2 handling delete, statistics, bulk operations, export
 */
class CorporateControllerPart2 {
  constructor(corporateService) {
    this.corporateService = corporateService;
  }

  /**
   * Delete a corporate
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteCorporate(req, res) {
    try {
      const { id } = req.params;
      const success = await this.corporateService.deleteCorporate(parseInt(id));

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

  /**
   * Get corporate statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStatistics(req, res) {
    try {
      const stats = await this.corporateService.getStatistics();

      res.json({
        success: true,
        statistics: stats,
      });
    } catch (error) {
      console.error('Error getting corporate statistics:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching statistics',
      });
    }
  }

  /**
   * Bulk update corporate status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUpdateStatus(req, res) {
    try {
      const { corporateIds, status } = req.body;

      if (!Array.isArray(corporateIds) || corporateIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'corporateIds must be a non-empty array',
        });
      }

      if (!['active', 'inactive', 'acquired', 'failed'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status',
        });
      }

      const updatedCount = await this.corporateService.bulkUpdateStatus(
        corporateIds,
        status
      );

      res.json({
        success: true,
        message: `${updatedCount} corporate(s) updated successfully`,
        updatedCount,
      });
    } catch (error) {
      console.error('Error bulk updating corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while updating corporates',
      });
    }
  }

  /**
   * Bulk delete corporates
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkDelete(req, res) {
    try {
      const { corporateIds } = req.body;

      if (!Array.isArray(corporateIds) || corporateIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'corporateIds must be a non-empty array',
        });
      }

      const deletedCount = await this.corporateService.bulkDelete(corporateIds);

      res.json({
        success: true,
        message: `${deletedCount} corporate(s) deleted successfully`,
        deletedCount,
      });
    } catch (error) {
      console.error('Error bulk deleting corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting corporates',
      });
    }
  }

  /**
   * Export corporates to CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportToCSV(req, res) {
    try {
      const filters = req.query;
      const csvContent = await this.corporateService.exportToCSV(filters);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="corporates.csv"'
      );
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while exporting corporates',
      });
    }
  }
}

module.exports = CorporateControllerPart2;
