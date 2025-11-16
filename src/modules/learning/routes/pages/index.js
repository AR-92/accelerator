const express = require('express');
const router = express.Router();

// Get container for controller access
const getContainer = () => require('../../../../container');

// Learning center routes
router.get('/', (req, res) => {
  const container = getContainer();
  const learningController = container.get('learningController');
  learningController.getLearningCenter(req, res);
});

// Search articles
router.get('/search', (req, res) => {
  const container = getContainer();
  const learningController = container.get('learningController');
  learningController.searchArticles(req, res);
});

// Category articles
router.get('/category/:categorySlug', (req, res) => {
  const container = getContainer();
  const learningController = container.get('learningController');
  learningController.getCategoryArticles(req, res);
});

// Individual article
router.get('/article/:articleSlug', (req, res) => {
  const container = getContainer();
  const learningController = container.get('learningController');
  learningController.getArticle(req, res);
});

module.exports = router;
