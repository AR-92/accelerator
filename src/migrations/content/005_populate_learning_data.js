/**
 * Migration: Populate learning data
 * Inserts default categories and sample articles for learning content
 */

module.exports = {
  up: async (db) => {
    // Insert default categories
    const insertCategories = `
      INSERT OR IGNORE INTO learning_categories (name, slug, description, icon, color, sort_order) VALUES
      ('Getting Started', 'getting-started', 'Learn the fundamentals of entrepreneurship', 'Rocket', '#10B981', 1),
      ('Courses', 'courses', 'Structured learning paths for entrepreneurs', 'BookOpen', '#8B5CF6', 2),
      ('Tutorials', 'tutorials', 'Step-by-step guides and video tutorials', 'PlayCircle', '#F59E0B', 3),
      ('Resources', 'resources', 'Additional materials and references', 'FileText', '#EF4444', 4);
    `;

    // Insert sample articles
    const insertArticles = `
      INSERT OR IGNORE INTO learning_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name
      ) VALUES
      (1, 'From Idea to MVP', 'from-idea-to-mvp',
       'Building your first product from concept to launch',
       'This comprehensive guide walks you through the journey of transforming a business idea into a minimum viable product (MVP). Learn about idea validation, prototyping, and launching your first version.',
       8, 'beginner', '["startup", "mvp", "validation"]', 1, 'Sarah Johnson'),

      (1, 'Market Research Fundamentals', 'market-research-fundamentals',
       'Understanding your target market and customers',
       'Market research is crucial for startup success. This article covers various research methods, tools, and strategies to understand your target audience and validate your business idea.',
       6, 'beginner', '["market-research", "customers", "validation"]', 0, 'Mike Chen'),

      (2, 'Financial Planning for Startups', 'financial-planning-startups',
       'Budgeting, forecasting, and financial management',
       'Learn the essentials of financial planning for startups, including budgeting, cash flow management, financial forecasting, and key financial metrics to track.',
       12, 'intermediate', '["finance", "budgeting", "forecasting"]', 1, 'David Rodriguez'),

      (3, 'Creating a Compelling Pitch Deck', 'creating-pitch-deck',
       'Design and deliver an effective investor presentation',
       'A step-by-step guide to creating a pitch deck that captures investor attention. Learn about structure, design principles, and delivery techniques.',
       10, 'intermediate', '["pitch-deck", "investors", "presentation"]', 0, 'Lisa Wang'),

      (4, 'Legal Templates and Checklists', 'legal-templates-checklists',
       'Essential legal documents for startups',
       'Access to important legal templates including NDAs, term sheets, incorporation documents, and other essential legal paperwork for startups.',
       5, 'beginner', '["legal", "templates", "documentation"]', 0, 'Robert Kim');
    `;

    try {
      await db.run(insertCategories);
      await db.run(insertArticles);
      console.log('Learning data populated successfully');
    } catch (error) {
      console.error('Error populating learning data:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run(
        'DELETE FROM learning_articles WHERE category_id IN (SELECT id FROM learning_categories WHERE slug IN ("getting-started", "courses", "tutorials", "resources"))'
      );
      await db.run(
        'DELETE FROM learning_categories WHERE slug IN ("getting-started", "courses", "tutorials", "resources")'
      );
      console.log('Learning data removed successfully');
    } catch (error) {
      console.error('Error removing learning data:', error);
      throw error;
    }
  },
};
