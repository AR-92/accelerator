import { databaseService } from './index.js';

export const serviceFactory = {
  getIdeaService: () => ({
    getAllIdeas: async (filter, options) => {
      let query = databaseService.supabase.from('ideas').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getIdeaById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    createIdea: async (ideaData) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .insert([ideaData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    updateIdea: async (id, updates) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteIdea: async (id) => {
      const { error } = await databaseService.supabase
        .from('ideas')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    voteIdea: async (id, voteType) => {
      // First get current votes
      const { data: idea, error: fetchError } = await databaseService.supabase
        .from('ideas')
        .select('upvotes, downvotes')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const updates = {};
      if (voteType === 'up') {
        updates.upvotes = (idea.upvotes || 0) + 1;
      } else if (voteType === 'down') {
        updates.downvotes = (idea.downvotes || 0) + 1;
      }

      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    approveIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    rejectIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'rejected' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  }),
  getActivityService: () => ({
    getActivityLogsForAdmin: async (limit) => {
      const { data, error } = await databaseService.supabase
        .from('activity_logs')
        .select('*')
        .limit(limit);
      if (error) throw error;
      return { activities: data, stats: {} };
    },
  }),
  getNotificationService: () => ({
    // Add methods as needed
  }),
  getSystemHealthService: () => ({
    // Add methods as needed
  }),
  getMessageService: () => ({
    // Add methods as needed
  }),
  getFinancialService: () => ({
    // Add methods as needed
  }),
  getBillingService: () => ({
    getAllBilling: async (filter, options) => {
      let query = databaseService.supabase
        .from('billings')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (filter.search && filter.search.trim()) {
        const searchTerm = filter.search.trim();
        query = query.or(
          `invoice_number.ilike.%${searchTerm}%,plan_name.ilike.%${searchTerm}%`
        );
      }

      // Apply status filter
      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      // Apply pagination
      const offset = (options.page - 1) * options.limit;
      query = query.range(offset, offset + options.limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { data, count };
    },

    getBillingById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('billings')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    refundBilling: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('billings')
        .update({ status: 'refunded' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteBilling: async (id) => {
      const { error } = await databaseService.supabase
        .from('billings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getCalendarService: () => ({
    getAllCalendar: async (filter, options) => {
      let query = databaseService.supabase.from('calendars').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getCalendarById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('calendars')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    completeCalendar: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('calendars')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    cancelCalendar: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('calendars')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteCalendar: async (id) => {
      const { error } = await databaseService.supabase
        .from('calendars')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getHelpCenterService: () => ({
    // Add methods as needed
  }),
  getLearningService: () => ({
    assessment: {
      getAllLearningAssessments: async (filter, options) => {
        let query = databaseService.supabase
          .from('learning_assessments')
          .select('*');
        if (options.limit) query = query.limit(options.limit);
        const { data, error } = await query;
        if (error) throw error;
        return { data };
      },
    },
  }),
  getAccountService: () => ({
    getAllAccounts: async (filter, options) => {
      let query = databaseService.supabase.from('accounts').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getAccountById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateAccount: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('accounts')
        .update({ is_verified: true, status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateAccount: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('accounts')
        .update({ is_verified: false, status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteAccount: async (id) => {
      const { error } = await databaseService.supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getDatabaseTableService: () => ({
    // Add methods as needed
  }),
  getProjectCollaboratorService: () => ({
    getAllProjectCollaborators: async (filter, options) => {
      let query = databaseService.supabase
        .from('project_collaborators')
        .select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getProjectCollaboratorById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('project_collaborators')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateProjectCollaborator: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('project_collaborators')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateProjectCollaborator: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('project_collaborators')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteProjectCollaborator: async (id) => {
      const { error } = await databaseService.supabase
        .from('project_collaborators')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getCollaborationService: () => ({
    getAllCollaborations: async (filter, options) => {
      let query = databaseService.supabase.from('collaborations').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getCollaborationById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('collaborations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    archiveCollaboration: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('collaborations')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteCollaboration: async (id) => {
      const { error } = await databaseService.supabase
        .from('collaborations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getContentService: () => ({
    getAllContent: async (filter, options) => {
      let query = databaseService.supabase.from('learning_content').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getContentById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_content')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    archiveContent: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_content')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteContent: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_content')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getCorporateService: () => ({
    getAllCorporate: async (filter, options) => {
      let query = databaseService.supabase.from('corporate').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getCorporateById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('corporate')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateCorporate: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('corporate')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateCorporate: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('corporate')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteCorporate: async (id) => {
      const { error } = await databaseService.supabase
        .from('corporate')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getEnterpriseService: () => ({
    getAllEnterprises: async (filter, options) => {
      let query = databaseService.supabase.from('enterprises').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getEnterpriseById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('enterprises')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteEnterprise: async (id) => {
      const { error } = await databaseService.supabase
        .from('enterprises')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getFinancialModelService: () => ({
    getAllFinancialModels: async (filter, options) => {
      let query = databaseService.supabase.from('financial_model').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getFinancialModelById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('financial_model')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    finalizeFinancialModel: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('financial_model')
        .update({ model_status: 'finalized' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveFinancialModel: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('financial_model')
        .update({ model_status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteFinancialModel: async (id) => {
      const { error } = await databaseService.supabase
        .from('financial_model')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getFundingService: () => ({
    getAllFunding: async (filter, options) => {
      let query = databaseService.supabase.from('funding').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getFundingById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('funding')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    fundFunding: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('funding')
        .update({ funding_stage: 'funded' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    closeFunding: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('funding')
        .update({ funding_stage: 'closed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteFunding: async (id) => {
      const { error } = await databaseService.supabase
        .from('funding')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getHelpCenterService: () => ({
    getAllHelpCenter: async (filter, options) => {
      let query = databaseService.supabase.from('help_center').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getHelpCenterById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('help_center')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    publishHelpCenter: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('help_center')
        .update({ status: 'published' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveHelpCenter: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('help_center')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteHelpCenter: async (id) => {
      const { error } = await databaseService.supabase
        .from('help_center')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getLearningAssessmentService: () => ({
    getAllLearningAssessments: async (filter, options) => {
      let query = databaseService.supabase
        .from('learning_assessments')
        .select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getLearningAssessmentById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_assessments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateLearningAssessment: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_assessments')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateLearningAssessment: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_assessments')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteLearningAssessment: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_assessments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getLearningCategoryService: () => ({
    getAllLearningCategories: async (filter, options) => {
      let query = databaseService.supabase
        .from('learning_categories')
        .select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getLearningCategoryById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_categories')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteLearningCategory: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getLearningContentService: () => ({
    getAllLearningContent: async (filter, options) => {
      let query = databaseService.supabase.from('learning_content').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getLearningContentById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_content')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteLearningContent: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_content')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getlegalService: () => ({
    getAlllegal: async (filter, options) => {
      let query = databaseService.supabase.from('legal').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getlegalById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('legal')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    approvelegal: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('legal')
        .update({ compliance_status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    executelegal: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('legal')
        .update({ compliance_status: 'executed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deletelegal: async (id) => {
      const { error } = await databaseService.supabase
        .from('legal')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getMarketingService: () => ({
    getAllMarketing: async (filter, options) => {
      let query = databaseService.supabase.from('marketing').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getMarketingById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('marketing')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateMarketing: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('marketing')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveMarketing: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('marketing')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteMarketing: async (id) => {
      const { error } = await databaseService.supabase
        .from('marketing')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getMessageService: () => ({
    getAllMessages: async (filter, options) => {
      let query = databaseService.supabase.from('messages').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getMessageById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    markAsReadMessage: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteMessage: async (id) => {
      const { error } = await databaseService.supabase
        .from('messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getPackageService: () => ({
    getAllPackages: async (filter, options) => {
      let query = databaseService.supabase.from('packages').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getPackageById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activatePackage: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('packages')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivatePackage: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('packages')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deletePackage: async (id) => {
      const { error } = await databaseService.supabase
        .from('packages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getRewardService: () => ({
    getAllRewards: async (filter, options) => {
      let query = databaseService.supabase.from('rewards').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getRewardById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('rewards')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateReward: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('rewards')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateReward: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('rewards')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteReward: async (id) => {
      const { error } = await databaseService.supabase
        .from('rewards')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getTeamService: () => ({
    getAllTeams: async (filter, options) => {
      let query = databaseService.supabase.from('team').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getTeamById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('team')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateTeam: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('team')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateTeam: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('team')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteTeam: async (id) => {
      const { error } = await databaseService.supabase
        .from('team')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getValuationService: () => ({
    getAllValuations: async (filter, options) => {
      let query = databaseService.supabase.from('valuation').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getValuationById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('valuation')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    completeValuation: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('valuation')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveValuation: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('valuation')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteValuation: async (id) => {
      const { error } = await databaseService.supabase
        .from('valuation')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getVoteService: () => ({
    getAllVotes: async (filter, options) => {
      let query = databaseService.supabase.from('votes').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getVoteById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('votes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteVote: async (id) => {
      const { error } = await databaseService.supabase
        .from('votes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
};
