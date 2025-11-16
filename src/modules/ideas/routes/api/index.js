const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../../shared/middleware/auth/auth');

// Import controllers from container
// This will be registered by the ideas module
let ideaController;
let voteController;

router.use((req, res, next) => {
  if (!ideaController) {
    const container = require('../../../../container');
    ideaController = container.get('ideaController');
    voteController = container.get('voteController');
  }
  next();
});

// Idea CRUD operations
router.get('/', (req, res) => ideaController.getAllIdeas(req, res));
router.get('/search', (req, res) => ideaController.searchIdeas(req, res));
router.get('/:href', (req, res) => ideaController.getIdeaByHref(req, res));
router.post('/', requireAuth, (req, res) =>
  ideaController.createIdea(req, res)
);
router.put('/:id', requireAuth, (req, res) =>
  ideaController.updateIdea(req, res)
);
router.delete('/:id', requireAuth, (req, res) =>
  ideaController.deleteIdea(req, res)
);

// Favorite operations
router.post('/:id/favorite', requireAuth, (req, res) =>
  ideaController.toggleFavorite(req, res)
);

// Vote operations
router.get('/:ideaSlug/votes', (req, res) =>
  voteController.getVotesForIdea(req, res)
);
router.post('/:ideaSlug/votes', requireAuth, (req, res) =>
  voteController.addVote(req, res)
);
router.put('/votes/:voteId', requireAuth, (req, res) =>
  voteController.updateVote(req, res)
);
router.delete('/votes/:voteId', requireAuth, (req, res) =>
  voteController.deleteVote(req, res)
);

// Vote statistics
router.get('/:ideaSlug/votes/stats', (req, res) =>
  voteController.getVoteStats(req, res)
);

// User votes
router.get('/user/votes', requireAuth, (req, res) =>
  voteController.getUserVotes(req, res)
);

module.exports = router;
