const BaseRepository = require('../../../../src/shared/repositories/BaseRepository');
const HelpCategory = require('../models/HelpCategory');

/**
 * Help Category repository
 */
class HelpCategoryRepository extends BaseRepository {
  constructor(db) {
    super(db, 'help_categories');
  }

  /**
   * Find category by ID
   * @param {number} id - Category ID
   * @returns {Promise<HelpCategory|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new HelpCategory(row) : null;
  }

  /**
   * Find category by slug
   * @param {string} slug - Category slug
   * @returns {Promise<HelpCategory|null>}
   */
  async findBySlug(slug) {
    const sql =
      'SELECT * FROM help_categories WHERE slug = ? AND is_active = true';
    const row = await this.queryOne(sql, [slug]);
    return row ? new HelpCategory(row) : null;
  }

  /**
   * Find all active categories
   * @param {Object} options - Query options
   * @returns {Promise<HelpCategory[]>}
   */
  async findAllActive(options = {}) {
    let sql = 'SELECT * FROM help_categories WHERE is_active = true';
    const params = [];

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY sort_order ASC, name ASC';
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new HelpCategory(row));
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<number>} Created category ID
   */
  async create(categoryData) {
    const category = new HelpCategory(categoryData);
    category.validate();

    const data = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      sort_order: category.sortOrder,
      is_active: category.isActive,
    };

    return await super.create(data);
  }

  /**
   * Update a category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<boolean>}
   */
  async update(id, categoryData) {
    const category = new HelpCategory(categoryData);
    category.validate();

    const data = {};
    if (category.name) data.name = category.name;
    if (category.slug) data.slug = category.slug;
    if (category.description !== undefined)
      data.description = category.description;
    if (category.icon !== undefined) data.icon = category.icon;
    if (category.color) data.color = category.color;
    if (category.sortOrder !== undefined) data.sort_order = category.sortOrder;
    if (category.isActive !== undefined) data.is_active = category.isActive;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }
}

module.exports = HelpCategoryRepository;
