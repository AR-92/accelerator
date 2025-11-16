const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../../shared/middleware/auth/auth');

// Import controller from container
let corporateController;

router.use((req, res, next) => {
  if (!corporateController) {
    const container = require('../../../../container');
    corporateController = container.get('corporateController');
  }
  next();
});

// GET corporates listing page
router.get('/', (req, res) => {
  res.render('pages/admin/corporates', {
    title: 'Corporates - Accelerator Platform',
    layout: 'admin',
    activeCorporates: true,
  });
});

// GET individual corporate detail page
router.get('/:id', (req, res) => {
  res.render('pages/admin/corporate-details', {
    title: 'Corporate Details - Accelerator Platform',
    layout: 'admin',
    activeCorporates: true,
  });
});

module.exports = router;
