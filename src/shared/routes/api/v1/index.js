const express = require('express');
const path = require('path');
const router = express.Router();

const container = require('../../../container');
const { requireAuth } = require('../../../shared/middleware/auth/auth');
const aiRoutes = require('./ai');
const businessRoutes = require('./business');
// const adminRoutes = require('../../../../admin/routes/api/v1/admin');

// Use routes
router.use('/ai', aiRoutes);
router.use('/business', businessRoutes);
// router.use('/admin', adminRoutes);

module.exports = router;
