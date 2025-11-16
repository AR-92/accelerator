/**
 * Learning controller part 2 handling individual articles and search
 */
class LearningControllerPart2 {
  constructor(learningService) {
    this.learningService = learningService;
  }

  /**
   * Get individual article
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getArticle(req, res) {
    try {
      const { articleSlug } = req.params;
      const article = await this.learningService.getArticleBySlug(articleSlug);

      // Get related articles based on category and tags
      const relatedArticles = await this.learningService.getRelatedArticles(
        article.id,
        article.categoryId,
        article.tags,
        4
      );

      res.render('pages/learn/article', {
        title: `${article.title} - Learning Center`,
        layout: 'learn',
        article,
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
      const categories = await this.learningService.getAllCategories();

      if (!query || query.trim().length < 2) {
        return res.render('pages/learn/search-results', {
          title: 'Search Learning Content - Accelerator Platform',
          layout: 'learn',
          articles: [],
          categories,
          searchQuery: query || '',
          currentCategory: category || '',
          currentDifficulty: difficulty || '',
          error: 'Search query must be at least 2 characters',
          user: res.locals.user,
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
        this.learningService.searchArticles(query.trim(), filters),
        this.learningService.countSearchResults(query.trim(), {
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

      res.render('pages/learn/search-results', {
        title: `Search Results: ${query} - Learning Center`,
        layout: 'learn',
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
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Search articles error:', error);
      const categories = await this.learningService
        .getAllCategories()
        .catch(() => []);
      res.status(500).render('pages/learn/search-results', {
        title: 'Search Learning Content - Accelerator Platform',
        layout: 'learn',
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

module.exports = LearningControllerPart2;
