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

router.get('/', (req, res) => enterpriseController.getAllEnterprises(req, res));
router.get('/search', (req, res) =>
  enterpriseController.searchEnterprises(req, res)
);
router.get('/filtered', (req, res) =>
  enterpriseController.getEnterprisesFiltered(req, res)
);
router.get('/:id', (req, res) =>
  enterpriseController.getEnterpriseById(req, res)
);
router.post('/', requireAuth, (req, res) =>
  enterpriseController.createEnterprise(req, res)
);
router.put('/:id', requireAuth, (req, res) =>
  enterpriseController.updateEnterprise(req, res)
);
router.delete('/:id', requireAuth, (req, res) =>
  enterpriseController.deleteEnterprise(req, res)
);
router.get('/stats/statistics', (req, res) =>
  enterpriseController.getStatistics(req, res)
);
router.put('/bulk/status', requireAuth, (req, res) =>
  enterpriseController.bulkUpdateStatus(req, res)
);
router.delete('/bulk/delete', requireAuth, (req, res) =>
  enterpriseController.bulkDelete(req, res)
);
router.get('/export/csv', requireAuth, (req, res) =>
  enterpriseController.exportToCSV(req, res)
);

module.exports = router;
