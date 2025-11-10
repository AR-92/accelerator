/**
 * Help controller part 1 handling overview and category articles
 */
class HelpControllerPart1 {
  constructor(helpService) {
    this.helpService = helpService;
  }

  /**
   * Get help center overview
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getHelpCenter(req, res) {
    try {
      const [categories, featuredArticles, stats] = await Promise.all([
        this.helpService.getAllCategories(),
        this.helpService.getFeaturedArticles(6),
        this.helpService.getHelpStats(),
      ]);

      res.render('pages/help/help-center', {
        title: 'Help Center - Accelerator Platform',
        layout: 'help',
        activeOverview: true,
        categories,
        featuredArticles,
        stats,
      });
    } catch (error) {
      console.error('Get help center error:', error);
      res.status(500).render('pages/help/help-center', {
        title: 'Help Center - Accelerator Platform',
        layout: 'help',
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
        this.helpService.getCategoryBySlug(categorySlug),
        this.helpService.getArticlesByCategory(categorySlug, options),
      ]);

      // Map category slug to view names and active flags
      const viewMap = {
        'getting-started': 'getting-started',
        'ai-assistant': 'ai-assistant',
        'account-billing': 'account-billing',
        faq: 'faq',
      };

      const activeFlags = {
        'getting-started': 'activeGettingStarted',
        'ai-assistant': 'activeAIAssistant',
        'account-billing': 'activeAccountBilling',
        faq: 'activeFAQ',
      };

      const viewName = viewMap[categorySlug] || 'help-center';
      const activeFlag = activeFlags[categorySlug];

      const renderData = {
        title: `${category.name} - Help Center`,
        layout: 'help',
        category,
        articles,
        currentCategory: categorySlug,
      };

      if (activeFlag) {
        renderData[activeFlag] = true;
      }

      res.render(`pages/help/${viewName}`, renderData);
    } catch (error) {
      console.error('Get category articles error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Category Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      res.status(500).render('pages/help/help-center', {
        title: 'Help Center - Accelerator Platform',
        layout: 'help',
        activeOverview: true,
        articles: [],
        error: 'Failed to load articles',
      });
    }
  }
}

module.exports = HelpControllerPart1;
