/**
 * Validation rules and middleware for votes
 */

/**
 * Validate vote score (0-5)
 */
const validateVoteScore = (score) => {
  const num = parseInt(score);
  return !isNaN(num) && num >= 0 && num <= 5;
};

/**
 * Vote creation validation middleware
 */
const validateVoteCreation = (req, res, next) => {
  const {
    marketViability,
    realWorldProblem,
    innovation,
    technicalFeasibility,
    scalability,
    marketSurvival,
  } = req.body;

  const errors = [];
  const criteria = [
    { name: 'marketViability', value: marketViability },
    { name: 'realWorldProblem', value: realWorldProblem },
    { name: 'innovation', value: innovation },
    { name: 'technicalFeasibility', value: technicalFeasibility },
    { name: 'scalability', value: scalability },
    { name: 'marketSurvival', value: marketSurvival },
  ];

  criteria.forEach((criterion) => {
    if (criterion.value === undefined || criterion.value === null) {
      errors.push(`${criterion.name} is required`);
    } else if (!validateVoteScore(criterion.value)) {
      errors.push(`${criterion.name} must be an integer between 0 and 5`);
    }
  });

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
 * Vote update validation middleware
 */
const validateVoteUpdate = (req, res, next) => {
  const voteData = req.body;
  const errors = [];

  const allowedFields = [
    'marketViability',
    'realWorldProblem',
    'innovation',
    'technicalFeasibility',
    'scalability',
    'marketSurvival',
  ];

  // Check if at least one field is provided
  const providedFields = Object.keys(voteData).filter((key) =>
    allowedFields.includes(key)
  );
  if (providedFields.length === 0) {
    errors.push('At least one vote criterion must be provided');
  }

  // Validate provided fields
  providedFields.forEach((field) => {
    const value = voteData[field];
    if (value !== undefined && value !== null && !validateVoteScore(value)) {
      errors.push(`${field} must be an integer between 0 and 5`);
    }
  });

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
 * Query parameters validation middleware for votes
 */
const validateVoteQueryParams = (req, res, next) => {
  const { limit } = req.query;
  const errors = [];

  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be a number between 1 and 100');
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
  validateVoteCreation,
  validateVoteUpdate,
  validateVoteQueryParams,
};
