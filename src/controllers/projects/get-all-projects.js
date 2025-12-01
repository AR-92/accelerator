import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// All Projects Page
export const getAllProjects = async (req, res) => {
  try {
    logger.info('All Projects page accessed');

    // Fetch all project stats in parallel
    const [
      { count: totalProjects },
      { count: completedProjects },
      { count: inProgressProjects },
      { count: draftProjects },
      { count: totalTasks },
      { count: completedTasks },
    ] = await Promise.all([
      databaseService.supabase
        .from('projects')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),
      databaseService.supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress'),
      databaseService.supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),
      databaseService.supabase
        .from('todos')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('todos')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true),
    ]);

    // Fetch projects from database
    const { data: projects, error } = await databaseService.supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching projects:', error);
      throw error;
    }

    // Transform projects data for template
    const transformedProjects = (projects || []).map((project) => ({
      id: project.id,
      name: project.name || 'Untitled Project',
      description: project.description || 'No description available',
      status: project.status || 'draft',
      progress: project.progress || 0,
      initials: (project.name || 'U').substring(0, 2).toUpperCase(),
      created_at: project.created_at,
    }));

    const statsGrid = [
      {
        icon: 'folder',
        title: 'Projects',
        items: [
          { label: 'Total', value: totalProjects || 0 },
          {
            label: 'Completed',
            value: completedProjects || 0,
            color: 'text-green-600',
          },
          {
            label: 'In Progress',
            value: inProgressProjects || 0,
            color: 'text-blue-600',
          },
          {
            label: 'Draft',
            value: draftProjects || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'check-square',
        title: 'Tasks',
        items: [
          { label: 'Total', value: totalTasks || 0 },
          {
            label: 'Completed',
            value: completedTasks || 0,
            color: 'text-green-600',
          },
        ],
      },
    ];

    const quickActions = [
      {
        id: 'create-project-btn',
        href: '/admin/new-project',
        text: 'Create New Project',
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
      title: 'All Projects',
      description: 'Dashboard overview of all your projects',
      section: 'main',
      currentSection: 'main',
      currentPage: 'All Projects',
      statsGrid,
      quickActions,
      filterLinks,
      projects: transformedProjects,
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
      title: 'All Projects',
      description: 'Dashboard overview of all your projects',
      section: 'main',
      currentSection: 'main',
      currentPage: 'All Projects',
      statsGrid: [],
      quickActions: [],
      filterLinks,
      projects: [],
    });
  }
};
