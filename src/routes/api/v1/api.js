const express = require('express');
const router = express.Router();
const {
  userOperations,
  productOperations,
} = require('../../../utils/supabaseOperations');
const aiRoutes = require('./ai');

// Include AI routes under /ai endpoint
router.use('/ai', aiRoutes);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await userOperations.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await userOperations.createUser({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userOperations.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedUser = await userOperations.updateUser(id, updates);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await userOperations.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await productOperations.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new product
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productOperations.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
