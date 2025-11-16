const express = require('express');
const router = express.Router();

const apiRoutes = require('./api/v1');
const pagesRoutes = require('./pages');

router.use('/api/v1', apiRoutes);
router.use('/pages', pagesRoutes);

module.exports = router;
