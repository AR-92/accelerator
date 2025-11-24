import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Rewards Management
export const getRewards = async (req, res) => {
  try {
    logger.info('Admin rewards page accessed');

    // Fetch real data from Supabase rewards table
    const { data: rewards, error } = await databaseService.supabase
      .from('rewards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching rewards:', error);
      throw error;
    }

    let filteredRewards = rewards;

    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredRewards = rewards.filter(reward => {
        return (reward.title && reward.title.toLowerCase().includes(search)) ||
               (reward.type && reward.type.toLowerCase().includes(search)) ||
               (reward.status && reward.status.toLowerCase().includes(search)) ||
               (reward.author && reward.author.toLowerCase().includes(search));
      });
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'button', onclick: 'editReward', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'button', onclick: 'toggleReward', label: 'Toggle Status', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' },
      { type: 'delete', onclick: 'deleteReward', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkActivateRewards', buttonId: 'bulkActivateBtn', label: 'Activate Selected' },
      { onclick: 'bulkDeactivateRewards', buttonId: 'bulkDeactivateBtn', label: 'Deactivate Selected' },
      { onclick: 'bulkDeleteRewards', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: filteredRewards.length, start: 1, end: filteredRewards.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/table-pages/rewards', {
      title: 'Rewards Management', currentPage: 'rewards', currentSection: 'financial', isTablePage: true, tableId: 'rewards', entityName: 'reward', showCheckbox: true, showBulkActions: true, columns, data: filteredRewards, actions, bulkActions, pagination, query: { search: req.query.search || '', status: '' }, currentUrl: '/admin/table-pages/rewards', colspan
    });
  } catch (error) {
    logger.error('Error loading rewards:', error);
    res.render('admin/table-pages/rewards', { title: 'Rewards Management', currentPage: 'rewards', currentSection: 'financial', isTablePage: true, data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};