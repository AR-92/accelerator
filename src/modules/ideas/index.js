/**
 * Ideas Module
 *
 * Handles idea generation, management, voting, and related features.
 * This module provides both API endpoints and page routes for idea functionality.
 */

const IdeaController = require('./controllers/IdeaController');
const VoteController = require('./controllers/VoteController');
const IdeaService = require('./services/IdeaService');
const VoteService = require('./services/VoteService');
const IdeaRepository = require('./repositories/IdeaRepository');
const VoteRepository = require('./repositories/VoteRepository');
const PortfolioRepository = require('../admin/repositories/PortfolioRepository');
const Idea = require('./models/Idea');
const Vote = require('./models/Vote');

module.exports = (container) => {
  // Register repositories
  container.register(
    'ideaRepository',
    () => new IdeaRepository(container.get('db'))
  );
  container.register(
    'voteRepository',
    () => new VoteRepository(container.get('db'))
  );
  container.register(
    'portfolioRepository',
    () => new PortfolioRepository(container.get('db'))
  );

  // Register services
  container.register(
    'ideaService',
    () => new IdeaService(container.get('ideaRepository'))
  );
  container.register(
    'voteService',
    () => new VoteService(container.get('voteRepository'))
  );

  // Register controllers
  container.register(
    'ideaController',
    () => new IdeaController(container.get('ideaService'))
  );
  container.register(
    'voteController',
    () => new VoteController(container.get('voteService'))
  );

  return {
    IdeaController: container.get('ideaController'),
    VoteController: container.get('voteController'),
    IdeaService: container.get('ideaService'),
    VoteService: container.get('voteService'),
    IdeaRepository: container.get('ideaRepository'),
    VoteRepository: container.get('voteRepository'),
    PortfolioRepository: container.get('portfolioRepository'),
    Idea,
    Vote,
  };
};
