/**
 * Admin Ideas Controller
 * Handles admin operations for ideas management
 */
class AdminIdeasController {
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
      console.error('Error in showIdeas:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
      } else {
        res.status(500).render('error', {
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? error : {},
        });
      }
    }
  }

  async showIdeaDetails(req, res) {
    try {
      const ideaId = req.params.id;
      const idea = await this.adminService.getIdeaById(ideaId);

      if (!idea) {
        return res.status(404).render('error', {
          message: 'Idea not found',
          error: {},
        });
      }

      res.render('pages/admin/idea-details', {
        title: 'Idea Details - Admin Panel',
        layout: 'admin',
        idea,
        activeIdeas: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error in showIdeaDetails:', error);
      res.status(500).render('error', {
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : {},
      });
    }
  }

  async getIdea(req, res) {
    try {
      const ideaId = req.params.id;
      const idea = await this.adminService.getIdeaById(ideaId);

      if (!idea) {
        return res
          .status(404)
          .json({ success: false, message: 'Idea not found' });
      }

      res.json({ success: true, idea });
    } catch (error) {
      console.error('Error in getIdea:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async updateIdea(req, res) {
    try {
      const ideaId = req.params.id;
      const updateData = req.body;

      const result = await this.adminService.updateIdea(ideaId, updateData);

      if (result.success) {
        res.json({ success: true, message: 'Idea updated successfully' });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error in updateIdea:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }

  async deleteIdea(req, res) {
    try {
      const ideaId = req.params.id;
      const result = await this.adminService.deleteIdea(ideaId);

      if (result.success) {
        res.json({ success: true, message: 'Idea deleted successfully' });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error in deleteIdea:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = AdminIdeasController;
