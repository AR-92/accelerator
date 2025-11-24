 import logger from '../../../utils/logger.js';
 import { databaseService } from '../../../services/index.js';
 import { serviceFactory } from '../../../services/serviceFactory.js';
 import { validateNotificationCreation, validateNotificationUpdate, validateNotificationDeletion } from '../../../middleware/validation/index.js';
 import { formatDate } from '../../../helpers/format/index.js';
 import { isHtmxRequest } from '../../../helpers/http/index.js';


// Get all notifications with pagination and filtering
export const getNotifications = async (req, res) => {
  try {
    const { search, type, is_read, priority, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const notificationService = serviceFactory.getNotificationService();
    const filters = {};
    if (search) filters.search = search;
    if (type) filters.type = type;
    if (is_read !== undefined) filters.is_read = is_read === 'true';
    if (priority) filters.priority = priority;

    const { data: notifications, count } = await notificationService.getAllNotifications(filters, { page: pageNum, limit: limitNum });

    const total = count || 0;
    const filterDescriptions = [];
    if (search) filterDescriptions.push(`search: "${search}"`);
    if (type) filterDescriptions.push(`type: ${type}`);
    if (is_read !== undefined) filterDescriptions.push(`is_read: ${is_read}`);
    if (priority) filterDescriptions.push(`priority: ${priority}`);
    if (pageNum > 1) filterDescriptions.push(`page: ${pageNum}`);
    logger.info(`Fetched ${notifications.length} of ${total} notifications${filterDescriptions.length ? ` (filtered by ${filterDescriptions.join(', ')})` : ''}`);

    if (isHtmxRequest(req)) {
      const notificationHtml = notifications.map(notif => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">🔔</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${notif.title}</div>
                <div class="text-sm text-gray-500">${notif.message?.substring(0, 50)}${notif.message?.length > 50 ? '...' : ''}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              notif.type === 'info' ? 'bg-blue-100 text-blue-800' :
              notif.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              notif.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }">${notif.type}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              notif.priority === 'high' ? 'bg-red-100 text-red-800' :
              notif.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }">${notif.priority}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              notif.is_read ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }">${notif.is_read ? 'Read' : 'Unread'}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(notif.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('notification', ${notif.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-notification-${notif.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/notifications/${notif.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="markAsRead(${notif.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Mark as Read
                  </button>
                  <button onclick="editNotification(${notif.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Notification
                  </button>
                  <button onclick="deleteNotification(${notif.id}, '${notif.title}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query);
      res.send(notificationHtml + paginationHtml);
    } else {
      res.json({ success: true, data: notifications, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading notifications</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get single notification by ID
export const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notificationService = serviceFactory.getNotificationService();
    const notification = await notificationService.getNotificationById(id);

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    logger.error('Error fetching notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new notification
export const createNotification = [
  validateNotificationCreation,
  async (req, res) => {
    try {
      const notificationData = req.body;
      const notificationService = serviceFactory.getNotificationService();
      const notification = await notificationService.createNotification(notificationData);

      logger.info(`Created notification with ID: ${notification.id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Notification "${notification.title}" created successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#notificationsTableContainer', 'notificationCreated');
          </script>
        `);
      } else {
        res.status(201).json({ success: true, data: notification });
      }
    } catch (error) {
      logger.error('Error creating notification:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create notification: ${error.message}</div>
              </div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

// Update notification
export const updateNotification = [
  validateNotificationUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const notificationService = serviceFactory.getNotificationService();
      const notification = await notificationService.updateNotification(id, updates);

      if (!notification) {
        return res.status(404).json({ success: false, error: 'Notification not found' });
      }

      logger.info(`Updated notification with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <div class="flex-1">Notification "${notification.title}" updated successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#notificationsTableContainer', 'notificationUpdated');
          </script>
        `);
      } else {
        res.json({ success: true, data: notification });
      }
    } catch (error) {
      logger.error('Error updating notification:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to update notification: ${error.message}</div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

// Delete notification
export const deleteNotification = [
  validateNotificationDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      const notificationService = serviceFactory.getNotificationService();
      const existingNotification = await notificationService.getNotificationById(id);

      if (!existingNotification) {
        return res.status(404).json({ success: false, error: 'Notification not found' });
      }

      await notificationService.deleteNotification(id);

      logger.info(`Deleted notification with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div class="flex-1">Notification "${existingNotification.title}" has been deleted!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#notificationsTableContainer', 'notificationDeleted');
          </script>
        `);
      } else {
        res.json({ success: true, message: 'Notification deleted successfully' });
      }
    } catch (error) {
      logger.error('Error deleting notification:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to delete notification: ${error.message}</div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

// Helper function to generate pagination HTML
const generatePaginationHtml = (page, limit, total, query) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const search = query.search || '';
  const type = query.type || '';
  const is_read = query.is_read || '';
  const priority = query.priority || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&type=${type}&is_read=${is_read}&priority=${priority}`;

  let html = `<div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">`;
  if (page > 1) {
    html += `<button hx-get="/api/notifications?page=${page-1}&${params}" hx-target="#notificationsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"></button>`;
  } else {
  }

  // Page number buttons
  html += `<div class="flex items-center space-x-2">`;
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === page) {
      html += `<span class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-9 w-9">${i}</span>`;
    } else {
      html += `<button hx-get="/api/notifications?page=${i}&${params}" hx-target="#notificationsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/notifications?page=${page+1}&${params}" hx-target="#notificationsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>/button>`;
  } else {
  }
  html += `</div>`;
  return html;
};

// Route setup function
export default function notificationsRoutes(app) {
  app.get('/api/notifications', getNotifications);
  app.get('/api/notifications/:id', getNotification);
  app.post('/api/notifications', ...createNotification);
  app.put('/api/notifications/:id', ...updateNotification);
  app.delete('/api/notifications/:id', ...deleteNotification);
}