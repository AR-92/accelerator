/**
 * Migration: Populate help data
 * Inserts default categories and sample articles for help content
 */

module.exports = {
  up: async (db) => {
    // Insert default categories
    const insertCategories = `
      INSERT OR IGNORE INTO help_categories (name, slug, description, icon, color, sort_order) VALUES
      ('Getting Started', 'getting-started', 'Learn the basics and set up your account', 'Rocket', '#10B981', 1),
      ('AI Assistant', 'ai-assistant', 'Master our AI tools and features', 'Bot', '#8B5CF6', 2),
      ('Account & Billing', 'account-billing', 'Manage your account and payments', 'CreditCard', '#F59E0B', 3),
      ('FAQ', 'faq', 'Common questions and answers', 'HelpCircle', '#EF4444', 4);
    `;

    // Insert sample articles
    const insertArticles = `
      INSERT OR IGNORE INTO help_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name
      ) VALUES
      (1, 'Creating Your First Project', 'creating-your-first-project',
       'Start your entrepreneurial journey by creating your first project',
       'Start your entrepreneurial journey by creating your first project. This will be the foundation for all your startup activities.',
       3, 'beginner', '["getting-started", "projects", "setup"]', 1, 'Support Team'),

      (1, 'Navigating the Dashboard', 'navigating-the-dashboard',
       'Familiarize yourself with the main areas of our platform',
       'Familiarize yourself with the main areas of our platform to make the most of your experience.',
       2, 'beginner', '["dashboard", "navigation", "interface"]', 0, 'Support Team'),

      (2, 'How to Use AI Models', 'how-to-use-ai-models',
       'Our AI assistant uses advanced language models to provide personalized recommendations',
       'Our AI assistant uses advanced language models to provide personalized recommendations for your startup.',
       4, 'intermediate', '["ai", "assistant", "models"]', 1, 'AI Team'),

      (2, 'Generating Business Ideas', 'generating-business-ideas',
       'Discover innovative business opportunities tailored to your interests',
       'Discover innovative business opportunities tailored to your interests and market trends.',
       3, 'beginner', '["ideas", "ai", "generation"]', 0, 'AI Team'),

      (3, 'Managing Your Subscription', 'managing-your-subscription',
       'Keep track of your subscription status and make changes as needed',
       'Keep track of your subscription status and make changes as needed.',
       3, 'beginner', '["subscription", "billing", "account"]', 1, 'Billing Team'),

      (3, 'Payment Methods', 'payment-methods',
       'Securely manage your payment information and billing preferences',
       'Securely manage your payment information and billing preferences.',
       2, 'beginner', '["payment", "billing", "security"]', 0, 'Billing Team'),

      (4, 'What is the Accelerator Platform?', 'what-is-the-accelerator-platform',
       'The Accelerator Platform is an AI-powered tool designed to help entrepreneurs',
       'The Accelerator Platform is an AI-powered tool designed to help entrepreneurs and startups build, launch, and scale their businesses.',
       2, 'beginner', '["platform", "overview", "faq"]', 1, 'Support Team'),

      (4, 'How does the AI assistant work?', 'how-does-the-ai-assistant-work',
       'Our AI assistant uses advanced machine learning models to analyze your project requirements',
       'Our AI assistant uses advanced machine learning models to analyze your project requirements and provide tailored recommendations.',
       3, 'intermediate', '["ai", "assistant", "faq"]', 0, 'AI Team');
    `;

    try {
      await db.run(insertCategories);
      await db.run(insertArticles);
      console.log('Help data populated successfully');
    } catch (error) {
      console.error('Error populating help data:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run(
        'DELETE FROM help_articles WHERE category_id IN (SELECT id FROM help_categories WHERE slug IN ("getting-started", "ai-assistant", "account-billing", "faq"))'
      );
      await db.run(
        'DELETE FROM help_categories WHERE slug IN ("getting-started", "ai-assistant", "account-billing", "faq")'
      );
      console.log('Help data removed successfully');
    } catch (error) {
      console.error('Error removing help data:', error);
      throw error;
    }
  },
};
