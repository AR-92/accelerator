const BaseModel = require('../../../shared/models/BaseModel');

/**
 * Learning Content model representing articles and learning materials
 */
class LearningContent extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.categoryId = data.category_id;
    this.title = data.title;
    this.slug = data.slug;
    this.excerpt = data.excerpt;
    this.content = data.content;
    this.featuredImage = data.featured_image;
    this.readTimeMinutes = data.read_time_minutes || 5;
    this.difficultyLevel = data.difficulty_level || 'beginner';
    this.tags = data.tags
      ? Array.isArray(data.tags)
        ? data.tags
        : JSON.parse(data.tags)
      : [];
    this.isFeatured = data.is_featured || false;
    this.isPublished = data.is_published !== false; // Default to true
    this.viewCount = data.view_count || 0;
    this.likeCount = data.like_count || 0;
    this.authorName = data.author_name;
    this.authorBio = data.author_bio;
    this.authorImage = data.author_image;
    this._seoTitle = data.seo_title;
    this._seoDescription = data.seo_description;
    this._seoKeywords = data.seo_keywords;
  }

  /**
   * Get tags as comma-separated string
   * @returns {string}
   */
  get tagsString() {
    return this.tags.join(', ');
  }

  /**
   * Set tags from comma-separated string
   * @param {string} tagsString
   */
  set tagsString(tagsString) {
    this.tags = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  /**
   * Increment view count
   */
  incrementViews() {
    this.viewCount += 1;
    this.touch();
  }

  /**
   * Increment like count
   */
  incrementLikes() {
    this.likeCount += 1;
    this.touch();
  }

  /**
   * Decrement like count
   */
  decrementLikes() {
    if (this.likeCount > 0) {
      this.likeCount -= 1;
      this.touch();
    }
  }

  /**
   * Get SEO title (fallback to regular title)
   * @returns {string}
   */
  get seoTitle() {
    return this._seoTitle || this.title;
  }

  /**
   * Get SEO description (fallback to excerpt)
   * @returns {string}
   */
  get seoDescription() {
    return this._seoDescription || this.excerpt;
  }

  /**
   * Convert to JSON
   * @returns {Object}
   */
  toJSON() {
    const obj = super.toJSON();
    obj.tags = this.tags;
    return obj;
  }

  /**
   * Convert to public JSON (for API responses)
   * @returns {Object}
   */
  toPublicJSON() {
    return {
      id: this.id,
      categoryId: this.categoryId,
      title: this.title,
      slug: this.slug,
      excerpt: this.excerpt,
      featuredImage: this.featuredImage,
      readTimeMinutes: this.readTimeMinutes,
      difficultyLevel: this.difficultyLevel,
      tags: this.tags,
      isFeatured: this.isFeatured,
      isPublished: this.isPublished,
      viewCount: this.viewCount,
      likeCount: this.likeCount,
      authorName: this.authorName,
      authorBio: this.authorBio,
      authorImage: this.authorImage,
      seoTitle: this.seoTitle,
      seoDescription: this.seoDescription,
      seoKeywords: this._seoKeywords,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Validate learning content data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (!this.slug || this.slug.trim().length === 0) {
      errors.push('Slug is required');
    }

    if (!this.content || this.content.trim().length < 10) {
      errors.push('Content must be at least 10 characters long');
    }

    if (!this.categoryId) {
      errors.push('Category ID is required');
    }

    if (
      !['beginner', 'intermediate', 'advanced'].includes(this.difficultyLevel)
    ) {
      errors.push(
        'Difficulty level must be beginner, intermediate, or advanced'
      );
    }

    if (this.readTimeMinutes < 1 || this.readTimeMinutes > 120) {
      errors.push('Read time must be between 1 and 120 minutes');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../../shared/utils/errors/ValidationError');
      throw new ValidationError(errors[0], errors);
    }
  }

  /**
   * Get validation rules for learning content creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      title: { required: true, minLength: 3 },
      slug: { required: true },
      content: { required: true, minLength: 10 },
      categoryId: { required: true },
      excerpt: { required: false },
      readTimeMinutes: { required: false, min: 1, max: 120 },
      difficultyLevel: {
        required: false,
        enum: ['beginner', 'intermediate', 'advanced'],
      },
      tags: { required: false, type: 'array' },
      isFeatured: { required: false, type: 'boolean' },
      isPublished: { required: false, type: 'boolean' },
      authorName: { required: false },
    };
  }
}

module.exports = LearningContent;
