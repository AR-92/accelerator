const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../../shared/middleware/auth/auth');

// Get container for controller access
const getContainer = () => require('../../../../container');

// Apply auth middleware to all routes
router.use(requireAuth);

// GET projects
router.get('/projects', (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getProjectsAPI(req, res);
});

// GET tasks
router.get('/tasks', (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getTasksAPI(req, res);
});

// GET messages
router.get('/messages', (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getMessagesAPI(req, res);
});

// POST send message
router.post('/messages', (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.postMessage(req, res);
});

module.exports = router;
