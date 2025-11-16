const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../../shared/middleware/auth/auth');

let enterpriseController;

router.use((req, res, next) => {
  if (!enterpriseController) {
    const container = require('../../../../container');
    enterpriseController = container.get('enterpriseController');
  }
  next();
});

router.get('/', (req, res) => {
  res.render('pages/admin/enterprises', {
    title: 'Enterprises - Accelerator Platform',
    layout: 'admin',
    activeEnterprises: true,
  });
});

router.get('/:id', (req, res) => {
  res.render('pages/admin/enterprise-details', {
    title: 'Enterprise Details - Accelerator Platform',
    layout: 'admin',
    activeEnterprises: true,
  });
});

module.exports = router;
