import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Financial Management
export const getDashboardFinancial = async (req, res) => {
  try {
    logger.info('Dashboard financial section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch financial data
    const incomeStatement = await getIncomeStatement(user);
    const cashFlow = await getCashFlow(user);
    const balanceSheet = await getBalanceSheet(user);
    const fundingAllocation = await getFundingAllocation(user);
    const revenueModels = await getRevenueModels(user);

    // Role-based features
    const features = getRoleBasedFeatures(userRole);

    const filterLinks = [
      {
        id: 'overview-link',
        href: '/dashboard/overview',
        text: 'Overview',
        icon: 'layout-dashboard',
      },
      {
        id: 'idea-link',
        href: '/dashboard/idea',
        text: 'Idea Management',
        icon: 'lightbulb',
      },
      {
        id: 'business-link',
        href: '/dashboard/business',
        text: 'Business',
        icon: 'briefcase',
      },
      {
        id: 'financial-link',
        href: '/dashboard/financial',
        text: 'Financial',
        icon: 'dollar-sign',
        active: true,
      },
      {
        id: 'marketing-link',
        href: '/dashboard/marketing',
        text: 'Marketing',
        icon: 'megaphone',
      },
      {
        id: 'fund-link',
        href: '/dashboard/fund',
        text: 'Funding',
        icon: 'wallet',
      },
      {
        id: 'team-link',
        href: '/dashboard/team',
        text: 'Team',
        icon: 'users',
      },
      {
        id: 'promote-link',
        href: '/dashboard/promote',
        text: 'Promotion',
        icon: 'presentation',
      },
      {
        id: 'activity-log-link',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    res.render('dashboard/financial', {
      title: 'Financial Management',
      currentSection: 'dashboard',
      currentPage: 'financial',
      user,
      userRole,
      incomeStatement,
      cashFlow,
      balanceSheet,
      fundingAllocation,
      revenueModels,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard financial:', error);
    const filterLinks = [
      {
        id: 'overview-link',
        href: '/dashboard/overview',
        text: 'Overview',
        icon: 'layout-dashboard',
      },
      {
        id: 'idea-link',
        href: '/dashboard/idea',
        text: 'Idea Management',
        icon: 'lightbulb',
      },
      {
        id: 'business-link',
        href: '/dashboard/business',
        text: 'Business',
        icon: 'briefcase',
      },
      {
        id: 'financial-link',
        href: '/dashboard/financial',
        text: 'Financial',
        icon: 'dollar-sign',
        active: true,
      },
      {
        id: 'marketing-link',
        href: '/dashboard/marketing',
        text: 'Marketing',
        icon: 'megaphone',
      },
      {
        id: 'fund-link',
        href: '/dashboard/fund',
        text: 'Funding',
        icon: 'wallet',
      },
      {
        id: 'team-link',
        href: '/dashboard/team',
        text: 'Team',
        icon: 'users',
      },
      {
        id: 'promote-link',
        href: '/dashboard/promote',
        text: 'Promotion',
        icon: 'presentation',
      },
      {
        id: 'activity-log-link',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    res.render('dashboard/financial', {
      title: 'Financial Management',
      currentSection: 'dashboard',
      currentPage: 'financial',
      user: req.user,
      userRole: req.user?.role || 'startup',
      incomeStatement: getDefaultIncomeStatement(),
      cashFlow: getDefaultCashFlow(),
      balanceSheet: getDefaultBalanceSheet(),
      fundingAllocation: getDefaultFundingAllocation(),
      revenueModels: getDefaultRevenueModels(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getIncomeStatement(user) {
  try {
    const { data: statement } = await databaseService.supabase
      .from('income_statements')
      .select('*')
      .eq('user_id', user.id)
      .order('period_end', { ascending: false })
      .limit(1)
      .single();

    return statement || getDefaultIncomeStatement();
  } catch (error) {
    logger.error('Error fetching income statement:', error);
    return getDefaultIncomeStatement();
  }
}

async function getCashFlow(user) {
  try {
    const { data: flow } = await databaseService.supabase
      .from('cash_flow_statements')
      .select('*')
      .eq('user_id', user.id)
      .order('period_end', { ascending: false })
      .limit(1)
      .single();

    return flow || getDefaultCashFlow();
  } catch (error) {
    logger.error('Error fetching cash flow:', error);
    return getDefaultCashFlow();
  }
}

async function getBalanceSheet(user) {
  try {
    const { data: sheet } = await databaseService.supabase
      .from('balance_sheets')
      .select('*')
      .eq('user_id', user.id)
      .order('as_of_date', { ascending: false })
      .limit(1)
      .single();

    return sheet || getDefaultBalanceSheet();
  } catch (error) {
    logger.error('Error fetching balance sheet:', error);
    return getDefaultBalanceSheet();
  }
}

async function getFundingAllocation(user) {
  try {
    const { data: allocations } = await databaseService.supabase
      .from('funding_allocations')
      .select('*')
      .eq('user_id', user.id);

    const total =
      allocations?.reduce((sum, a) => sum + (a.amount || 0), 0) || 0;

    return {
      allocations: allocations || [],
      total,
      categories: {
        product:
          allocations
            ?.filter((a) => a.category === 'product')
            .reduce((sum, a) => sum + a.amount, 0) || 0,
        marketing:
          allocations
            ?.filter((a) => a.category === 'marketing')
            .reduce((sum, a) => sum + a.amount, 0) || 0,
        operations:
          allocations
            ?.filter((a) => a.category === 'operations')
            .reduce((sum, a) => sum + a.amount, 0) || 0,
        rAndD:
          allocations
            ?.filter((a) => a.category === 'r_and_d')
            .reduce((sum, a) => sum + a.amount, 0) || 0,
      },
    };
  } catch (error) {
    logger.error('Error fetching funding allocation:', error);
    return getDefaultFundingAllocation();
  }
}

async function getRevenueModels(user) {
  try {
    const { data: models } = await databaseService.supabase
      .from('revenue_models')
      .select('*')
      .eq('user_id', user.id);

    const projections = {
      monthly:
        models?.reduce((sum, m) => sum + (m.monthly_projection || 0), 0) || 0,
      quarterly:
        models?.reduce((sum, m) => sum + (m.quarterly_projection || 0), 0) || 0,
      annual:
        models?.reduce((sum, m) => sum + (m.annual_projection || 0), 0) || 0,
    };

    return { models: models || [], projections };
  } catch (error) {
    logger.error('Error fetching revenue models:', error);
    return getDefaultRevenueModels();
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultIncomeStatement() {
  return {
    revenue: 0,
    costOfRevenue: 0,
    grossProfit: 0,
    operatingExpenses: 0,
    netIncome: 0,
    period_end: new Date().toISOString(),
  };
}

function getDefaultCashFlow() {
  return {
    operatingCashFlow: 0,
    investingCashFlow: 0,
    financingCashFlow: 0,
    netCashFlow: 0,
    beginningCash: 0,
    endingCash: 0,
    period_end: new Date().toISOString(),
  };
}

function getDefaultBalanceSheet() {
  return {
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    currentAssets: 0,
    currentLiabilities: 0,
    as_of_date: new Date().toISOString(),
  };
}

function getDefaultFundingAllocation() {
  return {
    allocations: [],
    total: 0,
    categories: {
      product: 0,
      marketing: 0,
      operations: 0,
      rAndD: 0,
    },
  };
}

function getDefaultRevenueModels() {
  return {
    models: [],
    projections: {
      monthly: 0,
      quarterly: 0,
      annual: 0,
    },
  };
}
