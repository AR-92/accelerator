const LearningContent = require('../../../models/LearningContent');

describe('LearningContent Model', () => {
  describe('constructor', () => {
    it('should create a LearningContent instance with valid data', () => {
      const data = {
        id: 1,
        title: 'Test Article',
        slug: 'test-article',
        content: 'Test content',
        category_id: 1,
        difficulty_level: 'beginner',
        tags: ['test', 'article'],
        is_featured: true,
        is_published: true,
      };

      const article = new LearningContent(data);

      expect(article.id).toBe(1);
      expect(article.title).toBe('Test Article');
      expect(article.slug).toBe('test-article');
      expect(article.content).toBe('Test content');
      expect(article.categoryId).toBe(1);
      expect(article.difficultyLevel).toBe('beginner');
      expect(article.tags).toEqual(['test', 'article']);
      expect(article.isFeatured).toBe(true);
      expect(article.isPublished).toBe(true);
    });

    it('should handle JSON tags correctly', () => {
      const data = {
        tags: '["tag1", "tag2"]', // JSON string
      };

      const article = new LearningContent(data);
      expect(article.tags).toEqual(['tag1', 'tag2']);
    });

    it('should set default values', () => {
      const article = new LearningContent({});
      expect(article.difficultyLevel).toBe('beginner');
      expect(article.readTimeMinutes).toBe(5);
      expect(article.tags).toEqual([]);
      expect(article.isFeatured).toBe(false);
      expect(article.isPublished).toBe(true);
    });
  });

  describe('tagsString getter/setter', () => {
    it('should convert tags array to string', () => {
      const article = new LearningContent({
        tags: ['tag1', 'tag2', 'tag3'],
      });

      expect(article.tagsString).toBe('tag1, tag2, tag3');
    });

    it('should convert string to tags array', () => {
      const article = new LearningContent({});
      article.tagsString = 'tag1, tag2, tag3';

      expect(article.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should handle empty strings', () => {
      const article = new LearningContent({});
      article.tagsString = '';

      expect(article.tags).toEqual([]);
    });
  });

  describe('validation', () => {
    it('should validate successfully with valid data', () => {
      const article = new LearningContent({
        title: 'Valid Title',
        slug: 'valid-slug',
        content: 'Valid content that is long enough',
        categoryId: 1,
      });

      expect(() => article.validate()).not.toThrow();
    });

    it('should throw ValidationError for invalid title', () => {
      const article = new LearningContent({
        title: 'Hi', // Too short
        slug: 'valid-slug',
        content: 'Valid content',
        categoryId: 1,
      });

      expect(() => article.validate()).toThrow(
        'Title must be at least 3 characters long'
      );
    });

    it('should throw ValidationError for missing slug', () => {
      const article = new LearningContent({
        title: 'Valid Title',
        content: 'Valid content',
        categoryId: 1,
      });

      expect(() => article.validate()).toThrow('Slug is required');
    });

    it('should throw ValidationError for short content', () => {
      const article = new LearningContent({
        title: 'Valid Title',
        slug: 'valid-slug',
        content: 'Hi', // Too short
        categoryId: 1,
      });

      expect(() => article.validate()).toThrow(
        'Content must be at least 10 characters long'
      );
    });

    it('should throw ValidationError for invalid difficulty level', () => {
      const article = new LearningContent({
        title: 'Valid Title',
        slug: 'valid-slug',
        content: 'Valid content that is long enough',
        categoryId: 1,
        difficulty_level: 'invalid',
      });

      expect(() => article.validate()).toThrow(
        'Difficulty level must be beginner, intermediate, or advanced'
      );
    });

    it('should throw ValidationError for invalid read time', () => {
      const article = new LearningContent({
        title: 'Valid Title',
        slug: 'valid-slug',
        content: 'Valid content that is long enough',
        categoryId: 1,
        read_time_minutes: 200, // Too high
      });

      expect(() => article.validate()).toThrow(
        'Read time must be between 1 and 120 minutes'
      );
    });
  });

  describe('toPublicJSON', () => {
    it('should return public JSON representation', () => {
      const data = {
        id: 1,
        title: 'Test Article',
        slug: 'test-article',
        excerpt: 'Test excerpt',
        content: 'Test content',
        category_id: 1,
        difficulty_level: 'beginner',
        tags: ['test'],
        is_featured: true,
        is_published: true,
        view_count: 100,
        like_count: 50,
        author_name: 'Test Author',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      };

      const article = new LearningContent(data);
      const publicJSON = article.toPublicJSON();

      expect(publicJSON.id).toBe(1);
      expect(publicJSON.title).toBe('Test Article');
      expect(publicJSON.slug).toBe('test-article');
      expect(publicJSON.categoryId).toBe(1);
      expect(publicJSON.difficultyLevel).toBe('beginner');
      expect(publicJSON.tags).toEqual(['test']);
      expect(publicJSON.isFeatured).toBe(true);
      expect(publicJSON.isPublished).toBe(true);
      expect(publicJSON.viewCount).toBe(100);
      expect(publicJSON.likeCount).toBe(50);
      expect(publicJSON.authorName).toBe('Test Author');
      expect(publicJSON.createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(publicJSON.updatedAt).toBe('2023-01-02T00:00:00.000Z');
    });
  });

  describe('SEO methods', () => {
    it('should return title for SEO title when not set', () => {
      const article = new LearningContent({
        title: 'Test Article',
      });

      expect(article.seoTitle).toBe('Test Article');
    });

    it('should return custom SEO title when set', () => {
      const article = new LearningContent({
        title: 'Test Article',
        seo_title: 'Custom SEO Title',
      });

      expect(article.seoTitle).toBe('Custom SEO Title');
    });

    it('should return excerpt for SEO description when not set', () => {
      const article = new LearningContent({
        excerpt: 'Test excerpt',
      });

      expect(article.seoDescription).toBe('Test excerpt');
    });

    it('should return custom SEO description when set', () => {
      const article = new LearningContent({
        excerpt: 'Test excerpt',
        seo_description: 'Custom SEO description',
      });

      expect(article.seoDescription).toBe('Custom SEO description');
    });
  });

  describe('view and like methods', () => {
    it('should increment view count', () => {
      const article = new LearningContent({
        view_count: 10,
      });

      article.incrementViews();
      expect(article.viewCount).toBe(11);
    });

    it('should increment like count', () => {
      const article = new LearningContent({
        like_count: 5,
      });

      article.incrementLikes();
      expect(article.likeCount).toBe(6);
    });

    it('should decrement like count', () => {
      const article = new LearningContent({
        like_count: 5,
      });

      article.decrementLikes();
      expect(article.likeCount).toBe(4);
    });

    it('should not decrement like count below 0', () => {
      const article = new LearningContent({
        like_count: 0,
      });

      article.decrementLikes();
      expect(article.likeCount).toBe(0);
    });
  });
});
