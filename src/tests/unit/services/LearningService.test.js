const LearningService = require('../../../services/content/LearningService');

// Mock repositories
const mockContentRepo = {
  findAllPublished: jest.fn(),
  findBySlug: jest.fn(),
  findByCategory: jest.fn(),
  findFeatured: jest.fn(),
  search: jest.fn(),
  findByTags: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getStats: jest.fn(),
};

const mockCategoryRepo = {
  findAllActive: jest.fn(),
  findBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('LearningService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LearningService(mockContentRepo, mockCategoryRepo);
  });

  describe('getAllCategories', () => {
    it('should return all active categories', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Getting Started',
          slug: 'getting-started',
          toPublicJSON: () => ({
            id: 1,
            name: 'Getting Started',
            slug: 'getting-started',
          }),
        },
        {
          id: 2,
          name: 'Courses',
          slug: 'courses',
          toPublicJSON: () => ({ id: 2, name: 'Courses', slug: 'courses' }),
        },
      ];

      mockCategoryRepo.findAllActive.mockResolvedValue(mockCategories);

      const result = await service.getAllCategories();

      expect(mockCategoryRepo.findAllActive).toHaveBeenCalled();
      expect(result).toEqual(mockCategories.map((cat) => cat.toPublicJSON()));
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category by slug', async () => {
      const mockCategory = {
        id: 1,
        name: 'Getting Started',
        slug: 'getting-started',
        toPublicJSON: () => ({
          id: 1,
          name: 'Getting Started',
          slug: 'getting-started',
        }),
      };
      mockCategoryRepo.findBySlug.mockResolvedValue(mockCategory);

      const result = await service.getCategoryBySlug('getting-started');

      expect(mockCategoryRepo.findBySlug).toHaveBeenCalledWith(
        'getting-started'
      );
      expect(result).toBe(mockCategory.toPublicJSON());
    });

    it('should throw NotFoundError when category not found', async () => {
      mockCategoryRepo.findBySlug.mockResolvedValue(null);

      await expect(service.getCategoryBySlug('nonexistent')).rejects.toThrow(
        'Learning category not found'
      );
    });
  });

  describe('getAllArticles', () => {
    it('should return all published articles', async () => {
      const mockArticles = [
        { id: 1, title: 'Article 1', slug: 'article-1' },
        { id: 2, title: 'Article 2', slug: 'article-2' },
      ];

      mockContentRepo.findAllPublished.mockResolvedValue(mockArticles);

      const result = await service.getAllArticles();

      expect(mockContentRepo.findAllPublished).toHaveBeenCalledWith({});
      expect(result).toEqual(
        mockArticles.map((article) => article.toPublicJSON())
      );
    });

    it('should pass filters to repository', async () => {
      const filters = { categoryId: 1, difficultyLevel: 'beginner' };
      const mockArticles = [{ id: 1, title: 'Filtered Article' }];

      mockContentRepo.findAllPublished.mockResolvedValue(mockArticles);

      const result = await service.getAllArticles(filters);

      expect(mockContentRepo.findAllPublished).toHaveBeenCalledWith(filters);
      expect(result).toEqual(
        mockArticles.map((article) => article.toPublicJSON())
      );
    });
  });

  describe('getArticleBySlug', () => {
    it('should return article by slug and increment views', async () => {
      const mockArticle = {
        id: 1,
        title: 'Test Article',
        slug: 'test-article',
        incrementViews: jest.fn(),
      };

      mockContentRepo.findBySlug.mockResolvedValue(mockArticle);

      const result = await service.getArticleBySlug('test-article');

      expect(mockContentRepo.findBySlug).toHaveBeenCalledWith('test-article');
      expect(mockArticle.incrementViews).toHaveBeenCalled();
      expect(result).toBe(mockArticle.toPublicJSON());
    });

    it('should throw NotFoundError when article not found', async () => {
      mockContentRepo.findBySlug.mockResolvedValue(null);

      await expect(service.getArticleBySlug('nonexistent')).rejects.toThrow(
        'Learning article not found'
      );
    });
  });

  describe('getArticlesByCategory', () => {
    it('should return articles for a category', async () => {
      const mockCategory = { id: 1, name: 'Getting Started' };
      const mockArticles = [{ id: 1, title: 'Category Article' }];

      mockCategoryRepo.findBySlug.mockResolvedValue(mockCategory);
      mockContentRepo.findByCategory.mockResolvedValue(mockArticles);

      const result = await service.getArticlesByCategory('getting-started');

      expect(mockCategoryRepo.findBySlug).toHaveBeenCalledWith(
        'getting-started'
      );
      expect(mockContentRepo.findByCategory).toHaveBeenCalledWith(1, {});
      expect(result).toEqual(
        mockArticles.map((article) => article.toPublicJSON())
      );
    });

    it('should pass filters to repository', async () => {
      const mockCategory = { id: 1, name: 'Getting Started' };
      const mockArticles = [{ id: 1, title: 'Category Article' }];
      const filters = { limit: 10 };

      mockCategoryRepo.findBySlug.mockResolvedValue(mockCategory);
      mockContentRepo.findByCategory.mockResolvedValue(mockArticles);

      const result = await service.getArticlesByCategory(
        'getting-started',
        filters
      );

      expect(mockContentRepo.findByCategory).toHaveBeenCalledWith(1, filters);
    });
  });

  describe('getFeaturedArticles', () => {
    it('should return featured articles', async () => {
      const mockArticles = [
        { id: 1, title: 'Featured 1', isFeatured: true },
        { id: 2, title: 'Featured 2', isFeatured: true },
      ];

      mockContentRepo.findFeatured.mockResolvedValue(mockArticles);

      const result = await service.getFeaturedArticles(6);

      expect(mockContentRepo.findFeatured).toHaveBeenCalledWith(6);
      expect(result).toEqual(
        mockArticles.map((article) => article.toPublicJSON())
      );
    });
  });

  describe('searchArticles', () => {
    it('should search articles with valid query', async () => {
      const mockArticles = [{ id: 1, title: 'Search Result' }];
      mockContentRepo.findAllPublished.mockResolvedValue(mockArticles);

      const result = await service.searchArticles('test query');

      expect(mockContentRepo.findAllPublished).toHaveBeenCalledWith({
        search: 'test query',
      });
      expect(result).toEqual(
        mockArticles.map((article) => article.toPublicJSON())
      );
    });

    it('should return empty array for short query', async () => {
      const result = await service.searchArticles('hi');

      expect(mockContentRepo.findAllPublished).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getArticlesByTags', () => {
    it('should return articles by tags', async () => {
      const mockArticles = [{ id: 1, title: 'Tagged Article' }];
      const tags = ['javascript', 'tutorial'];

      mockContentRepo.findByTags.mockResolvedValue(mockArticles);

      const result = await service.getArticlesByTags(tags);

      expect(mockContentRepo.findByTags).toHaveBeenCalledWith(tags, {});
      expect(result).toEqual(
        mockArticles.map((article) => article.toPublicJSON())
      );
    });
  });

  describe('getLearningStats', () => {
    it('should return learning statistics', async () => {
      const mockArticleStats = {
        totalArticles: 10,
        featuredArticles: 3,
        totalViews: 150,
        totalLikes: 25,
        avgReadTime: 8,
      };
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];

      mockContentRepo.getStats.mockResolvedValue(mockArticleStats);
      mockCategoryRepo.findAllActive.mockResolvedValue(mockCategories);

      const result = await service.getLearningStats();

      expect(result).toEqual({
        ...mockArticleStats,
        totalCategories: 2,
      });
    });
  });

  describe('createArticle', () => {
    it('should create a new article', async () => {
      const articleData = {
        title: 'New Article',
        slug: 'new-article',
        content: 'Article content',
        categoryId: 1,
      };

      mockContentRepo.create.mockResolvedValue(123);
      mockContentRepo.findById = jest.fn().mockResolvedValue({
        id: 123,
        ...articleData,
        toPublicJSON: () => ({ id: 123, ...articleData }),
      });

      const result = await service.createArticle(articleData);

      expect(mockContentRepo.create).toHaveBeenCalledWith(articleData);
      expect(result.id).toBe(123);
    });
  });

  describe('updateArticle', () => {
    it('should update an article', async () => {
      const articleData = { title: 'Updated Title' };

      mockContentRepo.update.mockResolvedValue(true);
      mockContentRepo.findById = jest.fn().mockResolvedValue({
        id: 1,
        title: 'Updated Title',
        toPublicJSON: () => ({ id: 1, title: 'Updated Title' }),
      });

      const result = await service.updateArticle(1, articleData);

      expect(mockContentRepo.update).toHaveBeenCalledWith(1, articleData);
      expect(result.id).toBe(1);
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundError when article not found', async () => {
      mockContentRepo.update.mockResolvedValue(false);

      await expect(
        service.updateArticle(999, { title: 'Test' })
      ).rejects.toThrow('Learning article not found');
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article', async () => {
      mockContentRepo.delete.mockResolvedValue(true);

      const result = await service.deleteArticle(1);

      expect(mockContentRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'New Category',
        slug: 'new-category',
      };

      mockCategoryRepo.create.mockResolvedValue(456);
      mockCategoryRepo.findById = jest.fn().mockResolvedValue({
        id: 456,
        ...categoryData,
        toPublicJSON: () => ({ id: 456, ...categoryData }),
      });

      const result = await service.createCategory(categoryData);

      expect(mockCategoryRepo.create).toHaveBeenCalledWith(categoryData);
      expect(result.id).toBe(456);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const categoryData = { name: 'Updated Name' };

      mockCategoryRepo.update.mockResolvedValue(true);
      mockCategoryRepo.findById = jest.fn().mockResolvedValue({
        id: 1,
        name: 'Updated Name',
        toPublicJSON: () => ({ id: 1, name: 'Updated Name' }),
      });

      const result = await service.updateCategory(1, categoryData);

      expect(mockCategoryRepo.update).toHaveBeenCalledWith(1, categoryData);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundError when category not found', async () => {
      mockCategoryRepo.update.mockResolvedValue(false);

      await expect(
        service.updateCategory(999, { name: 'Test' })
      ).rejects.toThrow('Learning category not found');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      mockCategoryRepo.delete.mockResolvedValue(true);

      const result = await service.deleteCategory(1);

      expect(mockCategoryRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });
});
