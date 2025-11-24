import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Financial Section Overview
export const getFinancial = async (req, res) => {
  try {
    logger.info('Admin financial section overview accessed');

    // Get financial stats
    const { count: totalBilling, error: billError } =
      await databaseService.supabase
        .from('billing')
        .select('*', { count: 'exact', head: true });
    if (billError) throw billError;

    const { count: totalPackages, error: packError } =
      await databaseService.supabase
        .from('packages')
        .select('*', { count: 'exact', head: true });
    if (packError) throw packError;

    const { count: totalRewards, error: rewError } =
      await databaseService.supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true });
    if (rewError) throw rewError;

    const stats = {
      totalBilling: totalBilling || 0,
      totalPackages: totalPackages || 0,
      totalRewards: totalRewards || 0,
    };

    res.render('admin/other-pages/financial', {
      title: 'Financial Overview',
      currentPage: 'financial',
      currentSection: 'financial',
      stats,
    });
  } catch (error) {
    logger.error('Error loading financial overview:', error);
    res.render('admin/other-pages/financial', {
      title: 'Financial Overview',
      currentPage: 'financial',
      currentSection: 'financial',
      stats: {
        packages: { total: 0, active: 0, inactive: 0 },
        billing: { total: 0, paid: 0, pending: 0 },
        rewards: { total: 0, active: 0, expired: 0 },
        revenue: { total: 0, thisMonth: 0, growth: 0 },
      },
    });
  }
};
