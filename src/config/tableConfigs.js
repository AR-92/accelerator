// Table configurations for generic table system
// Defines columns, actions, bulk actions, and metadata for each table

const tableConfigs = {
  ideas: {
    title: 'Ideas Management',
    entityName: 'idea',
    tableName: 'ideas',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      {
        key: 'title',
        label: 'Title',
        type: 'title',
        descriptionKey: 'description',
      },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'upvotes',
        label: 'Upvotes',
        type: 'text',
        hidden: true,
        responsive: 'md:table-cell',
      },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/ideas/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'link',
        url: '/admin/table-pages/ideas/edit',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      },
      {
        type: 'delete',
        hxDelete: '/api/ideas',
        hxConfirm: 'Are you sure you want to delete this idea?',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkApproveIdeas',
        buttonId: 'bulkApproveBtn',
        label: 'Approve Selected',
      },
      {
        onclick: 'bulkRejectIdeas',
        buttonId: 'bulkRejectBtn',
        label: 'Reject Selected',
      },
      {
        onclick: 'bulkDeleteIdeas',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  users: {
    title: 'Users Management',
    entityName: 'user',
    tableName: 'accounts',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'role',
        label: 'Role',
        type: 'text',
        hidden: true,
        responsive: 'md:table-cell',
      },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
      {
        key: 'last_login',
        label: 'Last Login',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/users/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'link',
        url: '/admin/table-pages/users/edit',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      },
      {
        type: 'delete',
        hxDelete: '/api/accounts',
        hxConfirm: 'Are you sure you want to delete this user?',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivate',
        buttonId: 'bulkActivateBtn',
        label: 'Activate',
      },
      {
        onclick: 'bulkDeactivate',
        buttonId: 'bulkDeactivateBtn',
        label: 'Deactivate',
      },
      {
        onclick: 'bulkDeleteUsers',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
    dataMapper: (users) =>
      users.map((user) => ({
        id: user.id,
        name: user.display_name || user.username || `User ${user.id}`,
        email: user.username
          ? `${user.username}@example.com`
          : `user${user.id}@example.com`,
        status: user.is_verified ? 'active' : 'inactive',
        role: user.account_type === 'business' ? 'Business' : 'User',
        created_at: user.created_at,
        last_login: user.last_login_at,
      })),
  },

  billing: {
    title: 'Billing Management',
    entityName: 'billing',
    tableName: 'billings',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'user', label: 'User', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'package', label: 'Package', type: 'text' },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/billing/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        hxGet: '/api/users/edit-form',
        label: 'Edit User',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'toggle',
        hxPut: '/api/users/toggle-status',
        label: 'Toggle Status',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-user-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16,11 18,13 22,9"></polyline></svg>',
      },
      {
        type: 'delete',
        hxDelete: '/api/users',
        hxConfirm: 'Are you sure you want to delete this user?',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkRefundTransactions',
        buttonId: 'bulkRefundBtn',
        label: 'Refund Selected',
      },
    ],
    dataMapper: (transactions) =>
      transactions.map((tx) => ({
        id: tx.id,
        user: tx.user_id ? `User ${tx.user_id}` : 'Unknown',
        amount: `$${(tx.amount_cents / 100).toFixed(2)}`,
        status: tx.status,
        date: tx.created_at,
        package: tx.plan_name || 'N/A',
      })),
  },

  calendar: {
    title: 'Calendar Management',
    entityName: 'calendar event',
    tableName: 'calendars',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'event_type', label: 'Type', type: 'text' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/calendar/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editCalendarEvent',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteCalendarEvent',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkCompleteEvents',
        buttonId: 'bulkCompleteBtn',
        label: 'Mark Completed',
      },
      {
        onclick: 'bulkCancelEvents',
        buttonId: 'bulkCancelBtn',
        label: 'Cancel Selected',
      },
      {
        onclick: 'bulkDeleteEvents',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  'business-model': {
    title: 'Business Model Management',
    entityName: 'business model',
    tableName: 'business_models',
    showCheckbox: true,
    showBulkActions: false,
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'business_type', label: 'Type', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/business-model/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editBusinessModel',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteBusinessModel',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [],
  },

  'business-plan': {
    title: 'Business Plan Management',
    entityName: 'business plan',
    tableName: 'business_plans',
    showCheckbox: true,
    showBulkActions: false,
    columns: [
      { key: 'company_name', label: 'Company', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'current_stage', label: 'Stage', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/business-plan/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editBusinessPlan',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteBusinessPlan',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [],
  },

  collaborations: {
    title: 'Collaborations Management',
    entityName: 'collaboration',
    tableName: 'collaborations',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'members_count', label: 'Members', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/collaborations/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editCollaboration',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'button',
        onclick: 'archiveCollaboration',
        label: 'Archive',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-archive" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21,8 21,21 3,21 3,8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteCollaboration',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkArchiveCollaborations',
        buttonId: 'bulkArchiveBtn',
        label: 'Archive Selected',
      },
      {
        onclick: 'bulkDeleteCollaborations',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  content: {
    title: 'Content Management',
    entityName: 'content',
    tableName: 'learning_content',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/content/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editContent',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteContent',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkArchiveContent',
        buttonId: 'bulkArchiveBtn',
        label: 'Archive Selected',
      },
      {
        onclick: 'bulkDeleteContent',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
    dataMapper: (content) =>
      content.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.content_type,
        status: item.status,
        created_at: item.created_at,
      })),
  },

  corporate: {
    title: 'Corporate Management',
    entityName: 'corporate',
    tableName: 'corporates',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'company_size', label: 'Size', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/corporate/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editCorporate',
        label: 'Edit Corporate',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteCorporate',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivateCorporates',
        buttonId: 'bulkActivateBtn',
        label: 'Activate Selected',
      },
      {
        onclick: 'bulkDeactivateCorporates',
        buttonId: 'bulkDeactivateBtn',
        label: 'Deactivate Selected',
      },
      {
        onclick: 'bulkDeleteCorporates',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  enterprises: {
    title: 'Enterprises Management',
    entityName: 'enterprise',
    tableName: 'enterprises',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'company_size', label: 'Size', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/enterprises/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editEnterprise',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteEnterprise',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkDeleteEnterprises',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  'financial-model': {
    title: 'Financial Model Management',
    entityName: 'financial model',
    tableName: 'financial_models',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'model_name', label: 'Model Name', type: 'text' },
      { key: 'model_status', label: 'Status', type: 'status' },
      { key: 'progress_percentage', label: 'Progress', type: 'text' },
      { key: 'monthly_revenue', label: 'Revenue', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/financial-model/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editFinancialModel',
        label: 'Edit Financial Model',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteFinancialModel',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkFinalizeModels',
        buttonId: 'bulkFinalizeBtn',
        label: 'Mark as Final',
      },
      {
        onclick: 'bulkArchiveModels',
        buttonId: 'bulkArchiveBtn',
        label: 'Archive Selected',
      },
      {
        onclick: 'bulkDeleteModels',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  funding: {
    title: 'Funding Management',
    entityName: 'funding',
    tableName: 'fundings',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      {
        key: 'total_funding_required',
        label: 'Funding Required',
        type: 'text',
      },
      { key: 'funding_type', label: 'Type', type: 'text' },
      { key: 'funding_stage', label: 'Stage', type: 'text' },
      { key: 'burn_rate', label: 'Burn Rate', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/funding/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editFunding',
        label: 'Edit Funding',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteFunding',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkFundFundings',
        buttonId: 'bulkFundBtn',
        label: 'Mark as Funded',
      },
      {
        onclick: 'bulkCloseFundings',
        buttonId: 'bulkCloseBtn',
        label: 'Close Selected',
      },
      {
        onclick: 'bulkDeleteFundings',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  'landing-page': {
    title: 'Landing Page Management',
    entityName: 'section',
    tableName: 'landing_page_managements',
    showCheckbox: false,
    showBulkActions: false,
    columns: [
      { key: 'name', label: 'Section Name', type: 'text' },
      { key: 'is_active', label: 'Status', type: 'status' },
      { key: 'last_updated', label: 'Last Updated', type: 'date' },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/landing-page/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editSection',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteSection',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [],
    dataMapper: (sections) =>
      sections.map((section) => ({
        id: section.id,
        name: section.title || section.name || `Section ${section.id}`,
        is_active: section.is_active,
        last_updated: section.updated_at || section.created_at,
      })),
  },

  'learning-analytics': {
    title: 'Learning Analytics Management',
    entityName: 'learning analytic',
    tableName: 'learning_analytics',
    showCheckbox: false,
    showBulkActions: false,
    columns: [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'content_id', label: 'Content ID', type: 'text' },
      { key: 'event_type', label: 'Event Type', type: 'text' },
      { key: 'duration_seconds', label: 'Duration', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/learning-analytics/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'link',
        url: '/admin/table-pages/learning-analytics/edit',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      },
      {
        type: 'delete',
        hxDelete: '/api/learning_analytics',
        hxConfirm: 'Are you sure you want to delete this learning analytic?',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [],
  },

  'learning-assessments': {
    title: 'Learning Assessments Management',
    entityName: 'learning assessment',
    tableName: 'learning_assessments',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'assessment_type', label: 'Type', type: 'text' },
      { key: 'difficulty_level', label: 'Difficulty', type: 'text' },
      { key: 'passing_score', label: 'Passing Score', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/learning-assessments/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editLearningAssessment',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteLearningAssessment',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivateAssessments',
        buttonId: 'bulkActivateBtn',
        label: 'Activate Selected',
      },
      {
        onclick: 'bulkDeactivateAssessments',
        buttonId: 'bulkDeactivateBtn',
        label: 'Deactivate Selected',
      },
      {
        onclick: 'bulkDeleteAssessments',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  'learning-categories': {
    title: 'Learning Categories Management',
    entityName: 'learning category',
    tableName: 'learning_categories',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'category_type', label: 'Type', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'status' },
      { key: 'content_count', label: 'Content Count', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/learning-categories/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editLearningCategory',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteLearningCategory',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkDeleteLearningCategories',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  'learning-content': {
    title: 'Learning Content Management',
    entityName: 'learning content',
    tableName: 'learning_content',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content_type', label: 'Type', type: 'text' },
      { key: 'difficulty_level', label: 'Difficulty', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/learning-content/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editLearningContent',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteLearningContent',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkDeleteLearningContents',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  legal: {
    title: 'Legal Management',
    entityName: 'legal',
    tableName: 'legal',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'company_name', label: 'Company', type: 'text' },
      { key: 'company_type', label: 'Type', type: 'text' },
      { key: 'incorporation_date', label: 'Incorporation', type: 'date' },
      { key: 'compliance_status', label: 'Compliance', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/legal/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editLegal',
        label: 'Edit Legal',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteLegal',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkApproveLegals',
        buttonId: 'bulkApproveBtn',
        label: 'Approve Selected',
      },
      {
        onclick: 'bulkExecuteLegals',
        buttonId: 'bulkExecuteBtn',
        label: 'Execute Selected',
      },
      {
        onclick: 'bulkDeleteLegals',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  marketing: {
    title: 'Marketing Management',
    entityName: 'marketing',
    tableName: 'marketing',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'unique_value_proposition', label: 'UVP', type: 'text' },
      { key: 'marketing_channels', label: 'Channels', type: 'text' },
      { key: 'marketing_budget', label: 'Budget', type: 'text' },
      { key: 'target_audience', label: 'Audience', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/marketing/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editMarketing',
        label: 'Edit Marketing',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteMarketing',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivateMarketings',
        buttonId: 'bulkActivateBtn',
        label: 'Activate Selected',
      },
      {
        onclick: 'bulkArchiveMarketings',
        buttonId: 'bulkArchiveBtn',
        label: 'Archive Selected',
      },
      {
        onclick: 'bulkDeleteMarketings',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  packages: {
    title: 'Packages Management',
    entityName: 'package',
    tableName: 'packages',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'name', label: 'Package Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'subscribers', label: 'Total Subscribers', type: 'text' },
      { key: 'active_subscribers', label: 'Active Subscribers', type: 'text' },
      { key: 'total_revenue', label: 'Total Revenue', type: 'text' },
      { key: 'features', label: 'Features', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/packages/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editPackage',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'button',
        onclick: 'togglePackage',
        label: 'Toggle Status',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>',
      },
      {
        type: 'delete',
        onclick: 'deletePackage',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivatePackages',
        buttonId: 'bulkActivateBtn',
        label: 'Activate Selected',
      },
      {
        onclick: 'bulkDeactivatePackages',
        buttonId: 'bulkDeactivateBtn',
        label: 'Deactivate Selected',
      },
      {
        onclick: 'bulkDeletePackages',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
    dataMapper: (packagesData) => {
      // Fetch billing data to compute statistics
      // This is a simplified version; in practice, you'd need to await the billing query
      return packagesData.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description
          ? pkg.description.substring(0, 50) +
            (pkg.description.length > 50 ? '...' : '')
          : '',
        price: `$${(pkg.price_cents / 100).toFixed(2)}`,
        status: pkg.status,
        subscribers: 0, // Would be computed from billing data
        active_subscribers: 0,
        total_revenue: '$0.00',
        features: Array.isArray(pkg.features)
          ? pkg.features.join(', ')
          : pkg.features,
        created_at: pkg.created_at,
      }));
    },
  },

  pitchdeck: {
    title: 'Pitch Deck Management',
    entityName: 'pitch deck',
    tableName: 'pitch_deck',
    showCheckbox: true,
    showBulkActions: false,
    columns: [
      { key: 'title_slide', label: 'Title', type: 'text' },
      { key: 'problem_statement', label: 'Problem', type: 'text' },
      { key: 'solution_overview', label: 'Solution', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/pitchdeck/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editPitchDeck',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deletePitchDeck',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [],
  },

  rewards: {
    title: 'Rewards Management',
    entityName: 'reward',
    tableName: 'rewards',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'author', label: 'Author', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/rewards/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editReward',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'button',
        onclick: 'toggleReward',
        label: 'Toggle Status',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteReward',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivateRewards',
        buttonId: 'bulkActivateBtn',
        label: 'Activate Selected',
      },
      {
        onclick: 'bulkDeactivateRewards',
        buttonId: 'bulkDeactivateBtn',
        label: 'Deactivate Selected',
      },
      {
        onclick: 'bulkDeleteRewards',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  team: {
    title: 'Team Management',
    entityName: 'team',
    tableName: 'team',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'founders_count', label: 'Founders', type: 'text' },
      { key: 'employees_count', label: 'Employees', type: 'text' },
      { key: 'work_mode', label: 'Work Mode', type: 'text' },
      { key: 'readiness_score', label: 'Readiness', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/team/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editTeam',
        label: 'Edit Team',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteTeam',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivateTeams',
        buttonId: 'bulkActivateBtn',
        label: 'Activate Selected',
      },
      {
        onclick: 'bulkDeactivateTeams',
        buttonId: 'bulkDeactivateBtn',
        label: 'Deactivate Selected',
      },
      {
        onclick: 'bulkDeleteTeams',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  valuation: {
    title: 'Valuation Management',
    entityName: 'valuation',
    tableName: 'valuation',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'valuation_date', label: 'Date', type: 'date' },
      { key: 'valuation_method', label: 'Method', type: 'text' },
      { key: 'enterprise_value', label: 'Enterprise Value', type: 'text' },
      { key: 'equity_value', label: 'Equity Value', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/valuation/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editValuation',
        label: 'Edit Valuation',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteValuation',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkCompleteValuations',
        buttonId: 'bulkCompleteBtn',
        label: 'Mark as Completed',
      },
      {
        onclick: 'bulkArchiveValuations',
        buttonId: 'bulkArchiveBtn',
        label: 'Archive Selected',
      },
      {
        onclick: 'bulkDeleteValuations',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  votes: {
    title: 'Votes Management',
    entityName: 'vote',
    tableName: 'votes_management',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'entity_type', label: 'Type', type: 'text' },
      { key: 'entity_title', label: 'Title', type: 'text' },
      { key: 'vote_type', label: 'Vote Type', type: 'status' },
      { key: 'vote_count', label: 'Count', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/votes/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'link',
        url: '/admin/table-pages/votes/edit',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteVote',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkDeleteVotes',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  'help-center': {
    title: 'Help Center Management',
    entityName: 'help article',
    tableName: 'help_centers',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'views', label: 'Views', type: 'text' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/help-center/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editHelpArticle',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteHelpArticle',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkPublishArticles',
        buttonId: 'bulkPublishBtn',
        label: 'Publish Selected',
      },
      {
        onclick: 'bulkArchiveArticles',
        buttonId: 'bulkArchiveBtn',
        label: 'Archive Selected',
      },
      {
        onclick: 'bulkDeleteArticles',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  messages: {
    title: 'Messages Management',
    entityName: 'message',
    tableName: 'messages',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'sender_id', label: 'Sender', type: 'text' },
      { key: 'receiver_id', label: 'Receiver', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'is_read', label: 'Read', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/messages/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'link',
        url: '/admin/table-pages/messages/edit',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteMessage',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkMarkAsRead',
        buttonId: 'bulkReadBtn',
        label: 'Mark as Read',
      },
      {
        onclick: 'bulkDeleteMessages',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  'project-collaborators': {
    title: 'Project Collaborators Management',
    entityName: 'project collaborator',
    tableName: 'project_collaborators',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      { key: 'project_id', label: 'Project ID', type: 'text' },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/project-collaborators/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editProjectCollaborator',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteProjectCollaborator',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkActivateCollaborators',
        buttonId: 'bulkActivateBtn',
        label: 'Activate Selected',
      },
      {
        onclick: 'bulkDeactivateCollaborators',
        buttonId: 'bulkDeactivateBtn',
        label: 'Deactivate Selected',
      },
      {
        onclick: 'bulkDeleteCollaborators',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  todos: {
    title: 'Todos Management',
    entityName: 'todo',
    tableName: 'todos',
    showCheckbox: true,
    showBulkActions: true,
    columns: [
      {
        key: 'title',
        label: 'Title',
        type: 'title',
        descriptionKey: 'description',
      },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'priority', label: 'Priority', type: 'text' },
      {
        key: 'due_date',
        label: 'Due Date',
        type: 'date',
        hidden: true,
        responsive: 'md:table-cell',
      },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ],
    actions: [
      {
        type: 'link',
        url: '/admin/table-pages/todos/view',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        hxGet: '/api/todos/edit-form',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
      },
      {
        type: 'toggle',
        hxPut: '/api/todos',
        label: 'Toggle Status',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-check-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>',
      },
      {
        type: 'delete',
        hxDelete: '/api/todos',
        hxConfirm: 'Are you sure you want to delete this todo?',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ],
    bulkActions: [
      {
        onclick: 'bulkCompleteTodos',
        buttonId: 'bulkCompleteBtn',
        label: 'Mark Complete',
      },
      {
        onclick: 'bulkDeleteTodos',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ],
  },

  // Add more table configurations as needed...
};

export { tableConfigs };
