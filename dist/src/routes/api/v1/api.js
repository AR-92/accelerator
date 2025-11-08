const express = require('express');
const router = express.Router();
// Supabase operations removed
const aiRoutes = require('./ai');

// Include AI routes under /ai endpoint
router.use('/ai', aiRoutes);

// User and product routes removed - Supabase dependency

// GET ideas list partial for HTMX
router.get('/ideas-list', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const ideasPath = path.join(__dirname, '../../../../data/ideas.json');
  const ideas = JSON.parse(fs.readFileSync(ideasPath, 'utf8'));

  res.render('partials/ideas-list', {
    layout: null,
    ideas: ideas,
  });
});

// GET votes for an idea
router.get('/ideas/:ideaSlug/votes', (req, res) => {
  try {
    const { ideaSlug } = req.params;
    const fs = require('fs');
    const path = require('path');
    const votesPath = path.join(__dirname, '../../../../data/votes.json');

    let votes = {};
    if (fs.existsSync(votesPath)) {
      votes = JSON.parse(fs.readFileSync(votesPath, 'utf8'));
    }

    const ideaVotes = votes[ideaSlug] || [];
    res.json(ideaVotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST vote for an idea
router.post('/ideas/:ideaSlug/votes', (req, res) => {
  try {
    const { ideaSlug } = req.params;
    const {
      marketViability,
      realWorldProblem,
      innovation,
      technicalFeasibility,
      scalability,
      marketSurvival,
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

    const fs = require('fs');
    const path = require('path');
    const votesPath = path.join(__dirname, '../../../../data/votes.json');

    let votes = {};
    if (fs.existsSync(votesPath)) {
      votes = JSON.parse(fs.readFileSync(votesPath, 'utf8'));
    }

    if (!votes[ideaSlug]) votes[ideaSlug] = [];

    const vote = {
      marketViability: parseInt(marketViability),
      realWorldProblem: parseInt(realWorldProblem),
      innovation: parseInt(innovation),
      technicalFeasibility: parseInt(technicalFeasibility),
      scalability: parseInt(scalability),
      marketSurvival: parseInt(marketSurvival),
      timestamp: new Date().toISOString(),
    };

    votes[ideaSlug].push(vote);

    fs.writeFileSync(votesPath, JSON.stringify(votes, null, 2));

    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
