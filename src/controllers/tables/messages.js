 import logger from '../../utils/logger.js';
 import { databaseService } from '../../services/index.js';

// Messages Management
export const getMessages = async (req, res) => {
  try {
    logger.info('Admin messages page accessed');

    const messageService = serviceFactory.getMessageService();
    const { data: messages } = await messageService.getAllMessages({}, { limit: 1000 }); // Get all for admin view

    let filteredMessages = messages;

    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredMessages = messages.filter(msg => {
        return (msg.sender_id && msg.sender_id.toString().toLowerCase().includes(search)) ||
               (msg.receiver_id && msg.receiver_id.toString().toLowerCase().includes(search)) ||
               (msg.subject && msg.subject.toLowerCase().includes(search));
      });
    }

    const columns = [
      { key: 'sender_id', label: 'Sender', type: 'text' },
      { key: 'receiver_id', label: 'Receiver', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'is_read', label: 'Read', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/table-pages/messages', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'markAsRead', label: 'Mark as Read', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>' },
      { type: 'delete', onclick: 'deleteMessage', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkMarkAsRead', buttonId: 'bulkReadBtn', label: 'Mark as Read' },
      { onclick: 'bulkDeleteMessages', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: filteredMessages.length, start: 1, end: filteredMessages.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/table-pages/messages', {
      title: 'Messages Management', currentPage: 'messages', currentSection: 'main', isTablePage: true, tableId: 'messages', entityName: 'message', showCheckbox: true, showBulkActions: true, columns, data: filteredMessages, actions, bulkActions, pagination, query: { search: req.query.search || '', status: '' }, currentUrl: '/admin/table-pages/messages', colspan
    });
  } catch (error) {
    logger.error('Error loading messages:', error);
    res.render('admin/table-pages/messages', { title: 'Messages Management', currentPage: 'messages', currentSection: 'main', isTablePage: true, data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};