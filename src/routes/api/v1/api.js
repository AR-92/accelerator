const express = require('express');
const router = express.Router();
// Supabase operations removed
const aiRoutes = require('./ai');
const {
  getAllIdeas,
  getVotesForIdea,
  addVoteForIdea,
} = require('../../../services/databaseService');

// Include AI routes under /ai endpoint
router.use('/ai', aiRoutes);

// User and product routes removed - Supabase dependency

// GET ideas list partial for HTMX
router.get('/ideas-list', async (req, res) => {
  try {
    const ideas = await getAllIdeas();
    res.render('partials/ideas-list', {
      layout: null,
      ideas: ideas,
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// GET votes for an idea
router.get('/ideas/:ideaSlug/votes', async (req, res) => {
  try {
    const { ideaSlug } = req.params;
    const votes = await getVotesForIdea(ideaSlug);
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST vote for an idea
router.post('/ideas/:ideaSlug/votes', async (req, res) => {
  try {
    const { ideaSlug } = req.params;
    const {
      marketViability,
      realWorldProblem,
      innovation,
      technicalFeasibility,
      scalability,
      marketSurvival,
      userId,
    } = req.body;

    // Validate all required fields
    if (
      !marketViability ||
      !realWorldProblem ||
      !innovation ||
      !technicalFeasibility ||
      !scalability ||
      !marketSurvival
    ) {
      return res
        .status(400)
        .json({ error: 'All evaluation criteria are required' });
    }

    const voteData = {
      marketViability: parseInt(marketViability),
      realWorldProblem: parseInt(realWorldProblem),
      innovation: parseInt(innovation),
      technicalFeasibility: parseInt(technicalFeasibility),
      scalability: parseInt(scalability),
      marketSurvival: parseInt(marketSurvival),
      userId: userId || null,
    };

    const result = await addVoteForIdea(ideaSlug, voteData);
    const vote = {
      ...voteData,
      id: result.id,
      timestamp: new Date().toISOString(),
    };
    res.status(201).json(vote);
  } catch (error) {
    console.error('Error adding vote:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
