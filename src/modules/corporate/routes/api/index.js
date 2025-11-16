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

// Corporate CRUD operations
router.get('/', (req, res) => corporateController.getAllCorporates(req, res));
router.get('/search', (req, res) =>
  corporateController.searchCorporates(req, res)
);
router.get('/filtered', (req, res) =>
  corporateController.getCorporatesFiltered(req, res)
);
router.get('/:id', (req, res) =>
  corporateController.getCorporateById(req, res)
);
router.post('/', requireAuth, (req, res) =>
  corporateController.createCorporate(req, res)
);
router.put('/:id', requireAuth, (req, res) =>
  corporateController.updateCorporate(req, res)
);
router.delete('/:id', requireAuth, (req, res) =>
  corporateController.deleteCorporate(req, res)
);

// Statistics and bulk operations
router.get('/stats/statistics', (req, res) =>
  corporateController.getStatistics(req, res)
);
router.put('/bulk/status', requireAuth, (req, res) =>
  corporateController.bulkUpdateStatus(req, res)
);
router.delete('/bulk/delete', requireAuth, (req, res) =>
  corporateController.bulkDelete(req, res)
);

// Export operations
router.get('/export/csv', requireAuth, (req, res) =>
  corporateController.exportToCSV(req, res)
);

module.exports = router;
