const express = require('express');
const router = express.Router();

// Get container for controller access
const getContainer = () => require('../../../../container');

// GET all categories
router.get('/categories', (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.getCategoriesAPI(req, res);
});

// GET articles by category
router.get('/categories/:categorySlug/articles', (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.getCategoryArticlesAPI(req, res);
});

// GET article by slug
router.get('/articles/:articleSlug', (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.getArticleAPI(req, res);
});

// GET search articles
router.get('/search', (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.searchArticlesAPI(req, res);
});

// POST mark article as helpful
router.post('/articles/:articleId/helpful', (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.markArticleHelpfulAPI(req, res);
});

// GET help statistics
router.get('/stats', (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.getHelpStatsAPI(req, res);
});

module.exports = router;
