const express = require('express');
const router = express.Router();
const {
  requireAuth,
  optionalAuth,
} = require('../../../../shared/middleware/auth/auth');

// Get container for controller access
const getContainer = () => require('../../../../container');

// GET collaboration hub
router.get('/', optionalAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getCollaborationHub(req, res);
});

// GET team chat
router.get('/chat', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getTeamChat(req, res);
});

// GET task board
router.get('/tasks', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getTaskBoard(req, res);
});

// GET file repository
router.get('/files', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getFileRepository(req, res);
});

// GET team directory
router.get('/team', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getTeamDirectory(req, res);
});

// GET team calendar
router.get('/calendar', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getTeamCalendar(req, res);
});

// GET activity timeline
router.get('/activity', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getActivityTimeline(req, res);
});

// GET collaboration settings
router.get('/settings', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.getCollaborationSettings(req, res);
});

// GET AI assistant chat
router.get('/ai', requireAuth, (req, res) => {
  res.render('pages/collaborate/ai-chat', {
    title: 'AI Assistant - Collaboration',
    layout: 'collaborate',
    activeAI: true,
    user: res.locals.user,
  });
});

// GET AI assistant detailed chat
router.get('/ai-new', requireAuth, (req, res) => {
  res.render('pages/collaborate/ai-chat-new', {
    title: 'AI Assistant - Detailed Chat',
    layout: 'main',
    user: res.locals.user,
  });
});

// GET manus static chat
router.get('/manus-static', requireAuth, (req, res) => {
  res.render('pages/collaborate/manus-chat-static', {
    title: 'Manus Static Chat',
    layout: 'main',
    user: res.locals.user,
  });
});

// POST collaborate message (legacy route for compatibility)
router.post('/', requireAuth, (req, res) => {
  const container = getContainer();
  const collaborationController = container.get('collaborationController');
  collaborationController.postMessage(req, res);
});

module.exports = router;
