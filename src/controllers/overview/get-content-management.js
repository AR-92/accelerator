import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Content Management Section Overview
export const getContentManagement = async (req, res) => {
  try {
    logger.info('Admin content management section overview accessed');

    // Fetch all stats in parallel
    const [
      { count: totalContent },
      { count: publishedContent },
      { count: draftContent },
      { count: totalLandingPages },
      { count: activeLandingPages },
      { count: inactiveLandingPages },
    ] = await Promise.all([
      databaseService.supabase
        .from('learning_content')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('learning_content')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
      databaseService.supabase
        .from('learning_content')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),
      databaseService.supabase
        .from('landing_page_managements')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('landing_page_managements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('landing_page_managements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
    ]);

    const statsGrid = [
      {
        icon: 'file-text',
        title: 'Learning Content',
        link: '/admin/table-pages/content',
        items: [
          { label: 'Total', value: totalContent || 0 },
          {
            label: 'Published',
            value: publishedContent || 0,
            color: 'text-green-600',
          },
          {
            label: 'Draft',
            value: draftContent || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'globe',
        title: 'Landing Page Managements',
        link: '/admin/table-pages/landing-page',
        items: [
          { label: 'Total', value: totalLandingPages || 0 },
          {
            label: 'Active',
            value: activeLandingPages || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveLandingPages || 0,
            color: 'text-gray-600',
          },
        ],
      },
    ];

    const quickActions = [
      {
        link: '/admin/table-pages/content',
        icon: 'file-text',
        text: 'Manage Learning Content',
      },
      {
        link: '/admin/table-pages/landing-page',
        icon: 'globe',
        text: 'Manage Landing Page Managements',
      },
    ];

    const filterLinks = [
      {
        id: 'manage-content-btn',
        href: '/admin/table-pages/content',
        text: 'Manage Learning Content',
        icon: 'file-text',
      },
      {
        id: 'manage-landing-pages-btn',
        href: '/admin/table-pages/landing-page',
        text: 'Manage Landing Page Managements',
        icon: 'layout',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Content Management Overview',
      description: 'Overview of content creation and landing page management',
      section: 'content-management',
      currentSection: 'content-management',
      currentPage: 'content-management',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading content management overview:', error);
    res.render('admin/overview-page', {
      title: 'Content Management Overview',
      description: 'Overview of content creation and landing page management',
      section: 'content-management',
      currentSection: 'content-management',
      currentPage: 'content-management',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
