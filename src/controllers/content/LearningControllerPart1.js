/**
 * Learning controller part 1 handling overview and category articles
 */
class LearningControllerPart1 {
  constructor(learningService) {
    this.learningService = learningService;
  }

  /**
   * Get learning center overview
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLearningCenter(req, res) {
    try {
      const [categories, featuredArticles, stats] = await Promise.all([
        this.learningService.getAllCategories(),
        this.learningService.getFeaturedArticles(6),
        this.learningService.getLearningStats(),
      ]);

      res.render('pages/learn/learn-center', {
        title: 'Learning Center - Accelerator Platform',
        layout: 'learn',
        activeOverview: true,
        categories,
        featuredArticles,
        stats,
      });
    } catch (error) {
      console.error('Get learning center error:', error);
      res.status(500).render('pages/learn/learn-center', {
        title: 'Learning Center - Accelerator Platform',
        layout: 'learn',
        activeOverview: true,
        categories: [],
        featuredArticles: [],
        stats: { totalArticles: 0, totalCategories: 0, totalViews: 0 },
      });
    }
  }

  /**
   * Get articles by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCategoryArticles(req, res) {
    try {
      const { categorySlug } = req.params;
      const { limit, offset } = req.query;

      const options = {};
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);

      const [category, articles] = await Promise.all([
        this.learningService.getCategoryBySlug(categorySlug),
        this.learningService.getArticlesByCategory(categorySlug, options),
      ]);

      // Map category slug to view names and active flags
      const viewMap = {
        'getting-started': 'getting-started',
        courses: 'courses',
        tutorials: 'tutorials',
        resources: 'resources',
      };

      const activeFlags = {
        'getting-started': 'activeGettingStarted',
        courses: 'activeCourses',
        tutorials: 'activeTutorials',
        resources: 'activeResources',
      };

      const viewName = viewMap[categorySlug] || 'learn-center';
      const activeFlag = activeFlags[categorySlug];

      const renderData = {
        title: `${category.name} - Learning Center`,
        layout: 'learn',
        category,
        articles,
        currentCategory: categorySlug,
      };

      if (activeFlag) {
        renderData[activeFlag] = true;
      }

      res.render(`pages/learn/${viewName}`, renderData);
    } catch (error) {
      console.error('Get category articles error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Category Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      res.status(500).render('pages/learn/learn-center', {
        title: 'Learning Center - Accelerator Platform',
        layout: 'learn',
        activeOverview: true,
        articles: [],
        error: 'Failed to load articles',
      });
    }
  }
}

module.exports = LearningControllerPart1;
