const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../../../../middleware/auth/auth');

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET collaborate
router.get('/collaborate', (req, res) => {
  res.render('pages/collaborate/collaborate', {
    ...getPageData('Collaboration Hub', 'Collaborate'),
    layout: 'collaborate',
    activeDashboard: true,
  });
});

// GET collaborate chat
router.get('/collaborate/chat', (req, res) => {
  res.render('pages/collaborate/chat', {
    ...getPageData('Team Chat', 'Collaborate'),
    layout: 'collaborate',
    activeChat: true,
  });
});

// GET collaborate tasks
router.get('/collaborate/tasks', (req, res) => {
  res.render('pages/collaborate/tasks', {
    ...getPageData('Task Board', 'Collaborate'),
    layout: 'collaborate',
    activeTasks: true,
  });
});

// GET collaborate files
router.get('/collaborate/files', (req, res) => {
  res.render('pages/collaborate/files', {
    ...getPageData('File Repository', 'Collaborate'),
    layout: 'collaborate',
    activeFiles: true,
  });
});

// GET collaborate team
router.get('/collaborate/team', (req, res) => {
  res.render('pages/collaborate/team', {
    ...getPageData('Team Directory', 'Collaborate'),
    layout: 'collaborate',
    activeTeam: true,
  });
});

// GET collaborate calendar
router.get('/collaborate/calendar', (req, res) => {
  res.render('pages/collaborate/calendar', {
    ...getPageData('Team Calendar', 'Collaborate'),
    layout: 'collaborate',
    activeCalendar: true,
  });
});

// GET collaborate activity
router.get('/collaborate/activity', (req, res) => {
  res.render('pages/collaborate/activity', {
    ...getPageData('Activity Timeline', 'Collaborate'),
    layout: 'collaborate',
    activeActivity: true,
  });
});

// GET collaborate settings
router.get('/collaborate/settings', (req, res) => {
  res.render('pages/collaborate/settings', {
    ...getPageData('Collaboration Settings', 'Collaborate'),
    layout: 'collaborate',
    activeSettings: true,
  });
});

// GET AI assistant chat
router.get('/collaborate/ai', (req, res) => {
  res.render(
    'pages/collaborate/ai-chat',
    getPageData('AI Assistant - Chat', 'Collaborate')
  );
});

// GET AI assistant detailed chat
router.get('/collaborate/ai-new', optionalAuth, (req, res) => {
  res.render('pages/collaborate/ai-chat-new', {
    ...getPageData('AI Assistant - Detailed Chat', 'Collaborate'),
    layout: 'main',
  });
});

// GET manus static chat
router.get('/collaborate/manus-static', (req, res) => {
  res.render(
    'pages/collaborate/manus-chat-static',
    getPageData('Manus Static Chat', 'Collaborate')
  );
});

// POST collaborate message
router.post('/pages/collaborate', (req, res) => {
  const { message } = req.body;
  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  res.send(`
    <div class="mb-4">
      <div class="font-medium text-gray-300">You</div>
      <div class="text-gray-400 text-sm mt-1">${message}</div>
      <div class="text-gray-600 text-xs mt-1">${timestamp}</div>
    </div>
  `);
});

module.exports = router;
