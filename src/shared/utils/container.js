/**
 * Simple Dependency Injection Container
 * Manages service registration and resolution
 */
class Container {
  constructor() {
    this.services = new Map();
    this.instances = new Map();
  }

  /**
   * Register a service with the container
   * @param {string} name - Service name
   * @param {Function} factory - Factory function that returns the service instance
   */
  register(name, factory) {
    this.services.set(name, factory);
  }

  /**
   * Get a service instance from the container
   * @param {string} name - Service name
   * @returns {*} Service instance
   */
  get(name) {
    if (this.instances.has(name)) {
      return this.instances.get(name);
    }

    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service '${name}' not registered`);
    }

    const instance = factory(this);
    this.instances.set(name, instance);
    return instance;
  }

  /**
   * Check if a service is registered
   * @param {string} name - Service name
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Clear all instances (useful for testing)
   */
  clear() {
    this.instances.clear();
  }
}

module.exports = Container;
