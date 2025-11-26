// Table filter configurations for dynamic search and filtering
// This file defines which tables support filtering, what fields are searchable,
// and what status options are available for each table.

const tableFilters = {
  ideas: {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'pending', label: 'Pending', icon: 'clock' },
      { value: 'approved', label: 'Approved', icon: 'check-circle' },
      { value: 'rejected', label: 'Rejected', icon: 'x-circle' },
      { value: 'active', label: 'Active', icon: 'check-circle' },
      { value: 'draft', label: 'Draft', icon: 'file-text' },
    ],
  },

  users: {
    searchableFields: ['display_name', 'username'],
    statusField: 'is_verified',
    statusOptions: [
      {
        value: 'active',
        label: 'Active',
        filter: 'is_verified.eq.true',
        icon: 'check-circle',
      },
      {
        value: 'inactive',
        label: 'Inactive',
        filter: 'is_verified.eq.false',
        icon: 'x-circle',
      },
    ],
  },

  todos: {
    searchableFields: ['title', 'description'],
    statusField: 'completed',
    statusOptions: [
      {
        value: 'pending',
        label: 'Pending',
        filter: 'completed.eq.false',
        icon: 'clock',
      },
      {
        value: 'completed',
        label: 'Completed',
        filter: 'completed.eq.true',
        icon: 'check-circle',
      },
    ],
  },

  content: {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft', icon: 'file-text' },
      { value: 'published', label: 'Published', icon: 'eye' },
      { value: 'archived', label: 'Archived', icon: 'archive' },
    ],
  },

  votes: {
    searchableFields: ['entity_title', 'entity_type'],
    statusField: 'vote_type',
    statusOptions: [
      { value: 'upvote', label: 'Upvotes', icon: 'thumbs-up' },
      { value: 'downvote', label: 'Downvotes', icon: 'thumbs-down' },
    ],
  },

  collaborations: {
    searchableFields: ['message'],
    statusField: 'status',
    statusOptions: [
      { value: 'pending', label: 'Pending', icon: 'clock' },
      { value: 'active', label: 'Active', icon: 'check-circle' },
      { value: 'completed', label: 'Completed', icon: 'check-circle' },
      { value: 'cancelled', label: 'Cancelled', icon: 'x-circle' },
    ],
  },

  'learning-content': {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft', icon: 'file-text' },
      { value: 'published', label: 'Published', icon: 'eye' },
      { value: 'archived', label: 'Archived', icon: 'archive' },
    ],
  },

  'learning-categories': {
    searchableFields: ['name', 'description'],
    // Categories typically don't have status filtering
    enabled: true,
    statusOptions: [],
  },

  'learning-assessments': {
    searchableFields: ['title', 'description'],
  },

  packages: {
    searchableFields: ['name', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active', icon: 'check-circle' },
      { value: 'inactive', label: 'Inactive', icon: 'x-circle' },
      { value: 'deprecated', label: 'Deprecated', icon: 'alert-triangle' },
    ],
  },

  billing: {
    searchableFields: ['invoice_number', 'plan_name', 'amount_cents'],
    statusField: 'status',
    statusOptions: [
      { value: 'pending', label: 'Pending', icon: 'clock' },
      { value: 'paid', label: 'Paid', icon: 'credit-card' },
      { value: 'failed', label: 'Failed', icon: 'alert-triangle' },
      { value: 'refunded', label: 'Refunded', icon: 'refresh-cw' },
    ],
  },

  rewards: {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active', icon: 'check-circle' },
      { value: 'inactive', label: 'Inactive', icon: 'x-circle' },
      { value: 'expired', label: 'Expired', icon: 'calendar-x' },
    ],
  },

  'business-model': {
    searchableFields: ['name', 'description'],
  },

  'business-plan': {
    searchableFields: ['name', 'description'],
  },

  'financial-model': {
    searchableFields: ['name', 'description'],
  },

  pitchdeck: {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft', icon: 'file-text' },
      { value: 'review', label: 'Review', icon: 'eye' },
      { value: 'final', label: 'Final', icon: 'check-circle' },
    ],
  },

  valuation: {
    searchableFields: ['method', 'enterprise_value', 'equity_value'],
  },

  funding: {
    searchableFields: ['funding_required', 'funding_type', 'funding_stage'],
  },

  team: {
    searchableFields: ['founders_count', 'employees_count', 'work_mode'],
  },

  legal: {
    searchableFields: ['name', 'description'],
  },

  marketing: {
    searchableFields: ['name', 'description'],
  },

  corporate: {
    searchableFields: ['name', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active', icon: 'check-circle' },
      { value: 'inactive', label: 'Inactive', icon: 'x-circle' },
      { value: 'dissolved', label: 'Dissolved', icon: 'x-circle' },
    ],
  },

  enterprises: {
    searchableFields: ['name', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active', icon: 'check-circle' },
      { value: 'inactive', label: 'Inactive', icon: 'x-circle' },
      { value: 'acquired', label: 'Acquired', icon: 'trophy' },
    ],
  },

  messages: {
    searchableFields: ['content', 'subject'],
    statusField: 'status',
    statusOptions: [
      { value: 'sent', label: 'Sent', icon: 'send' },
      { value: 'draft', label: 'Draft', icon: 'file-text' },
      { value: 'archived', label: 'Archived', icon: 'archive' },
    ],
  },

  'project-collaborators': {
    searchableFields: ['role'],
  },

  calendar: {
    searchableFields: ['title', 'description', 'location'],
    statusField: 'status',
    statusOptions: [
      { value: 'scheduled', label: 'Scheduled', icon: 'calendar' },
      { value: 'completed', label: 'Completed', icon: 'check-circle' },
      { value: 'cancelled', label: 'Cancelled', icon: 'x-circle' },
    ],
  },

  'help-center': {
    searchableFields: ['title', 'content'],
  },

  'landing-page': {
    searchableFields: ['title'],
    statusField: 'is_active',
    statusOptions: [
      {
        value: true,
        label: 'Active',
        filter: 'is_active.eq.true',
        icon: 'check-circle',
      },
      {
        value: false,
        label: 'Inactive',
        filter: 'is_active.eq.false',
        icon: 'x-circle',
      },
    ],
  },

  'learning-analytics': {
    searchableFields: ['user_id', 'content_id', 'event_type'],
    // Analytics data typically doesn't have status filtering
    enabled: true,
    statusOptions: [],
  },
};

// Helper function to get table configuration
const getTableConfig = (tableName) => {
  return tableFilters[tableName] || null;
};

// Helper function to check if table has filtering enabled
const isTableFilterable = (tableName) => {
  const config = getTableConfig(tableName);
  return config && config.enabled !== false;
};

export { tableFilters, getTableConfig, isTableFilterable };
