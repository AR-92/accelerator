import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// All Projects Page
export const getAllProjects = async (req, res) => {
  try {
    logger.info('All Projects page accessed');

    // Fetch all ideas stats in parallel
    const [
      { count: totalIdeas },
      { count: activeIdeas },
      { count: draftIdeas },
      { count: favoriteIdeas },
      { count: totalUpvotes },
      { count: totalViews },
    ] = await Promise.all([
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('is_favorite', true),
      databaseService.supabase
        .from('ideas')
        .select('upvotes', { count: 'exact', head: true }),
      databaseService.supabase
        .from('ideas')
        .select('views', { count: 'exact', head: true }),
    ]);

    // Fetch ideas from database
    const { data: ideas, error } = await databaseService.supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching projects:', error);
      throw error;
    }

    // Transform ideas data for template
    const transformedIdeas = (ideas || []).map((idea) => ({
      id: idea.id,
      name: idea.title || 'Untitled Idea',
      description: idea.description || 'No description available',
      status: idea.status || 'draft',
      progress: Math.min(idea.rating * 20, 100) || 0, // Convert rating (0-5) to progress (0-100)
      initials: (idea.title || 'U').substring(0, 2).toUpperCase(),
      type: idea.type,
      type_icon: idea.type_icon,
      rating: idea.rating,
      upvotes: idea.upvotes,
      downvotes: idea.downvotes,
      views: idea.views,
      is_favorite: idea.is_favorite,
      tags: idea.tags,
      href: idea.href,
      created_at: idea.created_at,
    }));

    const statsGrid = [
      {
        icon: 'lightbulb',
        title: 'Ideas',
        items: [
          { label: 'Total', value: totalIdeas || 0 },
          {
            label: 'Active',
            value: activeIdeas || 0,
            color: 'text-step-revenue',
          },
          {
            label: 'Draft',
            value: draftIdeas || 0,
            color: 'text-gray-600',
          },
          {
            label: 'Favorites',
            value: favoriteIdeas || 0,
            color: 'text-yellow-600',
          },
        ],
      },
      {
        icon: 'thumbs-up',
        title: 'Engagement',
        items: [
          { label: 'Total Upvotes', value: totalUpvotes || 0 },
          {
            label: 'Total Views',
            value: totalViews || 0,
            color: 'text-step-kpi',
          },
        ],
      },
    ];

    const quickActions = [
      {
        id: 'create-idea-btn',
        href: '/admin/new-project',
        text: 'Create New Idea',
        icon: 'plus',
      },
      {
        id: 'explore-ideas-btn',
        href: '/admin/explore-ideas',
        text: 'Explore Ideas',
        icon: 'lightbulb',
      },
    ];

    const filterLinks = [
      {
        id: 'overview-link',
        href: '/projects/all-projects',
        text: 'All Ideas',
        icon: 'list',
      },
      {
        id: 'active-link',
        href: '/projects/all-projects?status=active',
        text: 'Active',
        icon: 'check-circle',
      },
      {
        id: 'drafts-link',
        href: '/projects/all-projects?status=draft',
        text: 'Drafts',
        icon: 'file-text',
      },
      {
        id: 'favorites-link',
        href: '/projects/all-projects?favorite=true',
        text: 'Favorites',
        icon: 'star',
      },
      {
        id: 'recent-link',
        href: '/projects/all-projects?sort=recent',
        text: 'Recent',
        icon: 'calendar',
      },
    ];

    res.render('projects/all-projects', {
      title: 'All Ideas',
      description: 'Dashboard overview of all your ideas',
      section: 'main',
      currentSection: 'main',
      currentPage: 'All Ideas',
      statsGrid,
      quickActions,
      filterLinks,
      projects: transformedIdeas,
    });
  } catch (error) {
    logger.error('Error loading all projects page:', error);

    const filterLinks = [
      {
        id: 'overview-link',
        href: '/projects/all-projects',
        text: 'Overview',
        icon: 'bar-chart',
      },
      {
        id: 'pendings-link',
        href: '/projects/all-projects?status=pending',
        text: 'Pendings',
        icon: 'clock',
      },
      {
        id: 'drafts-link',
        href: '/projects/all-projects?status=draft',
        text: 'Drafts',
        icon: 'file-text',
      },
      {
        id: 'public-link',
        href: '/projects/all-projects?visibility=public',
        text: 'Public',
        icon: 'globe',
      },
      {
        id: 'private-link',
        href: '/projects/all-projects?visibility=private',
        text: 'Private',
        icon: 'lock',
      },
      {
        id: 'recent-link',
        href: '/projects/all-projects?sort=recent',
        text: 'Recent',
        icon: 'calendar',
      },
    ];

    res.render('projects/all-projects', {
      title: 'All Ideas',
      description: 'Dashboard overview of all your ideas',
      section: 'main',
      currentSection: 'main',
      currentPage: 'All Ideas',
      statsGrid: [],
      quickActions: [],
      filterLinks,
      projects: [],
    });
  }
};
