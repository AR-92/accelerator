/**
 * Help controller part 2 handling individual articles and search
 */
class HelpControllerPart2 {
  constructor(helpService) {
    this.helpService = helpService;
  }

  /**
   * Get individual article
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getArticle(req, res) {
    try {
      const { articleSlug } = req.params;

      const article = await this.helpService.getArticleBySlug(articleSlug);

      if (!article) {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Article Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      // Get category information for breadcrumb
      let category = null;
      try {
        category = await this.helpService.getCategoryById(article.categoryId);
      } catch (error) {
        console.error('Category lookup failed:', error.message);
        category = { slug: 'help', name: 'Help Center' };
      }

      // Get related articles based on category and tags
      const relatedArticles = await this.helpService.getRelatedArticles(
        article.id,
        article.categoryId,
        article.tags,
        4
      );

      // Add category info to article object for template
      const articleWithCategory = {
        ...article,
        categorySlug: category.slug,
        categoryName: category.name,
      };

      res.render('pages/help/article', {
        title: `${article.title} - Help Center`,
        layout: 'help',
        article: articleWithCategory,
        relatedArticles,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get article error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Article Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      res.status(500).render('pages/error/page-not-found', {
        title: 'Error Loading Article - Accelerator Platform',
        layout: 'main',
      });
    }
  }

  /**
   * Search articles
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchArticles(req, res) {
    try {
      const { q: query, category, difficulty, limit, offset } = req.query;

      // Get categories for filter dropdown
      const categories = await this.helpService.getAllCategories();

      if (!query || query.trim().length < 2) {
        return res.render('pages/help/search-results', {
          title: 'Search Help Content - Accelerator Platform',
          layout: 'help',
          articles: [],
          categories,
          searchQuery: query || '',
          currentCategory: category || '',
          currentDifficulty: difficulty || '',
          error: 'Search query must be at least 2 characters',
        });
      }

      // Build filters object
      const filters = {};
      if (category)
        filters.categoryId = categories.find((c) => c.slug === category)?.id;
      if (difficulty) filters.difficultyLevel = difficulty;
      const pageSize = parseInt(limit) || 12;
      const currentOffset = parseInt(offset) || 0;
      filters.limit = pageSize;
      filters.offset = currentOffset;

      const [articles, totalResults] = await Promise.all([
        this.helpService.searchArticles(query.trim(), filters),
        this.helpService.countSearchResults(query.trim(), {
          ...filters,
          limit: undefined,
          offset: undefined,
        }),
      ]);

      // Calculate pagination data
      const currentPage = Math.floor(currentOffset / pageSize) + 1;
      const totalPages = Math.ceil(totalResults / pageSize);
      const hasPrevious = currentPage > 1;
      const hasNext = currentOffset + articles.length < totalResults;
      const previousOffset = Math.max(0, currentOffset - pageSize);
      const nextOffset = currentOffset + pageSize;
      const offsetStart = currentOffset + 1;
      const offsetEnd = currentOffset + articles.length;

      res.render('pages/help/search-results', {
        title: `Search Results: ${query} - Help Center`,
        layout: 'help',
        articles,
        categories,
        searchQuery: query,
        currentCategory: category || '',
        currentDifficulty: difficulty || '',
        resultCount: articles.length,
        // Pagination data
        currentPage,
        totalPages,
        hasPrevious,
        hasNext,
        previousOffset,
        nextOffset,
        offsetStart,
        offsetEnd,
        totalResults,
      });
    } catch (error) {
      console.error('Search articles error:', error);
      const categories = await this.helpService
        .getAllCategories()
        .catch(() => []);
      res.status(500).render('pages/help/search-results', {
        title: 'Search Help Content - Accelerator Platform',
        layout: 'help',
        articles: [],
        categories,
        searchQuery: req.query.q || '',
        currentCategory: req.query.category || '',
        currentDifficulty: req.query.difficulty || '',
        error: 'Search failed. Please try again.',
      });
    }
  }
}

module.exports = HelpControllerPart2;
