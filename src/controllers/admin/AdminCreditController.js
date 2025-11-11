/**
 * Admin Credit Controller
 * Handles admin operations for credits, transactions, and payment methods
 */

class AdminCreditController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  /**
   * Show credits overview
   */
  async showCredits(req, res) {
    try {
      const transactions = await this.adminService.getAllTransactions();
      const paymentMethods = await this.adminService.getAllPaymentMethods();

      res.render('pages/admin/credits', {
        title: 'Credits & Transactions - Admin Panel',
        activeCredits: true,
        mainPadding: 'py-8',
        user: req.user,
        transactions,
        paymentMethods,
        stats: await this.adminService.getCreditStats(),
      });
    } catch (error) {
      console.error('Error showing credits:', error);
      res.status(500).render('pages/error', {
        title: 'Error - Admin Panel',
        error: 'Failed to load credits data',
      });
    }
  }

  /**
   * Show transactions list
   */
  async showTransactions(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';
      const type = req.query.type || '';
      const status = req.query.status || '';
      const userId = req.query.userId || '';

      const result = await this.adminService.getTransactions({
        page,
        limit,
        search,
        type,
        status,
        userId,
      });

      res.render('pages/admin/transactions', {
        title: 'Transactions - Admin Panel',
        activeTransactions: true,
        mainPadding: 'py-8',
        user: req.user,
        transactions: result.transactions,
        pagination: result.pagination,
        filters: result.filters,
        stats: await this.adminService.getTransactionStats(),
      });
    } catch (error) {
      console.error('Error showing transactions:', error);
      res.status(500).render('pages/error', {
        title: 'Error - Admin Panel',
        error: 'Failed to load transactions',
      });
    }
  }

  /**
   * Show payment methods list
   */
  async showPaymentMethods(req, res) {
    try {
      const paymentMethods = await this.adminService.getAllPaymentMethods();

      res.render('pages/admin/payment-methods', {
        title: 'Payment Methods - Admin Panel',
        activePaymentMethods: true,
        mainPadding: 'py-8',
        user: req.user,
        paymentMethods,
        stats: await this.adminService.getPaymentMethodStats(),
      });
    } catch (error) {
      console.error('Error showing payment methods:', error);
      res.status(500).render('pages/error', {
        title: 'Error - Admin Panel',
        error: 'Failed to load payment methods',
      });
    }
  }
}

module.exports = AdminCreditController;
