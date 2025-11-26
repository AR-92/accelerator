import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Help Section Overview
export const getHelp = async (req, res) => {
  try {
    logger.info('Admin help section overview accessed');

    // Fetch all stats in parallel
    const [
      { count: totalHelpCenter },
      { count: publishedHelpCenter },
      { count: draftHelpCenter },
    ] = await Promise.all([
      databaseService.supabase
        .from('help_centers')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('help_centers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
      databaseService.supabase
        .from('help_centers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),
    ]);

    const statsGrid = [
      {
        icon: 'help-circle',
        title: 'Help Centers',
        link: '/admin/table-pages/help-center',
        items: [
          { label: 'Total Articles', value: totalHelpCenter || 0 },
          {
            label: 'Published',
            value: publishedHelpCenter || 0,
            color: 'text-green-600',
          },
          {
            label: 'Draft',
            value: draftHelpCenter || 0,
            color: 'text-orange-600',
          },
        ],
      },
    ];

    const quickActions = [
      {
        link: '/admin/table-pages/help-center',
        icon: 'help-circle',
        text: 'Manage Help Centers',
      },
    ];

    const filterLinks = [
      {
        id: 'manage-help-center-btn',
        href: '/admin/table-pages/help-center',
        text: 'Manage Help Centers',
        icon: 'help-circle',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Help Overview',
      description: 'Overview of help center and support resources',
      section: 'help',
      currentSection: 'help',
      currentPage: 'help',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading help overview:', error);
    res.render('admin/overview-page', {
      title: 'Help Overview',
      description: 'Overview of help center and support resources',
      section: 'help',
      currentSection: 'help',
      currentPage: 'help',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
