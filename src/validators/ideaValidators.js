/**
 * Validation rules and middleware for ideas
 */

/**
 * Validate rating (0-5)
 */
const validateRating = (rating) => {
  const num = parseFloat(rating);
  return !isNaN(num) && num >= 0 && num <= 5;
};

/**
 * Validate tags array
 */
const validateTags = (tags) => {
  if (!Array.isArray(tags)) return false;
  return tags.every((tag) => typeof tag === 'string' && tag.trim().length > 0);
};

/**
 * Idea creation validation middleware
 */
const validateIdeaCreation = (req, res, next) => {
  const { href, title, type, typeIcon, rating, description, tags } = req.body;
  const errors = [];

  if (!href || typeof href !== 'string' || href.trim().length === 0) {
    errors.push('Valid href is required');
  }

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!type || typeof type !== 'string' || type.trim().length === 0) {
    errors.push('Type is required');
  }

  if (
    !typeIcon ||
    typeof typeIcon !== 'string' ||
    typeIcon.trim().length === 0
  ) {
    errors.push('Type icon is required');
  }

  if (rating !== undefined && !validateRating(rating)) {
    errors.push('Rating must be a number between 0 and 5');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (tags !== undefined && !validateTags(tags)) {
    errors.push('Tags must be an array of non-empty strings');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

/**
 * Idea update validation middleware
 */
const validateIdeaUpdate = (req, res, next) => {
  const { href, title, type, typeIcon, rating, description, tags } = req.body;
  const errors = [];

  if (
    href !== undefined &&
    (!href || typeof href !== 'string' || href.trim().length === 0)
  ) {
    errors.push('Valid href is required');
  }

  if (
    title !== undefined &&
    (!title || typeof title !== 'string' || title.trim().length < 3)
  ) {
    errors.push('Title must be at least 3 characters long');
  }

  if (
    type !== undefined &&
    (!type || typeof type !== 'string' || type.trim().length === 0)
  ) {
    errors.push('Type is required');
  }

  if (
    typeIcon !== undefined &&
    (!typeIcon || typeof typeIcon !== 'string' || typeIcon.trim().length === 0)
  ) {
    errors.push('Type icon is required');
  }

  if (rating !== undefined && !validateRating(rating)) {
    errors.push('Rating must be a number between 0 and 5');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (tags !== undefined && !validateTags(tags)) {
    errors.push('Tags must be an array of non-empty strings');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

/**
 * Search query validation middleware
 */
const validateSearchQuery = (req, res, next) => {
  const { q: query } = req.query;
  const errors = [];

  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    errors.push('Search query must be at least 2 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

/**
 * Query parameters validation middleware
 */
const validateQueryParams = (req, res, next) => {
  const { limit, offset, type, tags } = req.query;
  const errors = [];

  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be a number between 1 and 100');
    }
  }

  if (offset !== undefined) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      errors.push('Offset must be a non-negative number');
    }
  }

  if (type !== undefined && typeof type !== 'string') {
    errors.push('Type must be a string');
  }

  if (tags !== undefined) {
    if (typeof tags !== 'string') {
      errors.push('Tags must be a comma-separated string');
    } else {
      const tagsArray = tags.split(',').map((tag) => tag.trim());
      if (tagsArray.some((tag) => tag.length === 0)) {
        errors.push('Tags cannot be empty');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

module.exports = {
  validateIdeaCreation,
  validateIdeaUpdate,
  validateSearchQuery,
  validateQueryParams,
};
