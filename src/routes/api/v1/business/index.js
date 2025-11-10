const express = require('express');
const router = express.Router();

const corporateRoutes = require('./corporate');
const enterpriseRoutes = require('./enterprise');
const startupRoutes = require('./startup');

router.use('/corporates', corporateRoutes);
router.use('/enterprises', enterpriseRoutes);
router.use('/startups', startupRoutes);

module.exports = router;
