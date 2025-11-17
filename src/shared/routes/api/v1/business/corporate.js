const express = require('express');
const router = express.Router();
const container = require('/home/rana/Documents/accelerator/src/container');
const {
  requireAuth,
} = require('/home/rana/Documents/accelerator/src/middleware/auth/auth');

// Get corporate controller from container
const corporateController = container.get('corporateController');

// GET /api/corporates - Get all corporates
router.get('/', (req, res) => corporateController.getAllCorporates(req, res));

// GET /api/corporates/search - Search corporates
router.get('/search', (req, res) =>
  corporateController.searchCorporates(req, res)
);

// GET /api/corporates/filtered - Get corporates with advanced filtering
router.get('/filtered', (req, res) =>
  corporateController.getCorporatesFiltered(req, res)
);

// GET /api/corporates/:id - Get corporate by ID
router.get('/:id', (req, res) =>
  corporateController.getCorporateById(req, res)
);

// POST /api/corporates - Create a new corporate (requires auth)
router.post('/', requireAuth, (req, res) =>
  corporateController.createCorporate(req, res)
);

// PUT /api/corporates/:id - Update a corporate (requires auth)
router.put('/:id', requireAuth, (req, res) =>
  corporateController.updateCorporate(req, res)
);

// DELETE /api/corporates/:id - Delete a corporate (requires auth)
router.delete('/:id', requireAuth, (req, res) =>
  corporateController.deleteCorporate(req, res)
);

// GET /api/corporates/stats - Get corporate statistics
router.get('/stats', (req, res) => corporateController.getStatistics(req, res));

// POST /api/corporates/bulk/status - Bulk update corporate status
router.post('/bulk/status', requireAuth, (req, res) =>
  corporateController.bulkUpdateStatus(req, res)
);

// POST /api/corporates/bulk/delete - Bulk delete corporates
router.post('/bulk/delete', requireAuth, (req, res) =>
  corporateController.bulkDelete(req, res)
);

// GET /api/corporates/export/csv - Export corporates to CSV
router.get('/export/csv', (req, res) =>
  corporateController.exportToCSV(req, res)
);

module.exports = router;
