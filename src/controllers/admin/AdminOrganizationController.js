/**
 * Admin Organization Controller
 * Handles admin operations for organizations
 */

class AdminOrganizationController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  /**
   * Show organizations list
   */
  async showOrganizations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';
      const type = req.query.type || '';

      const result = await this.adminService.getOrganizations({
        page,
        limit,
        search,
        type,
      });

      res.render('pages/admin/organizations', {
        title: 'Organizations - Admin Panel',
        activeOrganizations: true,
        mainPadding: 'py-8',
        user: req.user,
        organizations: result.organizations,
        pagination: result.pagination,
        filters: result.filters,
        stats: await this.adminService.getOrganizationStats(),
      });
    } catch (error) {
      console.error('Error showing organizations:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'main',
        message: 'Failed to load organizations',
      });
    }
  }

  /**
   * Show organization details
   */
  async showOrganizationDetails(req, res) {
    try {
      const { organizationId } = req.params;
      const organization =
        await this.adminService.getOrganizationById(organizationId);

      if (!organization) {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Not Found - Admin Panel',
          layout: 'main',
          message: 'Organization not found',
        });
      }

      // Get related users and projects
      const users = await this.adminService.getUsers({
        organizationId: organizationId,
        limit: 50,
      });

      const projects = await this.adminService.getProjects({
        organizationId: organizationId,
        limit: 50,
      });

      res.render('pages/admin/organization-details', {
        title: `${organization.name} - Admin Panel`,
        activeOrganizations: true,
        mainPadding: 'py-8',
        user: req.user,
        organization,
        users: users.users || [],
        projects: projects.projects || [],
      });
    } catch (error) {
      console.error('Error showing organization details:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'main',
        message: 'Failed to load organization details',
      });
    }
  }
}

module.exports = AdminOrganizationController;
