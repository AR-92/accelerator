/**
 * Migration: Create Workflow_Feedback table
 * User reviews and feedback on AI-generated content
 */

module.exports = {
  up: async (db) => {
    const createWorkflowFeedbackTable = `
      CREATE TABLE IF NOT EXISTS workflow_feedback (
        feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        feedback_text TEXT,
        section_name TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_workflow_feedback_workflow ON workflow_feedback(workflow_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_feedback_user ON workflow_feedback(user_id);
    `;

    try {
      await db.run(createWorkflowFeedbackTable);
      await db.run(createIndexes);
      console.log('Workflow Feedback table created successfully');
    } catch (error) {
      console.error('Error creating Workflow Feedback table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF NOT EXISTS idx_workflow_feedback_user');
      await db.run('DROP INDEX IF NOT EXISTS idx_workflow_feedback_workflow');
      await db.run('DROP TABLE IF EXISTS workflow_feedback');
      console.log('Workflow Feedback table dropped successfully');
    } catch (error) {
      console.error('Error dropping Workflow Feedback table:', error);
      throw error;
    }
  },
};
