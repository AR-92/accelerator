export const getVotingReward = async (req, res) => {
  try {
    const userId = req.user?.id || '3b7251ce-2c9f-4c0a-a0ef-a483db880119'; // Use dummy user for testing without auth
    if (!userId) {
      console.log('No user ID, redirecting to auth');
      return res.status(401).render('error', {
        layout: 'main',
        title: 'Unauthorized',
        error: 'User not authenticated',
      });
    }

    // Dummy data for ideas with stats
    const ideasWithStats = [
      {
        title: 'AI-Powered Task Management System',
        favorites: 45,
        likes: 128,
        copies: 23,
        views: 567,
        rating: 4.8,
      },
      {
        title: 'Sustainable Urban Farming Platform',
        favorites: 32,
        likes: 89,
        copies: 15,
        views: 423,
        rating: 4.5,
      },
      {
        title: 'Virtual Reality Learning Environment',
        favorites: 67,
        likes: 201,
        copies: 34,
        views: 892,
        rating: 4.9,
      },
      {
        title: 'Blockchain-Based Supply Chain Tracker',
        favorites: 28,
        likes: 76,
        copies: 12,
        views: 345,
        rating: 4.2,
      },
      {
        title: 'Mental Health Companion App',
        favorites: 89,
        likes: 267,
        copies: 45,
        views: 1234,
        rating: 4.7,
      },
      {
        title: 'Eco-Friendly Packaging Solution',
        favorites: 41,
        likes: 134,
        copies: 28,
        views: 678,
        rating: 4.6,
      },
      {
        title: 'Smart Home Energy Optimizer',
        favorites: 53,
        likes: 178,
        copies: 31,
        views: 756,
        rating: 4.4,
      },
      {
        title: 'Community Skill-Sharing Platform',
        favorites: 72,
        likes: 245,
        copies: 38,
        views: 945,
        rating: 4.8,
      },
    ];

    // Calculate overall rating
    const totalRating = ideasWithStats.reduce(
      (sum, idea) => sum + parseFloat(idea.rating),
      0
    );
    const overallRating = ideasWithStats.length
      ? (totalRating / ideasWithStats.length).toFixed(1)
      : 0;

    // Dummy voting history with idea details
    const votes = [
      {
        idea_id: 1,
        idea_title: 'AI-Powered Task Management System',
        created_at: '2024-12-01T10:30:00Z',
        reward_earned: 5,
      },
      {
        idea_id: 3,
        idea_title: 'Virtual Reality Learning Environment',
        created_at: '2024-12-02T14:15:00Z',
        reward_earned: 3,
      },
      {
        idea_id: 5,
        idea_title: 'Mental Health Companion App',
        created_at: '2024-12-03T09:45:00Z',
        reward_earned: 7,
      },
      {
        idea_id: 2,
        idea_title: 'Sustainable Urban Farming Platform',
        created_at: '2024-12-04T16:20:00Z',
        reward_earned: 4,
      },
      {
        idea_id: 7,
        idea_title: 'Community Skill-Sharing Platform',
        created_at: '2024-12-05T11:10:00Z',
        reward_earned: 6,
      },
      {
        idea_id: 4,
        idea_title: 'Blockchain-Based Supply Chain Tracker',
        created_at: '2024-12-06T13:25:00Z',
        reward_earned: 5,
      },
      {
        idea_id: 8,
        idea_title: 'Eco-Friendly Packaging Solution',
        created_at: '2024-12-07T08:50:00Z',
        reward_earned: 8,
      },
      {
        idea_id: 6,
        idea_title: 'Smart Home Energy Optimizer',
        created_at: '2024-12-08T15:35:00Z',
        reward_earned: 4,
      },
    ];

    const totalVotes = votes.length;
    const totalRewards = votes.reduce(
      (sum, vote) => sum + vote.reward_earned,
      0
    );
    const currentCredits = 1250; // Dummy current credits

    console.log('Rendering voting-reward with dummy data:', {
      ideasCount: ideasWithStats.length,
      overallRating,
      totalVotes,
      totalRewards,
      currentCredits,
    });

    res.render('voting-reward', {
      layout: 'voting-reward',
      title: 'Voting & Rewards',
      section: 'voting',
      currentSection: 'voting',
      currentPage: 'Voting & Rewards',
      ideas: ideasWithStats,
      overallRating,
      totalVotes,
      totalRewards,
      currentCredits,
      votes: votes,
    });
  } catch (error) {
    console.error('Error loading voting reward page:', error);
    res.status(500).render('error', {
      layout: 'main',
      title: 'Error',
      error: 'Failed to load voting reward page',
    });
  }
};
