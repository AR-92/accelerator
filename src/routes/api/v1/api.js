const express = require('express');
const router = express.Router();
const container = require('../../../container');
const { requireAuth } = require('../../../middleware/auth');
const aiRoutes = require('./ai');

// Import learning controller
const learningController = container.get('learningController');

// Include AI routes under /ai endpoint
router.use('/ai', aiRoutes);

// User and product routes removed - Supabase dependency

// GET ideas list partial for HTMX
router.get('/ideas-list', async (req, res) => {
  const ideaController = container.get('ideaController');
  await ideaController.getAllIdeas(req, res);
});

// GET votes for an idea
router.get('/ideas/:ideaSlug/votes', async (req, res) => {
  const voteController = container.get('voteController');
  await voteController.getVotesForIdea(req, res);
});

// POST vote for an idea
router.post('/ideas/:ideaSlug/votes', requireAuth, async (req, res) => {
  const voteController = container.get('voteController');
  await voteController.addVote(req, res);
});

// Learning API routes
router.get('/learning/categories', (req, res) =>
  learningController.getCategoriesAPI(req, res)
);
router.get('/learning/categories/:categorySlug/articles', (req, res) =>
  learningController.getCategoryArticlesAPI(req, res)
);
router.get('/learning/articles/:articleSlug', (req, res) =>
  learningController.getArticleAPI(req, res)
);
router.get('/learning/search', (req, res) =>
  learningController.searchArticlesAPI(req, res)
);
router.get('/learning/stats', (req, res) =>
  learningController.getLearningStatsAPI(req, res)
);

module.exports = router;
