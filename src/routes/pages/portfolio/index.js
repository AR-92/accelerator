const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../../../middleware/auth/auth');

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET portfolio
router.get('/portfolio', optionalAuth, async (req, res) => {
  try {
    const {
      getAllPortfolio,
    } = require('../../../services/core/databaseService');
    let portfolioData = await getAllPortfolio(req.user ? req.user.id : null);

    // Handle filtering, sorting, grouping, and search
    const { category, sort, group, search } = req.query;

    if (category && category !== 'All') {
      portfolioData = portfolioData.filter(
        (item) => item.category === category
      );
    }

    if (search) {
      const term = search.toLowerCase();
      portfolioData = portfolioData.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (sort) {
      if (sort === 'votes') {
        portfolioData = portfolioData.sort((a, b) => b.votes - a.votes);
      } else if (sort === 'date') {
        portfolioData = portfolioData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }
    }

    let grouped = null;
    if (group === 'category') {
      grouped = portfolioData.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});
    }

    // Calculate dynamic stats
    const totalProjects = portfolioData.length;
    const categories = [...new Set(portfolioData.map((item) => item.category))]
      .length;
    const avgVotes =
      portfolioData.length > 0
        ? Math.round(
            portfolioData.reduce((sum, item) => sum + item.votes, 0) /
              portfolioData.length
          )
        : 0;
    const totalTags = [...new Set(portfolioData.flatMap((item) => item.tags))]
      .length;

    res.render('pages/portfolio/portfolio', {
      ...getPageData('Idea Portfolio', 'Portfolio'),
      ideas: portfolioData,
      grouped: grouped,
      currentCategory: category || 'All',
      currentSort: sort || '',
      currentGroup: group || null,
      currentSearch: search || '',
      stats: {
        projects: totalProjects,
        categories: categories,
        avgVotes: avgVotes,
        tags: totalTags,
      },
      layout: 'main',
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.render('pages/portfolio/portfolio', {
      ...getPageData('Idea Portfolio', 'Portfolio'),
      ideas: [],
      grouped: null,
      currentCategory: 'All',
      currentSort: '',
      currentGroup: null,
      currentSearch: '',
      stats: { projects: 0, categories: 0, avgVotes: 0, tags: 0 },
      layout: 'main',
    });
  }
});

// GET individual portfolio idea
router.get('/portfolio/:id', optionalAuth, async (req, res) => {
  try {
    const {
      getPortfolioById,
    } = require('../../../services/core/databaseService');
    const idea = await getPortfolioById(req.params.id);

    if (!idea) {
      return res
        .status(404)
        .render(
          'pages/error/page-not-found',
          getPageData('Idea Not Found - Accelerator Platform', '')
        );
    }

    res.render('pages/portfolio/portfolio-idea', {
      ...getPageData('Idea Details', 'Portfolio'),
      idea: idea,
      layout: 'main',
    });
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res
      .status(500)
      .render(
        'pages/error/page-not-found',
        getPageData('Internal Server Error - Accelerator Platform', '')
      );
  }
});

module.exports = router;
