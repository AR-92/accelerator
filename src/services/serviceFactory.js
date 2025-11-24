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
    // Add methods as needed
  }),
  getDatabaseTableService: () => ({
    // Add methods as needed
  }),
};
