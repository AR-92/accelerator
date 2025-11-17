const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../../../../middleware/auth/auth');

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET ideas
router.get('/ideas', (req, res) => {
  res.render('pages/ideas/ideas', getPageData('Submit New Idea', 'Ideas'));
});

// POST new idea
router.post('/ideas', (req, res) => {
  const { title, description, category } = req.body;

  res.send(`
    <div class="bg-gray-900 border border-gray-800 rounded p-6 mb-4 animate-fade-in">
      <div class="flex justify-between items-start">
        <div class="flex-grow">
          <h3 class="text-lg font-medium mb-2">${title}</h3>
          <p class="text-gray-400 mb-4">${description}</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded border border-purple-800/50">${category}</span>
            <span class="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded border border-gray-600">New</span>
          </div>
        </div>
        <div class="flex gap-2 ml-4">
          <button class="p-2 text-gray-400 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button class="p-2 text-gray-400 hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `);
});

// GET explore ideas page
router.get('/explore-ideas', optionalAuth, async (req, res) => {
  try {
    const container = require('../../../../container');
    const ideaService = container.get('ideaService');
    const ideas = await ideaService.getAllIdeas(null, { limit: 20 }); // Get up to 20 ideas

    res.render('pages/content/browse-ideas', {
      ...getPageData('Explore Ideas', 'ExploreIdeas'),
      layout: 'main',
      ideas: ideas,
    });
  } catch (error) {
    console.error('Error fetching ideas for explore page:', error);
    res.render('pages/content/browse-ideas', {
      ...getPageData('Explore Ideas', 'ExploreIdeas'),
      layout: 'main',
      ideas: [],
    });
  }
});

// GET learn center overview
router.get('/learn', (req, res) => {
  const container = require('../../../../container');
  const learningController = container.get('learningController');
  learningController.getLearningCenter(req, res);
});

// GET search results (must come before category route)
router.get('/learn/search', (req, res) => {
  const container = require('../../../../container');
  const learningController = container.get('learningController');
  learningController.searchArticles(req, res);
});

// GET learn category pages
router.get('/learn/:categorySlug', (req, res) => {
  const container = require('../../../../container');
  const learningController = container.get('learningController');
  learningController.getCategoryArticles(req, res);
});

// GET individual article
router.get('/learn/article/:articleSlug', (req, res) => {
  const container = require('../../../../container');
  const learningController = container.get('learningController');
  learningController.getArticle(req, res);
});

// GET help center overview
router.get('/help', (req, res) => {
  const container = require('../../../../container');
  const helpController = container.get('helpController');
  helpController.getHelpCenter(req, res);
});

// GET individual help article (must come before category route)
router.get('/help/article/:articleSlug', (req, res) => {
  console.log('ARTICLE ROUTE HIT:', req.params.articleSlug);
  const container = require('../../../../container');
  const helpController = container.get('helpController');
  helpController.getArticle(req, res);
});

// GET help category pages
router.get('/help/:categorySlug', (req, res) => {
  const container = require('../../../../container');
  const helpController = container.get('helpController');
  helpController.getCategoryArticles(req, res);
});

module.exports = router;
