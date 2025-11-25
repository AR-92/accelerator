import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Learning Section Overview
export const getLearning = async (req, res) => {
  try {
    logger.info('Admin learning section overview accessed');

    // Fetch all stats in parallel
    const [
      { count: totalLearningContent },
      { count: publishedLearningContent },
      { count: draftLearningContent },
      { count: totalLearningCategories },
      { count: activeLearningCategories },
      { count: inactiveLearningCategories },
      { count: totalLearningAssessments },
      { count: completedLearningAssessments },
      { count: pendingLearningAssessments },
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
        .from('learning_categories')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('learning_categories')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('learning_categories')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
      databaseService.supabase
        .from('learning_assessments')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('learning_assessments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),
      databaseService.supabase
        .from('learning_assessments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ]);

    // Learning Analytics (placeholder)
    const totalViews = 0; // TODO: fetch from analytics table
    const avgCompletion = 0; // TODO: calculate average
    const popularContent = 0; // TODO: count popular

    const statsGrid = [
      {
        icon: 'file-text',
        title: 'Learning Content',
        link: '/admin/table-pages/learning-content',
        items: [
          { label: 'Total', value: totalLearningContent || 0 },
          {
            label: 'Published',
            value: publishedLearningContent || 0,
            color: 'text-green-600',
          },
          {
            label: 'Draft',
            value: draftLearningContent || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'folder',
        title: 'Learning Categories',
        link: '/admin/table-pages/learning-categories',
        items: [
          { label: 'Total', value: totalLearningCategories || 0 },
          {
            label: 'Active',
            value: activeLearningCategories || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveLearningCategories || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'lock',
        title: 'Learning Assessments',
        link: '/admin/table-pages/learning-assessments',
        items: [
          { label: 'Total', value: totalLearningAssessments || 0 },
          {
            label: 'Completed',
            value: completedLearningAssessments || 0,
            color: 'text-green-600',
          },
          {
            label: 'Pending',
            value: pendingLearningAssessments || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'bar-chart-3',
        title: 'Learning Analytics',
        link: '/admin/table-pages/learning-analytics',
        items: [
          { label: 'Views', value: totalViews },
          {
            label: 'Completion',
            value: avgCompletion,
            unit: '%',
            color: 'text-blue-600',
          },
          { label: 'Popular', value: popularContent, color: 'text-purple-600' },
        ],
      },
    ];

    const quickActions = [
      {
        link: '/admin/table-pages/learning-content',
        icon: 'file-text',
        text: 'Learning Content',
      },
      {
        link: '/admin/table-pages/learning-categories',
        icon: 'folder',
        text: 'Learning Categories',
      },
      {
        link: '/admin/table-pages/learning-assessments',
        icon: 'lock',
        text: 'Learning Assessments',
      },
      {
        link: '/admin/table-pages/learning-analytics',
        icon: 'bar-chart-3',
        text: 'Learning Analytics',
      },
    ];

    const filterLinks = [
      {
        id: 'learning-content-btn',
        href: '/admin/table-pages/learning-content',
        text: 'Learning Content',
      },
      {
        id: 'categories-btn',
        href: '/admin/table-pages/learning-categories',
        text: 'Learning Categories',
      },
      {
        id: 'assessments-btn',
        href: '/admin/table-pages/learning-assessments',
        text: 'Learning Assessments',
      },
      {
        id: 'analytics-btn',
        href: '/admin/table-pages/learning-analytics',
        text: 'Learning Analytics',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Learning Overview',
      description: 'Overview of learning content, categories, and assessments',
      section: 'learning',
      currentSection: 'learning',
      currentPage: 'learning',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading learning overview:', error);
    res.render('admin/overview-page', {
      title: 'Learning Overview',
      description: 'Overview of learning content, categories, and assessments',
      section: 'learning',
      currentSection: 'learning',
      currentPage: 'learning',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
