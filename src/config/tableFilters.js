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
    searchableFields: ['name', 'description', 'members_count'],
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
    searchableFields: ['title', 'assessment_type', 'difficulty_level'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },

  packages: {
    searchableFields: ['name', 'description', 'price', 'features'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'deprecated', label: 'Deprecated' },
    ],
  },

  billing: {
    searchableFields: ['user', 'package', 'amount'],
    statusField: 'status',
    statusOptions: [
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' },
    ],
  },

  rewards: {
    searchableFields: ['title', 'type', 'author'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'expired', label: 'Expired' },
    ],
  },

  'business-model': {
    searchableFields: ['name', 'business_type', 'industry'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'review', label: 'Review' },
      { value: 'approved', label: 'Approved' },
    ],
  },

  'business-plan': {
    searchableFields: ['company_name', 'industry', 'current_stage'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'review', label: 'Review' },
      { value: 'approved', label: 'Approved' },
    ],
  },

  'financial-model': {
    searchableFields: [
      'model_name',
      'model_status',
      'progress_percentage',
      'monthly_revenue',
    ],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'final', label: 'Final' },
      { value: 'archived', label: 'Archived' },
    ],
  },

  pitchdeck: {
    searchableFields: ['title_slide', 'problem_statement', 'solution_overview'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'review', label: 'Review' },
      { value: 'final', label: 'Final' },
    ],
  },

  valuation: {
    searchableFields: ['valuation_method', 'enterprise_value', 'equity_value'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'completed', label: 'Completed' },
      { value: 'archived', label: 'Archived' },
    ],
  },

  funding: {
    searchableFields: [
      'total_funding_required',
      'funding_type',
      'funding_stage',
      'burn_rate',
    ],
    statusField: 'status',
    statusOptions: [
      { value: 'seeking', label: 'Seeking' },
      { value: 'funded', label: 'Funded' },
      { value: 'closed', label: 'Closed' },
    ],
  },

  team: {
    searchableFields: [
      'founders_count',
      'employees_count',
      'work_mode',
      'readiness_score',
    ],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'alumni', label: 'Alumni' },
    ],
  },

  legal: {
    searchableFields: ['company_name', 'company_type', 'compliance_status'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'review', label: 'Review' },
      { value: 'approved', label: 'Approved' },
      { value: 'executed', label: 'Executed' },
    ],
  },

  marketing: {
    searchableFields: [
      'unique_value_proposition',
      'marketing_channels',
      'marketing_budget',
      'target_audience',
    ],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'completed', label: 'Completed' },
      { value: 'archived', label: 'Archived' },
    ],
  },

  corporate: {
    searchableFields: ['name', 'industry', 'company_size', 'status'],
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
    searchableFields: ['sender_id', 'receiver_id', 'subject'],
    statusField: 'status',
    statusOptions: [
      { value: 'sent', label: 'Sent' },
      { value: 'draft', label: 'Draft' },
      { value: 'archived', label: 'Archived' },
    ],
  },

  'project-collaborators': {
    searchableFields: ['project_id', 'user_id', 'role'],
    statusField: 'status',
    statusOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'removed', label: 'Removed' },
    ],
  },

  calendar: {
    searchableFields: ['title', 'event_type'],
    statusField: 'status',
    statusOptions: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },

  'help-center': {
    searchableFields: ['title', 'category'],
    statusField: 'status',
    statusOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },

  'landing-pages': {
    searchableFields: ['title', 'description'],
    statusField: 'is_active',
    statusOptions: [
      { value: true, label: 'Active', filter: 'is_active.eq.true' },
      { value: false, label: 'Inactive', filter: 'is_active.eq.false' },
    ],
  },

  'learning-analytics': {
    searchableFields: [
      'user_id',
      'content_id',
      'event_type',
      'duration_seconds',
    ],
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
