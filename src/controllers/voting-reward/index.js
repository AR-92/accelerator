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
        rewards_received: 12,
      },
      {
        title: 'Sustainable Urban Farming Platform',
        favorites: 32,
        likes: 89,
        copies: 15,
        views: 423,
        rating: 4.5,
        rewards_received: 8,
      },
      {
        title: 'Virtual Reality Learning Environment',
        favorites: 67,
        likes: 201,
        copies: 34,
        views: 892,
        rating: 4.9,
        rewards_received: 20,
      },
      {
        title: 'Blockchain-Based Supply Chain Tracker',
        favorites: 28,
        likes: 76,
        copies: 12,
        views: 345,
        rating: 4.2,
        rewards_received: 7,
      },
      {
        title: 'Mental Health Companion App',
        favorites: 89,
        likes: 267,
        copies: 45,
        views: 1234,
        rating: 4.7,
        rewards_received: 26,
      },
      {
        title: 'Eco-Friendly Packaging Solution',
        favorites: 41,
        likes: 134,
        copies: 28,
        views: 678,
        rating: 4.6,
        rewards_received: 13,
      },
      {
        title: 'Smart Home Energy Optimizer',
        favorites: 53,
        likes: 178,
        copies: 31,
        views: 756,
        rating: 4.4,
        rewards_received: 17,
      },
      {
        title: 'Community Skill-Sharing Platform',
        favorites: 72,
        likes: 245,
        copies: 38,
        views: 945,
        rating: 4.8,
        rewards_received: 24,
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

    // Best performing idea
    const bestPerformingIdea = ideasWithStats.reduce(
      (best, idea) =>
        idea.rewards_received > best.rewards_received ? idea : best,
      ideasWithStats[0]
    );

    // Total stats will be calculated after votes

    // Top ideas leaderboard
    const topIdeas = [...ideasWithStats]
      .sort((a, b) => b.rewards_received - a.rewards_received)
      .slice(0, 5)
      .map((idea, index) => ({ ...idea, rank: index + 1 }));

    // User profile data
    const userProfile = {
      name: 'John Doe', // Dummy
      avatar: '/images/avatar.png',
      level: 5,
      joinDate: '2023-01-15',
      totalContributions: ideasWithStats.length,
      reputation: 1250,
    };

    // Advanced analytics
    const advancedAnalytics = {
      engagementRate: 78,
      conversionRate: 45,
      averageSessionTime: '12m 30s',
      topCategory: 'Technology',
    };

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

    const currentCredits = 1250; // Dummy current credits

    // Dummy data for credits given by user to voters on their ideas
    const creditsGiven = [
      {
        voter: 'Alice Johnson',
        idea: 'AI-Powered Task Management System',
        credits: 5,
        date: '2024-12-01T10:30:00Z',
      },
      {
        voter: 'Bob Smith',
        idea: 'Sustainable Urban Farming Platform',
        credits: 3,
        date: '2024-12-02T14:15:00Z',
      },
      {
        voter: 'Charlie Brown',
        idea: 'Virtual Reality Learning Environment',
        credits: 7,
        date: '2024-12-03T09:45:00Z',
      },
      {
        voter: 'Diana Prince',
        idea: 'Blockchain-Based Supply Chain Tracker',
        credits: 4,
        date: '2024-12-04T16:20:00Z',
      },
      {
        voter: 'Eve Wilson',
        idea: 'Mental Health Companion App',
        credits: 6,
        date: '2024-12-05T11:10:00Z',
      },
      {
        voter: 'Frank Miller',
        idea: 'Eco-Friendly Packaging Solution',
        credits: 5,
        date: '2024-12-06T13:25:00Z',
      },
      {
        voter: 'Grace Lee',
        idea: 'Smart Home Energy Optimizer',
        credits: 8,
        date: '2024-12-07T08:50:00Z',
      },
      {
        voter: 'Henry Davis',
        idea: 'Community Skill-Sharing Platform',
        credits: 4,
        date: '2024-12-08T15:35:00Z',
      },
    ];

    const totalVotes = votes.length;
    const totalRewards = votes.reduce(
      (sum, vote) => sum + vote.reward_earned,
      0
    );
    const totalRewardsDistributed = totalRewards;
    const totalCreditsEarned = currentCredits;
    const totalIdeas = ideasWithStats.length;
    const rewardsGiven = totalRewardsDistributed;

    // Additional data for enhanced features
    const achievements = [
      {
        id: 1,
        title: 'First Vote',
        description: 'Cast your first vote on an idea',
        icon: 'vote',
        earned: true,
        earned_date: '2024-11-15',
        color: 'primary',
      },
      {
        id: 2,
        title: 'Idea Creator',
        description: 'Created your first idea',
        icon: 'lightbulb',
        earned: true,
        earned_date: '2024-11-10',
        color: 'success',
      },
      {
        id: 3,
        title: 'Top Voter',
        description: 'Cast 50 votes this month',
        icon: 'trophy',
        earned: false,
        progress: 32,
        target: 50,
        color: 'warning',
      },
      {
        id: 4,
        title: 'Reward Collector',
        description: 'Earn 100 credits from voting',
        icon: 'coins',
        earned: false,
        progress: 67,
        target: 100,
        color: 'info',
      },
    ];

    const goals = [
      {
        id: 1,
        title: 'Monthly Voting Goal',
        current: 32,
        target: 50,
        unit: 'votes',
        color: 'primary',
        deadline: '2024-12-31',
      },
      {
        id: 2,
        title: 'Credit Earnings',
        current: 67,
        target: 100,
        unit: 'credits',
        color: 'success',
        deadline: '2024-12-31',
      },
      {
        id: 3,
        title: 'Idea Rating Goal',
        current: 4.2,
        target: 4.5,
        unit: 'rating',
        color: 'warning',
        deadline: '2024-12-31',
      },
    ];

    const performanceData = {
      votes: [12, 18, 15, 22, 28, 32, 25],
      rewards: [8, 12, 15, 18, 22, 25, 20],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      votesJson: JSON.stringify([12, 18, 15, 22, 28, 32, 25]),
      rewardsJson: JSON.stringify([8, 12, 15, 18, 22, 25, 20]),
      labelsJson: JSON.stringify([
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
      ]),
    };

    const notifications = [
      {
        id: 1,
        type: 'vote',
        message: 'Your idea "AI-Powered Task Management" received 3 new votes',
        time: '2 hours ago',
        read: false,
      },
      {
        id: 2,
        type: 'reward',
        message:
          'You earned 5 credits for voting on "Virtual Reality Learning"',
        time: '5 hours ago',
        read: false,
      },
      {
        id: 3,
        type: 'achievement',
        message: 'Congratulations! You unlocked the "Active Voter" badge',
        time: '1 day ago',
        read: true,
      },
    ];

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
      totalRewardsReceived: totalRewards,
      currentCredits,
      votes: votes,
      achievements,
      goals,
      performanceData,
      notifications,
      bestPerformingIdea,
      totalStats: {
        totalVotes,
        totalRewardsDistributed,
        totalCreditsEarned,
        totalIdeas,
      },
      rewardsGiven,
      topIdeas,
      userProfile,
      advancedAnalytics,
      creditsGiven,
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
