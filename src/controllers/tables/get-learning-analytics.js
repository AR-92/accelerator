 import logger from '../../utils/logger.js';
 import { databaseService } from '../../services/index.js';

// Learning Analytics Management
export const getLearningAnalytics = async (req, res) => {
  try {
    logger.info('Admin learning analytics page accessed');

    const { data: learningAnalytics, error } = await databaseService.supabase
      .from('learning_analytics')
      .select('*');
    if (error) throw error;

    let filteredLearningAnalytics = learningAnalytics;

    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredLearningAnalytics = learningAnalytics.filter(analytic => {
        return (analytic.user_id && analytic.user_id.toString().toLowerCase().includes(search)) ||
               (analytic.content_id && analytic.content_id.toString().toLowerCase().includes(search)) ||
               (analytic.event_type && analytic.event_type.toLowerCase().includes(search)) ||
               (analytic.duration_seconds && analytic.duration_seconds.toString().toLowerCase().includes(search));
      });
    }

    const columns = [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'content_id', label: 'Content ID', type: 'text' },
      { key: 'event_type', label: 'Event Type', type: 'text' },
      { key: 'duration_seconds', label: 'Duration', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/table-pages/learning-analytics', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: filteredLearningAnalytics.length, start: 1, end: filteredLearningAnalytics.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (false ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/table-pages/learning-analytics', {
      title: 'Learning Analytics Management', currentPage: 'learning-analytics', currentSection: 'learning', isTablePage: true, tableId: 'learning-analytics', entityName: 'learning analytic', showCheckbox: false, showBulkActions: false, columns, data: filteredLearningAnalytics, actions, bulkActions: [], pagination, query: { search: req.query.search || '', status: '' }, currentUrl: '/admin/table-pages/learning-analytics', colspan
    });
  } catch (error) {
    logger.error('Error loading learning analytics:', error);
    res.render('admin/table-pages/learning-analytics', { title: 'Learning Analytics Management', currentPage: 'learning-analytics', currentSection: 'learning', isTablePage: true, data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};