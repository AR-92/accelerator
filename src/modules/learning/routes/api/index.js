const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../../shared/middleware/auth/auth');

// Import learning controller from container
// This will be registered by the learning module
let learningController;

router.use((req, res, next) => {
  if (!learningController) {
    const container = require('../../../../container');
    learningController = container.get('learningController');
  }
  next();
});

// GET /api/learning/categories - Get all categories
router.get('/categories', (req, res) =>
  learningController.getCategoriesAPI(req, res)
);

// GET /api/learning/categories/:categorySlug/articles - Get articles by category
router.get('/categories/:categorySlug/articles', (req, res) =>
  learningController.getCategoryArticlesAPI(req, res)
);

// GET /api/learning/articles/:articleSlug - Get article by slug
router.get('/articles/:articleSlug', (req, res) =>
  learningController.getArticleAPI(req, res)
);

// GET /api/learning/search - Search articles
router.get('/search', (req, res) =>
  learningController.searchArticlesAPI(req, res)
);

// GET /api/learning/stats - Get learning statistics
router.get('/stats', (req, res) =>
  learningController.getLearningStatsAPI(req, res)
);

// User progress routes (require authentication)
router.get('/progress/:articleId', requireAuth, (req, res) =>
  learningController.getUserArticleProgressAPI(req, res)
);

router.put('/progress/:articleId', requireAuth, (req, res) =>
  learningController.updateUserArticleProgressAPI(req, res)
);

router.post('/progress/:articleId/complete', requireAuth, (req, res) =>
  learningController.markArticleCompletedAPI(req, res)
);

router.get('/progress', requireAuth, (req, res) =>
  learningController.getUserLearningProgressAPI(req, res)
);

// Like/unlike routes (require authentication)
router.post('/articles/:articleId/like', requireAuth, (req, res) =>
  learningController.likeArticleAPI(req, res)
);

router.delete('/articles/:articleId/like', requireAuth, (req, res) =>
  learningController.unlikeArticleAPI(req, res)
);

module.exports = router;
