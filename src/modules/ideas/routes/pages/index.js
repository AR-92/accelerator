const express = require('express');
const router = express.Router();
const {
  requireAuth,
  optionalAuth,
} = require('../../../../shared/middleware/auth/auth');

// Import controllers from container
let ideaController;

router.use((req, res, next) => {
  if (!ideaController) {
    const container = require('../../../../container');
    ideaController = container.get('ideaController');
  }
  next();
});

// GET ideas listing page
router.get('/', optionalAuth, (req, res) => {
  res.render('pages/content/browse-ideas', {
    title: 'Browse Ideas - Accelerator Platform',
    layout: 'main',
    mainPadding: 'py-8',
  });
});

// GET individual idea detail page
router.get('/:href', optionalAuth, (req, res) => {
  res.render('pages/content/view-idea', {
    title: 'Idea Detail - Accelerator Platform',
    layout: 'main',
    mainPadding: 'py-8',
  });
});

module.exports = router;
