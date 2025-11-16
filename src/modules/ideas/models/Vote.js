const BaseModel = require('../../../shared/models/BaseModel');

/**
 * Vote model representing a vote on a project
 */
class Vote extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id;
    this.projectId = data.projectId || data.project_id;
    this.marketViability = data.marketViability || data.market_viability;
    this.realWorldProblem = data.realWorldProblem || data.real_world_problem;
    this.innovation = data.innovation;
    this.technicalFeasibility =
      data.technicalFeasibility || data.technical_feasibility;
    this.scalability = data.scalability;
    this.marketSurvival = data.marketSurvival || data.market_survival;
    this.score = data.score || 1; // Adding the score field that matches the DB schema
  }

  /**
   * Calculate the average score across all criteria
   * @returns {number}
   */
  get averageScore() {
    const scores = [
      this.marketViability,
      this.realWorldProblem,
      this.innovation,
      this.technicalFeasibility,
      this.scalability,
      this.marketSurvival,
    ];

    const validScores = scores.filter(
      (score) => score !== null && score !== undefined
    );
    if (validScores.length === 0) return 0;

    return (
      validScores.reduce((sum, score) => sum + score, 0) / validScores.length
    );
  }

  /**
   * Get the total score (sum of all criteria)
   * @returns {number}
   */
  get totalScore() {
    return [
      this.marketViability || 0,
      this.realWorldProblem || 0,
      this.innovation || 0,
      this.technicalFeasibility || 0,
      this.scalability || 0,
      this.marketSurvival || 0,
    ].reduce((sum, score) => sum + score, 0);
  }

  /**
   * Check if all criteria have been rated
   * @returns {boolean}
   */
  get isComplete() {
    return [
      this.marketViability,
      this.realWorldProblem,
      this.innovation,
      this.technicalFeasibility,
      this.scalability,
      this.marketSurvival,
    ].every(
      (score) =>
        score !== null && score !== undefined && score >= 0 && score <= 5
    );
  }

  /**
   * Validate vote data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.projectId || this.projectId <= 0) {
      errors.push('Project ID is required');
    }

    const criteria = [
      { name: 'marketViability', value: this.marketViability },
      { name: 'realWorldProblem', value: this.realWorldProblem },
      { name: 'innovation', value: this.innovation },
      { name: 'technicalFeasibility', value: this.technicalFeasibility },
      { name: 'scalability', value: this.scalability },
      { name: 'marketSurvival', value: this.marketSurvival },
    ];

    criteria.forEach((criterion) => {
      if (criterion.value !== null && criterion.value !== undefined) {
        if (
          typeof criterion.value !== 'number' ||
          criterion.value < 0 ||
          criterion.value > 5
        ) {
          errors.push(`${criterion.name} must be a number between 0 and 5`);
        }
      }
    });

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Vote validation failed', errors);
    }
  }

  /**
   * Get validation rules for vote creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      projectId: { required: true, type: 'number', min: 1 },
      marketViability: { required: true, min: 0, max: 5 },
      realWorldProblem: { required: true, min: 0, max: 5 },
      innovation: { required: true, min: 0, max: 5 },
      technicalFeasibility: { required: true, min: 0, max: 5 },
      scalability: { required: true, min: 0, max: 5 },
      marketSurvival: { required: true, min: 0, max: 5 },
    };
  }
}

module.exports = Vote;
