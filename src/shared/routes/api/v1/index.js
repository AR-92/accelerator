const express = require('express');
const router = express.Router();

const container = require('../../../../container');
const { requireAuth } = require('../../../../middleware/auth/auth');
const aiRoutes = require('../../../../main/routes/api/v1/ai');
const businessRoutes = require('../../../../main/routes/api/v1/business');
const adminRoutes = require('../../../../admin/routes/api/v1/admin');

// Use routes
router.use('/ai', aiRoutes);
router.use('/business', businessRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
