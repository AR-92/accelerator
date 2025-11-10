const LearningContentRepository = require('../../../repositories/content/learning/LearningContentRepository');
const LearningCategoryRepository = require('../../../repositories/content/learning/LearningCategoryRepository');
const LearningContent = require('../../../models/content/LearningContent');
const LearningCategory = require('../../../models/content/LearningCategory');

// Mock database
const mockDb = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
};

describe('LearningContentRepository', () => {
  let repo;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new LearningContentRepository(mockDb);
  });

  describe('findById', () => {
    it('should find article by ID', async () => {
      const mockData = {
        id: 1,
        title: 'Test Article',
        slug: 'test-article',
        category_id: 1,
      };

      mockDb.get.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findById(1);

      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT * FROM learning_articles WHERE id = ?',
        [1],
        expect.any(Function)
      );
      expect(result).toBeInstanceOf(LearningContent);
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Article');
    });

    it('should return null when article not found', async () => {
      mockDb.get.mockImplementation((sql, params, callback) => {
        callback(null, null);
      });

      const result = await repo.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findBySlug', () => {
    it('should find published article by slug', async () => {
      const mockData = {
        id: 1,
        title: 'Test Article',
        slug: 'test-article',
        is_published: 1,
      };

      mockDb.get.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findBySlug('test-article');

      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT * FROM learning_articles WHERE slug = ? AND is_published = 1',
        ['test-article'],
        expect.any(Function)
      );
      expect(result).toBeInstanceOf(LearningContent);
      expect(result.slug).toBe('test-article');
    });

    it('should return null when article not found or not published', async () => {
      mockDb.get.mockImplementation((sql, params, callback) => {
        callback(null, null);
      });

      const result = await repo.findBySlug('nonexistent-article');

      expect(result).toBeNull();
    });
  });

  describe('findAllPublished', () => {
    it('should find all published articles', async () => {
      const mockData = [
        { id: 1, title: 'Article 1', is_published: 1 },
        { id: 2, title: 'Article 2', is_published: 1 },
      ];

      mockDb.all.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findAllPublished();

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining(
          'SELECT la.*, lc.name as category_name, lc.slug as category_slug FROM learning_articles la LEFT JOIN learning_categories lc ON la.category_id = lc.id WHERE la.is_published = 1'
        ),
        expect.any(Array),
        expect.any(Function)
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(LearningContent);
      expect(result[1]).toBeInstanceOf(LearningContent);
    });

    it('should filter by category', async () => {
      const mockData = [{ id: 1, title: 'Article 1', category_id: 1 }];

      mockDb.all.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findAllPublished({ categoryId: 1 });

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('category_id = ?'),
        expect.arrayContaining([1]),
        expect.any(Function)
      );
      expect(result).toHaveLength(1);
    });

    it('should filter by difficulty level', async () => {
      const mockData = [
        { id: 1, title: 'Article 1', difficulty_level: 'beginner' },
      ];

      mockDb.all.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findAllPublished({
        difficultyLevel: 'beginner',
      });

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('difficulty_level = ?'),
        expect.arrayContaining(['beginner']),
        expect.any(Function)
      );
      expect(result).toHaveLength(1);
    });

    it('should search by title, content, and excerpt', async () => {
      const mockData = [{ id: 1, title: 'Search Result' }];

      mockDb.all.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findAllPublished({ search: 'search term' });

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining(
          'la.title LIKE ? OR la.content LIKE ? OR la.excerpt LIKE ?'
        ),
        expect.arrayContaining([
          '%search term%',
          '%search term%',
          '%search term%',
        ]),
        expect.any(Function)
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('findByCategory', () => {
    it('should find articles by category ID', async () => {
      const mockData = [{ id: 1, title: 'Category Article', category_id: 1 }];

      mockDb.all.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findByCategory(1);

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('category_id = ?'),
        [1],
        expect.any(Function)
      );
      expect(result).toHaveLength(1);
      expect(result[0].categoryId).toBe(1);
    });
  });

  describe('findFeatured', () => {
    it('should find featured articles with limit', async () => {
      const mockData = [
        { id: 1, title: 'Featured 1', is_featured: 1 },
        { id: 2, title: 'Featured 2', is_featured: 1 },
      ];

      mockDb.all.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await repo.findFeatured(3);

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('is_featured = ?'),
        [1, 3],
        expect.any(Function)
      );
      expect(result).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const articleData = {
        title: 'New Article',
        slug: 'new-article',
        content: 'Article content',
        category_id: 1,
      };

      mockDb.run.mockImplementation(function (sql, params, callback) {
        callback.call({ lastID: 123, changes: 1 }, null);
      });

      const result = await repo.create(articleData);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO learning_articles'),
        expect.arrayContaining([
          'New Article',
          'new-article',
          'Article content',
          1,
        ]),
        expect.any(Function)
      );
      expect(result).toBe(123);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const articleData = {
        title: 'Updated Title',
        slug: 'updated-slug',
        content: 'Updated content',
        category_id: 1,
      };

      mockDb.run.mockImplementation(function (sql, params, callback) {
        callback.call({ lastID: undefined, changes: 1 }, null);
      });

      const result = await repo.update(1, articleData);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE learning_articles SET'),
        expect.arrayContaining(['Updated Title', 'Updated content', 1]),
        expect.any(Function)
      );
      expect(result).toBe(true);
    });

    it('should return false when no rows affected', async () => {
      mockDb.run.mockImplementation(function (sql, params, callback) {
        callback.call({ lastID: undefined, changes: 0 }, null);
      });

      const result = await repo.update(999, {
        title: 'Test',
        slug: 'test',
        content: 'Test content',
        category_id: 1,
      });

      expect(result).toBe(false);
    });
  });

  describe('incrementViews', () => {
    it('should increment view count', async () => {
      mockDb.run.mockImplementation(function (sql, params, callback) {
        callback.call({ lastID: undefined, changes: 1 }, null);
      });

      const result = await repo.incrementViews(1);

      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE learning_articles SET view_count = view_count + 1, updated_at = ? WHERE id = ?',
        expect.arrayContaining([expect.any(String), 1]),
        expect.any(Function)
      );
      expect(result).toBe(true);
    });
  });

  describe('incrementLikes', () => {
    it('should increment like count', async () => {
      mockDb.run.mockImplementation(function (sql, params, callback) {
        callback.call({ lastID: undefined, changes: 1 }, null);
      });

      const result = await repo.incrementLikes(1);

      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE learning_articles SET like_count = like_count + 1, updated_at = ? WHERE id = ?',
        expect.arrayContaining([expect.any(String), 1]),
        expect.any(Function)
      );
      expect(result).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return learning statistics', async () => {
      const mockStats = {
        total_articles: 10,
        featured_articles: 3,
        total_views: 150,
        total_likes: 25,
        avg_read_time: 8.5,
      };

      mockDb.get.mockImplementation((sql, params, callback) => {
        callback(null, mockStats);
      });

      const result = await repo.getStats();

      expect(result.totalArticles).toBe(10);
      expect(result.featuredArticles).toBe(3);
      expect(result.totalViews).toBe(150);
      expect(result.totalLikes).toBe(25);
      expect(result.avgReadTime).toBe(9);
    });
  });
});

describe('LearningCategoryRepository', () => {
  let categoryRepo;

  beforeEach(() => {
    jest.clearAllMocks();
    categoryRepo = new LearningCategoryRepository(mockDb);
  });

  describe('findBySlug', () => {
    it('should find active category by slug', async () => {
      const mockData = {
        id: 1,
        name: 'Getting Started',
        slug: 'getting-started',
        is_active: 1,
      };

      mockDb.get.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await categoryRepo.findBySlug('getting-started');

      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT * FROM learning_categories WHERE slug = ? AND is_active = 1',
        ['getting-started'],
        expect.any(Function)
      );
      expect(result).toBeInstanceOf(LearningCategory);
      expect(result.slug).toBe('getting-started');
    });
  });

  describe('findAllActive', () => {
    it('should find all active categories ordered by sort order', async () => {
      const mockData = [
        { id: 1, name: 'Category 1', sort_order: 1 },
        { id: 2, name: 'Category 2', sort_order: 2 },
      ];

      mockDb.all.mockImplementation((sql, params, callback) => {
        callback(null, mockData);
      });

      const result = await categoryRepo.findAllActive();

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY sort_order ASC, name ASC'),
        [],
        expect.any(Function)
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(LearningCategory);
    });
  });
});
