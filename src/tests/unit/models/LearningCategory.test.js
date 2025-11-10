const LearningCategory = require('../../../models/content/LearningCategory');

describe('LearningCategory Model', () => {
  describe('constructor', () => {
    it('should create a LearningCategory instance with valid data', () => {
      const data = {
        id: 1,
        name: 'Getting Started',
        slug: 'getting-started',
        description: 'Learn the basics',
        icon: 'Rocket',
        color: '#10B981',
        sort_order: 1,
        is_active: true,
      };

      const category = new LearningCategory(data);

      expect(category.id).toBe(1);
      expect(category.name).toBe('Getting Started');
      expect(category.slug).toBe('getting-started');
      expect(category.description).toBe('Learn the basics');
      expect(category.icon).toBe('Rocket');
      expect(category.color).toBe('#10B981');
      expect(category.sortOrder).toBe(1);
      expect(category.isActive).toBe(true);
    });

    it('should set default values', () => {
      const category = new LearningCategory({});
      expect(category.color).toBe('#3B82F6');
      expect(category.sortOrder).toBe(0);
      expect(category.isActive).toBe(true);
    });
  });

  describe('validation', () => {
    it('should validate successfully with valid data', () => {
      const category = new LearningCategory({
        name: 'Valid Name',
        slug: 'valid-slug',
      });

      expect(() => category.validate()).not.toThrow();
    });

    it('should throw ValidationError for short name', () => {
      const category = new LearningCategory({
        name: 'Hi', // Too short
        slug: 'valid-slug',
      });

      expect(() => category.validate()).toThrow(
        'Name must be at least 2 characters long'
      );
    });

    it('should throw ValidationError for missing slug', () => {
      const category = new LearningCategory({
        name: 'Valid Name',
      });

      expect(() => category.validate()).toThrow('Slug is required');
    });

    it('should throw ValidationError for invalid slug format', () => {
      const category = new LearningCategory({
        name: 'Valid Name',
        slug: 'Invalid Slug!', // Invalid characters
      });

      expect(() => category.validate()).toThrow(
        'Slug can only contain lowercase letters, numbers, and hyphens'
      );
    });

    it('should throw ValidationError for negative sort order', () => {
      const category = new LearningCategory({
        name: 'Valid Name',
        slug: 'valid-slug',
        sort_order: -1,
      });

      expect(() => category.validate()).toThrow(
        'Sort order cannot be negative'
      );
    });
  });

  describe('toPublicJSON', () => {
    it('should return public JSON representation', () => {
      const data = {
        id: 1,
        name: 'Getting Started',
        slug: 'getting-started',
        description: 'Learn the basics',
        icon: 'Rocket',
        color: '#10B981',
        sort_order: 1,
        is_active: true,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      };

      const category = new LearningCategory(data);
      const publicJSON = category.toPublicJSON();

      expect(publicJSON.id).toBe(1);
      expect(publicJSON.name).toBe('Getting Started');
      expect(publicJSON.slug).toBe('getting-started');
      expect(publicJSON.description).toBe('Learn the basics');
      expect(publicJSON.icon).toBe('Rocket');
      expect(publicJSON.color).toBe('#10B981');
      expect(publicJSON.sortOrder).toBe(1);
      expect(publicJSON.isActive).toBe(true);
      expect(publicJSON.createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(publicJSON.updatedAt).toBe('2023-01-02T00:00:00.000Z');
    });
  });
});
