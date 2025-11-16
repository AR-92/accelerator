const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../../../../shared/middleware/auth/auth');

// Get container for controller access
const getContainer = () => require('../../../../container');

// GET help center overview
router.get('/', optionalAuth, (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.getHelpCenter(req, res);
});

// GET search results (must come before category route)
router.get('/search', optionalAuth, (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.searchArticles(req, res);
});

// GET individual help article (must come before category route)
router.get('/article/:articleSlug', optionalAuth, (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.getArticle(req, res);
});

// GET help category pages
router.get('/:categorySlug', optionalAuth, (req, res) => {
  const container = getContainer();
  const helpController = container.get('helpController');
  helpController.getCategoryArticles(req, res);
});

module.exports = router;
