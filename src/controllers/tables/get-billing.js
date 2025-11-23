import logger from '../../utils/logger.js';
import databaseService from '../../services/supabase.js';

// Billing Management
export const getBilling = async (req, res) => {
  try {
    logger.info('Admin billing page accessed');

    // Fetch real data from Supabase billing table
    const { data: transactions, error } = await databaseService.supabase
      .from('Billing')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching billing:', error);
      throw error;
    }

    // Map to expected format
    const mappedTransactions = transactions.map(tx => ({
      id: tx.id,
      user: tx.user_id ? `User ${tx.user_id}` : 'Unknown', // Could join with Accounts table for name
      amount: `$${(tx.amount_cents / 100).toFixed(2)}`,
      status: tx.status,
      date: tx.created_at,
      package: tx.plan_name || 'N/A'
    }));

    const columns = [
      { key: 'user', label: 'User', type: 'text' },
      { key: 'package', label: 'Package', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'date', label: 'Date', type: 'date' }
    ];

    const actions = [
      { type: 'link', url: '/admin/table-pages/billing', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'refundTransaction', label: 'Refund', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-undo-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkRefundTransactions', buttonId: 'bulkRefundBtn', label: 'Refund Selected' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: mappedTransactions.length, start: 1, end: mappedTransactions.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/table-pages/billing', {
      title: 'Billing Management', currentPage: 'billing', currentSection: 'financial', tableId: 'billing', entityName: 'transaction', showCheckbox: true, showBulkActions: true, columns, data: mappedTransactions, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/table-pages/billing', colspan
    });
  } catch (error) {
    logger.error('Error loading billing:', error);
    res.render('admin/table-pages/billing', { title: 'Billing Management', currentPage: 'billing', currentSection: 'financial', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};