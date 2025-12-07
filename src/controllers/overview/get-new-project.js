import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { ServerDataService } from '../../services/serverDataService.js';

// New Project Page
export const getNewProject = async (req, res) => {
  try {
    logger.info('New Project page accessed');

    const filter = req.query.filter || 'all-projects';
    const showCard = req.query.showCard === 'true';

    let populateIdea = null;
    if (req.query.populate) {
      const { data: idea, error: ideaError } = await databaseService.supabase
        .from('ideas')
        .select('*')
        .eq('id', req.query.populate)
        .single();
      if (!ideaError && idea) {
        let tags = [];
        if (idea.tags) {
          if (Array.isArray(idea.tags)) {
            tags = idea.tags;
          } else if (typeof idea.tags === 'string') {
            try {
              tags = JSON.parse(idea.tags);
            } catch {
              tags = idea.tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);
            }
          }
        }
        populateIdea = {
          id: idea.id,
          name: idea.title || 'Untitled Idea',
          description: idea.description || '',
          category: idea.type,
          tags: tags,
        };
      }
    }

    // Build query based on filter
    let query = databaseService.supabase.from('ideas').select('*');

    const userId = req.user?.id;

    if (filter === 'explore') {
      // Explore shows published ideas from all users (or other users if authenticated)
      query = query.eq('status', 'active');
      if (userId) {
        query = query.neq('user_id', userId);
      }
    } else {
      // For user's own ideas, filter by user_id if authenticated
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // If not authenticated, show no ideas
        query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // No results
      }

      switch (filter) {
        case 'favorites':
          query = query.eq('is_favorite', true);
          break;
        case 'publish':
          query = query.eq('status', 'active');
          break;
        case 'unpublish':
          query = query.eq('status', 'draft');
          break;
        case 'archive':
          query = query.eq('status', 'archived');
          break;
        case 'recent':
          // Recent could be last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query = query.gte('created_at', thirtyDaysAgo.toISOString());
          break;
        case 'all-projects':
        default:
          // All projects - no additional filter
          break;
      }
    }

    // Fetch ideas from database with optimized query
    const { data: ideas, error } = await query
      .order('created_at', { ascending: false })
      .limit(12); // Limit to 12 ideas like in the hardcoded version

    if (error) {
      logger.error('Error fetching ideas:', error);
      throw error;
    }

    // Fetch all ideas for sidebar with optimized query (limit for performance)
    let allIdeasQuery = databaseService.supabase
      .from('ideas')
      .select('id, title')
      .limit(20); // Reduced limit for better performance
    if (userId) {
      allIdeasQuery = allIdeasQuery.eq('user_id', userId);
    }
    const { data: allIdeas, error: allIdeasError } = await allIdeasQuery.order(
      'created_at',
      { ascending: false }
    );

    if (allIdeasError) {
      logger.error('Error fetching all ideas:', allIdeasError);
    }

    // Truncate titles to 12 characters for sidebar display
    const truncatedAllIdeas = (allIdeas || []).map((idea) => ({
      id: idea.id,
      title:
        idea.title && idea.title.length > 12
          ? idea.title.substring(0, 23)
          : idea.title || 'Untitled',
    }));

    // Transform ideas data for template
    const transformedIdeas = (ideas || []).map((idea) => ({
      id: idea.id,
      name: idea.title || 'Untitled Idea',
      description: idea.description || 'No description available',
      status: idea.status,
      type: idea.type,
      rating: idea.rating,
      is_favorite: idea.is_favorite,
      tags: idea.tags,
      href: idea.href,
    }));

    const showCreateCard =
      showCard ||
      !!populateIdea ||
      (filter === 'all-projects' && transformedIdeas.length === 0);

    const overviewFilterLinks = [
      {
        id: 'favorites-link',
        href: '/admin/new-project?filter=favorites',
        text: 'Favorites',
        icon: 'heart',
        active: filter === 'favorites',
      },
      {
        id: 'recent-link',
        href: '/admin/new-project?filter=recent',
        text: 'Recent',
        icon: 'clock',
        active: filter === 'recent',
      },
      {
        id: 'publish-link',
        href: '/admin/new-project?filter=publish',
        text: 'Publish',
        icon: 'send',
        active: filter === 'publish',
      },
      {
        id: 'unpublish-link',
        href: '/admin/new-project?filter=unpublish',
        text: 'Unpublish',
        icon: 'eye-off',
        active: filter === 'unpublish',
      },
      {
        id: 'archive-link',
        href: '/admin/new-project?filter=archive',
        text: 'Archive',
        icon: 'archive',
        active: filter === 'archive',
      },
    ];

    // Check if this is an HTMX request for content update
    if (req.headers['hx-request']) {
      // Render only the ideas grid content
      res.render('partials/admin/new-project-content', {
        ideas: transformedIdeas,
        layout: false, // Don't use layout for HTMX requests
      });
    } else {
      // Fetch user and credits data for nav
      const dashboardData = await ServerDataService.getUserDashboardData(
        req.user.id,
        'startup'
      );

      res.render('pages/admin/projects', {
        title: 'New Project',
        description: 'Create a new project',
        section: 'main',
        currentSection: filter === 'portfolio' ? 'portfolio' : 'main',
        currentPage: 'New Project',
        filterLinks: overviewFilterLinks,
        ideas: transformedIdeas,
        allIdeas: truncatedAllIdeas,
        showCreateCard,
        filter,
        populateIdea,
        user: req.user,
        credits: dashboardData.credits,
      });
    }
  } catch (error) {
    logger.error('Error loading new project page:', error);

    const filter = req.query.filter || 'all-projects';
    const showCard = req.query.showCard === 'true';

    const populateIdea = null;

    const showCreateCard = showCard || filter === 'all-projects';

    const overviewFilterLinks = [
      {
        id: 'favorites-link',
        href: '/admin/new-project?filter=favorites',
        text: 'Favorites',
        icon: 'heart',
        active: filter === 'favorites',
      },
      {
        id: 'recent-link',
        href: '/admin/new-project?filter=recent',
        text: 'Recent',
        icon: 'clock',
        active: filter === 'recent',
      },
      {
        id: 'publish-link',
        href: '/admin/new-project?filter=publish',
        text: 'Publish',
        icon: 'send',
        active: filter === 'publish',
      },
      {
        id: 'unpublish-link',
        href: '/admin/new-project?filter=unpublish',
        text: 'Unpublish',
        icon: 'eye-off',
        active: filter === 'unpublish',
      },
      {
        id: 'archive-link',
        href: '/admin/new-project?filter=archive',
        text: 'Archive',
        icon: 'archive',
        active: filter === 'archive',
      },
    ];

    // Check if this is an HTMX request for content update
    if (req.headers['hx-request']) {
      // Render only the ideas grid content
      res.render('partials/admin/new-project-content', {
        ideas: [],
        layout: false, // Don't use layout for HTMX requests
      });
    } else {
      res.render('pages/admin/projects', {
        title: 'New Project',
        description: 'Create a new project',
        section: 'main',
        currentSection: 'main',
        currentPage: 'New Project',
        filterLinks: overviewFilterLinks,
        ideas: [], // Empty array on error
        allIdeas: [],
        showCreateCard,
        filter,
        populateIdea: null,
      });
    }
  }
};
