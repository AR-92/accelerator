/**
 * Migration: Create AI_Models table
 * Predefined model templates for AI workflows
 */

module.exports = {
  up: async (db) => {
    const createAIModelsTable = `
      CREATE TABLE IF NOT EXISTS ai_models (
        model_id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_name TEXT NOT NULL UNIQUE,
        description TEXT,
        estimated_credit_cost INTEGER DEFAULT 0,
        output_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert predefined models
    const insertModels = `
      INSERT OR IGNORE INTO ai_models (model_name, description, estimated_credit_cost, output_type) VALUES
      ('Idea Model', 'Generate and refine business ideas', 50, 'idea_document'),
      ('Business Model', 'Create comprehensive business plans', 100, 'business_plan'),
      ('Financial Model', 'Generate financial projections and statements', 75, 'financial_statement'),
      ('Funding Model', 'Create funding strategies and pitch decks', 125, 'pitch_deck'),
      ('Marketing Model', 'Develop marketing strategies and plans', 80, 'marketing_plan'),
      ('Team Model', 'Build team structures and hiring plans', 60, 'team_plan'),
      ('Legal Model', 'Generate legal documents and compliance', 90, 'legal_doc');
    `;

    try {
      await db.run(createAIModelsTable);
      await db.run(insertModels);
      console.log('AI Models table created successfully');
    } catch (error) {
      console.error('Error creating AI Models table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS ai_models');
      console.log('AI Models table dropped successfully');
    } catch (error) {
      console.error('Error dropping AI Models table:', error);
      throw error;
    }
  },
};
