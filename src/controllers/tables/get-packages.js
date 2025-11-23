import logger from '../../utils/logger.js';
import databaseService from '../../services/supabase.js';

// Packages Management
export const getPackages = async (req, res) => {
  try {
    logger.info('Admin packages page accessed');

    // Fetch packages from packages table
    const { data: packagesData, error: packagesError } = await databaseService.supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (packagesError) {
      logger.error('Error fetching packages:', packagesError);
      throw packagesError;
    }

    // Fetch billing data to compute statistics
    const { data: billingData, error: billingError } = await databaseService.supabase
      .from('Billing')
      .select('plan_name, amount_cents, currency, status');

    if (billingError) {
      logger.error('Error fetching billing data:', billingError);
      // Continue without billing stats if error
    }

    // Group billing data by plan_name
    const billingStats = {};
    if (billingData) {
      billingData.forEach(record => {
        const planName = record.plan_name;
        if (planName) {
          if (!billingStats[planName]) {
            billingStats[planName] = {
              subscribers: 0,
              total_revenue: 0,
              active_subscriptions: 0,
              currency: record.currency || 'USD'
            };
          }
          billingStats[planName].subscribers += 1;
          billingStats[planName].total_revenue += record.amount_cents || 0;
          if (record.status === 'paid' || record.status === 'active') {
            billingStats[planName].active_subscriptions += 1;
          }
        }
      });
    }

    // Helper function to truncate text
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Merge packages with billing stats
    const packages = packagesData.map(pkg => {
      const stats = billingStats[pkg.name] || { subscribers: 0, total_revenue: 0, active_subscriptions: 0, currency: 'USD' };
      return {
        id: pkg.id,
        name: pkg.name,
        description: truncateText(pkg.description, 50),
        price: `$${(pkg.price_cents / 100).toFixed(2)}`,
        status: pkg.status,
        subscribers: stats.subscribers,
        active_subscribers: stats.active_subscriptions,
        total_revenue: `$${(stats.total_revenue / 100).toFixed(2)}`,
        features: truncateText(Array.isArray(pkg.features) ? pkg.features.join(', ') : JSON.stringify(pkg.features), 80),
        created_at: pkg.created_at
      };
    });

    const columns = [
      { key: 'name', label: 'Package Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'subscribers', label: 'Total Subscribers', type: 'text' },
      { key: 'active_subscribers', label: 'Active Subscribers', type: 'text' },
      { key: 'total_revenue', label: 'Total Revenue', type: 'text' },
      { key: 'features', label: 'Features', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'button', onclick: 'editPackage', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'button', onclick: 'togglePackage', label: 'Toggle Status', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' },
      { type: 'delete', onclick: 'deletePackage', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkActivatePackages', buttonId: 'bulkActivateBtn', label: 'Activate Selected' },
      { onclick: 'bulkDeactivatePackages', buttonId: 'bulkDeactivateBtn', label: 'Deactivate Selected' },
      { onclick: 'bulkDeletePackages', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: packages.length, start: 1, end: packages.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/table-pages/packages', {
      title: 'Packages Management', currentPage: 'packages', currentSection: 'financial', tableId: 'packages', entityName: 'package', showCheckbox: true, showBulkActions: true, columns, data: packages, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/table-pages/packages', colspan
    });
  } catch (error) {
    logger.error('Error loading packages:', error);
    res.render('admin/table-pages/packages', { title: 'Packages Management', currentPage: 'packages', currentSection: 'financial', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};