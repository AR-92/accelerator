/**
 * Path Service
 * Provides centralized path management for the application
 */

const path = require('path');

class PathService {
  constructor() {
    this.rootDir = path.resolve(__dirname, '../..');
  }

  /**
   * Get the root directory of the project
   */
  get root() {
    return this.rootDir;
  }

  /**
   * Get path to src directory
   */
  get src() {
    return path.join(this.rootDir, 'src');
  }

  /**
   * Get path to views directory
   */
  get views() {
    return path.join(this.rootDir, 'views');
  }

  /**
   * Get path to public directory
   */
  get public() {
    return path.join(this.rootDir, 'public');
  }

  /**
   * Get path to logs directory
   */
  get logs() {
    return path.join(this.rootDir, 'logs');
  }

  /**
   * Get path to sql directory
   */
  get sql() {
    return path.join(this.rootDir, 'sql');
  }

  /**
   * Get path to config directory
   */
  get config() {
    return path.join(this.rootDir, 'config');
  }

  /**
   * Resolve path relative to root
   * @param {...string} paths - Path segments
   */
  resolve(...paths) {
    return path.join(this.rootDir, ...paths);
  }
}

module.exports = PathService;
