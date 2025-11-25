// Table filter configurations for dynamic search and filtering
// This file defines which tables support filtering, what fields are searchable,
// and what status options are available for each table.

const tableFilters = {
  ideas: {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'active', label: 'Active' },
      { value: 'draft', label: 'Draft' },
    ],
  },

  users: {
    searchableFields: ['display_name', 'username'],
    statusField: 'is_verified',
    statusOptions: [
      { value: 'active', label: 'Active', filter: 'is_verified.eq.true' },
      { value: 'inactive', label: 'Inactive', filter: 'is_verified.eq.false' },
    ],
  },

  todos: {
    searchableFields: ['title', 'description'],
    statusField: 'completed',
    statusOptions: [
      { value: 'pending', label: 'Pending', filter: 'completed.eq.false' },
      { value: 'completed', label: 'Completed', filter: 'completed.eq.true' },
    ],
  },

  content: {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },

  votes: {
    searchableFields: ['entity_title', 'entity_type'],
    statusField: 'vote_type',
    statusOptions: [
      { value: 'upvote', label: 'Upvotes' },
      { value: 'downvote', label: 'Downvotes' },
    ],
  },

  collaborations: {
    searchableFields: ['message'],
    statusField: 'status',
    statusOptions: [
      { value: 'pending', label: 'Pending' },
      { value: 'active', label: 'Active' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },

  'learning-content': {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
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
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'deprecated', label: 'Deprecated' },
    ],
  },

  billing: {
    searchableFields: ['invoice_number', 'plan_name', 'amount_cents'],
    statusField: 'status',
    statusOptions: [
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' },
    ],
  },

  rewards: {
    searchableFields: ['title', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'expired', label: 'Expired' },
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
      { value: 'draft', label: 'Draft' },
      { value: 'review', label: 'Review' },
      { value: 'final', label: 'Final' },
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
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'dissolved', label: 'Dissolved' },
    ],
  },

  enterprises: {
    searchableFields: ['name', 'description'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'acquired', label: 'Acquired' },
    ],
  },

  messages: {
    searchableFields: ['content', 'subject'],
    statusField: 'status',
    statusOptions: [
      { value: 'sent', label: 'Sent' },
      { value: 'draft', label: 'Draft' },
      { value: 'archived', label: 'Archived' },
    ],
  },

  'project-collaborators': {
    searchableFields: ['role'],
  },

  calendar: {
    searchableFields: ['title', 'description', 'location'],
    statusField: 'status',
    statusOptions: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },

  'help-center': {
    searchableFields: ['title', 'content'],
  },

  'landing-page': {
    searchableFields: ['title'],
    statusField: 'is_active',
    statusOptions: [
      { value: true, label: 'Active', filter: 'is_active.eq.true' },
      { value: false, label: 'Inactive', filter: 'is_active.eq.false' },
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
