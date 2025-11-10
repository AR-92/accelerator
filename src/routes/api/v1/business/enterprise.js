const express = require('express');
const router = express.Router();
const container = require('../../../../container');
const { requireAuth } = require('../../../../middleware/auth/auth');

// Get enterprise controller from container
const enterpriseController = container.get('enterpriseController');

// GET /api/enterprises - Get all enterprises
router.get('/', (req, res) => enterpriseController.getAllEnterprises(req, res));

// GET /api/enterprises/search - Search enterprises
router.get('/search', (req, res) =>
  enterpriseController.searchEnterprises(req, res)
);

// GET /api/enterprises/filtered - Get enterprises with advanced filtering
router.get('/filtered', (req, res) =>
  enterpriseController.getEnterprisesFiltered(req, res)
);

// GET /api/enterprises/:id - Get enterprise by ID
router.get('/:id', (req, res) =>
  enterpriseController.getEnterpriseById(req, res)
);

// POST /api/enterprises - Create a new enterprise (requires auth)
router.post('/', requireAuth, (req, res) =>
  enterpriseController.createEnterprise(req, res)
);

// PUT /api/enterprises/:id - Update an enterprise (requires auth)
router.put('/:id', requireAuth, (req, res) =>
  enterpriseController.updateEnterprise(req, res)
);

// DELETE /api/enterprises/:id - Delete an enterprise (requires auth)
router.delete('/:id', requireAuth, (req, res) =>
  enterpriseController.deleteEnterprise(req, res)
);

// GET /api/enterprises/stats - Get enterprise statistics
router.get('/stats', (req, res) =>
  enterpriseController.getStatistics(req, res)
);

// POST /api/enterprises/bulk/status - Bulk update enterprise status
router.post('/bulk/status', requireAuth, (req, res) =>
  enterpriseController.bulkUpdateStatus(req, res)
);

// POST /api/enterprises/bulk/delete - Bulk delete enterprises
router.post('/bulk/delete', requireAuth, (req, res) =>
  enterpriseController.bulkDelete(req, res)
);

// GET /api/enterprises/export/csv - Export enterprises to CSV
router.get('/export/csv', (req, res) =>
  enterpriseController.exportToCSV(req, res)
);

module.exports = router;
