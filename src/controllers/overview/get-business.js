import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Business Section Overview
export const getBusiness = async (req, res) => {
  try {
    logger.info('Admin business section overview accessed');

    // Fetch all stats in parallel
    const [
      { count: totalModels },
      { count: activeModels },
      { count: inactiveModels },
      { count: totalPlans },
      { count: completedPlans },
      { count: draftPlans },
      { count: totalFinancialModels },
      { count: activeFinancialModels },
      { count: inactiveFinancialModels },
      { count: totalPitchdecks },
      { count: approvedPitchdecks },
      { count: pendingPitchdecks },
      { count: totalValuations },
      { count: completedValuations },
      { count: pendingValuations },
      { count: totalFunding },
      { count: securedFunding },
      { count: seekingFunding },
      { count: totalTeams },
      { count: completeTeams },
      { count: incompleteTeams },
      { count: totalLegal },
      { count: compliantLegal },
      { count: pendingLegal },
      { count: totalMarketing },
      { count: activeMarketing },
      { count: inactiveMarketing },
      { count: totalCorporate },
      { count: activeCorporate },
      { count: inactiveCorporate },
      { count: totalEnterprises },
      { count: activeEnterprises },
      { count: inactiveEnterprises },
    ] = await Promise.all([
      databaseService.supabase
        .from('business_models')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('business_models')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('business_models')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
      databaseService.supabase
        .from('business_plans')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('business_plans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),
      databaseService.supabase
        .from('business_plans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),
      databaseService.supabase
        .from('financial_models')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('financial_models')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('financial_models')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
      databaseService.supabase
        .from('pitch_deck')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('pitch_deck')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved'),
      databaseService.supabase
        .from('pitch_deck')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      databaseService.supabase
        .from('valuation')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('valuation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),
      databaseService.supabase
        .from('valuation')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      databaseService.supabase
        .from('fundings')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('fundings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'secured'),
      databaseService.supabase
        .from('fundings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'seeking'),
      databaseService.supabase
        .from('team')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('team')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'complete'),
      databaseService.supabase
        .from('team')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'incomplete'),
      databaseService.supabase
        .from('legal')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('legal')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'compliant'),
      databaseService.supabase
        .from('legal')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      databaseService.supabase
        .from('marketing')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('marketing')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('marketing')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
      databaseService.supabase
        .from('corporates')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('corporates')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('corporates')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
      databaseService.supabase
        .from('enterprises')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('enterprises')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('enterprises')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
    ]);

    logger.info(
      `Fetched business stats: ${totalModels} models, ${totalPlans} plans, etc.`
    );

    // Generate business trends for charts
    const now = new Date();
    const businessTrends = {
      modelsGrowth: {
        labels: [],
        data: [],
      },
      fundingProgress: {
        labels: [],
        data: [],
      },
      teamGrowth: {
        labels: [],
        data: [],
      },
    };

    // Generate last 6 months of business trends
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });

      businessTrends.modelsGrowth.labels.push(monthLabel);
      businessTrends.fundingProgress.labels.push(monthLabel);
      businessTrends.teamGrowth.labels.push(monthLabel);

      // Simulate business models growth (gradually increasing)
      const baseModels = totalModels * (0.7 + Math.random() * 0.6);
      businessTrends.modelsGrowth.data.push(Math.round(baseModels));

      // Simulate funding progress (cumulative)
      const baseFunding = (totalFunding || 100) * (0.5 + Math.random() * 0.8);
      businessTrends.fundingProgress.data.push(Math.round(baseFunding));

      // Simulate team growth
      const baseTeams = (totalTeams || 50) * (0.6 + Math.random() * 0.8);
      businessTrends.teamGrowth.data.push(Math.round(baseTeams));
    }

    // Business performance metrics
    const businessPerformance = {
      growthRate: '+12.5%',
      successRate: '78.3%',
      avgFunding: '$2.4M',
      marketReach: '15 countries',
      activeProjects: Math.round((totalModels || 0) * 0.7),
      completedMilestones: Math.round((totalPlans || 0) * 0.6),
    };

    const statsGrid = [
      {
        icon: 'table',
        title: 'Business Models',
        link: '/admin/table-pages/business-model',
        items: [
          { label: 'Total', value: totalModels || 0 },
          {
            label: 'Active',
            value: activeModels || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveModels || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'file-text',
        title: 'Business Plans',
        link: '/admin/table-pages/business-plan',
        items: [
          { label: 'Total', value: totalPlans || 0 },
          {
            label: 'Completed',
            value: completedPlans || 0,
            color: 'text-green-600',
          },
          { label: 'Draft', value: draftPlans || 0, color: 'text-orange-600' },
        ],
      },
      {
        icon: 'credit-card',
        title: 'Financial Models',
        link: '/admin/table-pages/financial-model',
        items: [
          { label: 'Total', value: totalFinancialModels || 0 },
          {
            label: 'Active',
            value: activeFinancialModels || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveFinancialModels || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'file-text',
        title: 'Pitch Decks',
        link: '/admin/table-pages/pitchdeck',
        items: [
          { label: 'Total', value: totalPitchdecks || 0 },
          {
            label: 'Approved',
            value: approvedPitchdecks || 0,
            color: 'text-green-600',
          },
          {
            label: 'Pending',
            value: pendingPitchdecks || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'dollar-sign',
        title: 'Valuations',
        link: '/admin/table-pages/valuation',
        items: [
          { label: 'Total', value: totalValuations || 0 },
          {
            label: 'Completed',
            value: completedValuations || 0,
            color: 'text-green-600',
          },
          {
            label: 'Pending',
            value: pendingValuations || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'wallet',
        title: 'Fundings',
        link: '/admin/table-pages/funding',
        items: [
          { label: 'Total', value: totalFunding || 0 },
          {
            label: 'Secured',
            value: securedFunding || 0,
            color: 'text-green-600',
          },
          {
            label: 'Seeking',
            value: seekingFunding || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'users',
        title: 'Teams',
        link: '/admin/table-pages/team',
        items: [
          { label: 'Total', value: totalTeams || 0 },
          {
            label: 'Complete',
            value: completeTeams || 0,
            color: 'text-green-600',
          },
          {
            label: 'Incomplete',
            value: incompleteTeams || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'shield-check',
        title: 'Legal',
        link: '/admin/table-pages/legal',
        items: [
          { label: 'Total', value: totalLegal || 0 },
          {
            label: 'Compliant',
            value: compliantLegal || 0,
            color: 'text-green-600',
          },
          {
            label: 'Pending',
            value: pendingLegal || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'globe',
        title: 'Marketing',
        link: '/admin/table-pages/marketing',
        items: [
          { label: 'Total', value: totalMarketing || 0 },
          {
            label: 'Active',
            value: activeMarketing || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveMarketing || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'building-2',
        title: 'Corporates',
        link: '/admin/table-pages/corporate',
        items: [
          { label: 'Total', value: totalCorporate || 0 },
          {
            label: 'Active',
            value: activeCorporate || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveCorporate || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'building-2',
        title: 'Enterprises',
        link: '/admin/table-pages/enterprises',
        items: [
          { label: 'Total', value: totalEnterprises || 0 },
          {
            label: 'Active',
            value: activeEnterprises || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveEnterprises || 0,
            color: 'text-gray-600',
          },
        ],
      },
    ];

    const quickActions = [
      {
        link: '/admin/table-pages/business-model',
        icon: 'table',
        text: 'Business Models',
      },
      {
        link: '/admin/table-pages/business-plan',
        icon: 'file-text',
        text: 'Business Plans',
      },
      {
        link: '/admin/table-pages/financial-model',
        icon: 'credit-card',
        text: 'Financial Models',
      },
      {
        link: '/admin/table-pages/pitchdeck',
        icon: 'file-text',
        text: 'Pitch Decks',
      },
      {
        link: '/admin/table-pages/valuation',
        icon: 'dollar-sign',
        text: 'Valuations',
      },
      { link: '/admin/table-pages/funding', icon: 'wallet', text: 'Fundings' },
      { link: '/admin/table-pages/team', icon: 'users', text: 'Teams' },
      { link: '/admin/table-pages/legal', icon: 'shield-check', text: 'Legal' },
      {
        link: '/admin/table-pages/marketing',
        icon: 'globe',
        text: 'Marketing',
      },
      {
        link: '/admin/table-pages/corporate',
        icon: 'building-2',
        text: 'Corporates',
      },
      {
        link: '/admin/table-pages/enterprises',
        icon: 'building-2',
        text: 'Enterprises',
      },
    ];

    const filterLinks = [
      {
        id: 'business-models-btn',
        href: '/admin/table-pages/business-model',
        text: 'Business Models',
        icon: 'table',
      },
      {
        id: 'business-plans-btn',
        href: '/admin/table-pages/business-plan',
        text: 'Business Plans',
        icon: 'file-text',
      },
      {
        id: 'financial-models-btn',
        href: '/admin/table-pages/financial-model',
        text: 'Financial Models',
        icon: 'credit-card',
      },
      {
        id: 'pitchdecks-btn',
        href: '/admin/table-pages/pitchdeck',
        text: 'Pitch Decks',
        icon: 'file-text',
      },
      {
        id: 'valuations-btn',
        href: '/admin/table-pages/valuation',
        text: 'Valuations',
        icon: 'dollar-sign',
      },
      {
        id: 'funding-btn',
        href: '/admin/table-pages/funding',
        text: 'Fundings',
        icon: 'wallet',
      },
      {
        id: 'teams-btn',
        href: '/admin/table-pages/team',
        text: 'Teams',
        icon: 'users',
      },
      {
        id: 'legal-btn',
        href: '/admin/table-pages/legal',
        text: 'Legal',
        icon: 'shield-check',
      },
      {
        id: 'marketing-btn',
        href: '/admin/table-pages/marketing',
        text: 'Marketing',
        icon: 'globe',
      },
      {
        id: 'corporate-btn',
        href: '/admin/table-pages/corporate',
        text: 'Corporates',
        icon: 'building-2',
      },
      {
        id: 'enterprises-btn',
        href: '/admin/table-pages/enterprises',
        text: 'Enterprises',
        icon: 'building-2',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Business Overview',
      description:
        'Overview of business models, plans, financials, and operations',
      section: 'business',
      currentSection: 'business',
      currentPage: 'business',
      statsGrid,
      quickActions,
      filterLinks,
      businessTrends,
      businessPerformance,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading business overview:', error);
    res.render('admin/overview-page', {
      title: 'Business Overview',
      description:
        'Overview of business models, plans, financials, and operations',
      section: 'business',
      currentSection: 'business',
      currentPage: 'business',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
