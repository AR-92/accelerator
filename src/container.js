/**
 * Application container setup
 * Registers all services, repositories, and controllers using modular approach
 */

const Container = require('./utils/container');
const { db } = require('../config/database');

// Create container instance
const container = new Container();

// Register database connection
container.register('db', () => db);

// Load modules
const authModule = require('./modules/auth')(container);
const learningModule = require('./modules/learning')(container);
const helpModule = require('./modules/help')(container);
const collaborationModule = require('./modules/collaboration')(container);
const ideasModule = require('./modules/ideas')(container);
const corporateModule = require('./modules/corporate')(container);
const enterpriseModule = require('./modules/enterprise')(container);
const startupModule = require('./modules/startup')(container);
const adminModule = require('./modules/admin')(container);

module.exports = container;
