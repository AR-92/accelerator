import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Financial Section Overview
export const getFinancial = async (req, res) => {
  try {
    logger.info('Admin financial section overview accessed');

    // Fetch all stats in parallel
    const [
      { count: totalPackages },
      { count: activePackages },
      { count: inactivePackages },
      { count: totalBilling },
      { count: paidBilling },
      { count: pendingBilling },
      { count: totalRewards },
      { count: activeRewards },
      { count: inactiveRewards },
    ] = await Promise.all([
      databaseService.supabase
        .from('packages')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
      databaseService.supabase
        .from('billings')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('billings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'paid'),
      databaseService.supabase
        .from('billings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      databaseService.supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
    ]);

    const statsGrid = [
      {
        icon: 'package',
        title: 'Packages',
        link: '/admin/table-pages/packages',
        items: [
          { label: 'Total', value: totalPackages || 0 },
          {
            label: 'Active',
            value: activePackages || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactivePackages || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'credit-card',
        title: 'Billings',
        link: '/admin/table-pages/billing',
        items: [
          { label: 'Total', value: totalBilling || 0 },
          { label: 'Paid', value: paidBilling || 0, color: 'text-green-600' },
          {
            label: 'Pending',
            value: pendingBilling || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'gift',
        title: 'Rewards',
        link: '/admin/table-pages/rewards',
        items: [
          { label: 'Total', value: totalRewards || 0 },
          {
            label: 'Active',
            value: activeRewards || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveRewards || 0,
            color: 'text-gray-600',
          },
        ],
      },
    ];

    const quickActions = [
      {
        link: '/admin/table-pages/packages',
        icon: 'package',
        text: 'Packages',
      },
      {
        link: '/admin/table-pages/billing',
        icon: 'credit-card',
        text: 'Billings',
      },
      { link: '/admin/table-pages/rewards', icon: 'gift', text: 'Rewards' },
    ];

    const filterLinks = [
      {
        id: 'packages-btn',
        href: '/admin/table-pages/packages',
        text: 'Packages',
      },
      {
        id: 'billing-btn',
        href: '/admin/table-pages/billing',
        text: 'Billings',
      },
      {
        id: 'rewards-btn',
        href: '/admin/table-pages/rewards',
        text: 'Rewards',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Financial Overview',
      description: 'Overview of packages, billing, and rewards management',
      section: 'financial',
      currentSection: 'financial',
      currentPage: 'financial',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading financial overview:', error);
    res.render('admin/overview-page', {
      title: 'Financial Overview',
      description: 'Overview of packages, billing, and rewards management',
      section: 'financial',
      currentSection: 'financial',
      currentPage: 'financial',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
