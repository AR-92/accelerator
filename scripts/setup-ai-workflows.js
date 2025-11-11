/**
 * Complete AI workflow setup script
 * Creates all AI tables and populates data
 */

const { db, dbRun } = require('../config/database');

async function setupAIWorkflows() {
  try {
    console.log('Setting up AI workflows...');

    // Create AI Workflows table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS ai_workflows (
        workflow_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        model_id INTEGER NOT NULL,
        status TEXT DEFAULT 'queued',
        initiated_by INTEGER NOT NULL,
        credit_cost_actual INTEGER DEFAULT 0,
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (model_id) REFERENCES ai_models(model_id) ON DELETE CASCADE,
        FOREIGN KEY (initiated_by) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create Workflow Steps table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS workflow_steps (
        step_id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id INTEGER NOT NULL,
        step_number INTEGER NOT NULL,
        step_name TEXT NOT NULL,
        step_description TEXT,
        ai_prompt_template TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (model_id) REFERENCES ai_models(model_id) ON DELETE CASCADE,
        UNIQUE (model_id, step_number)
      );
    `);

    // Create Workflow Executions table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS workflow_executions (
        execution_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL,
        input_data TEXT,
        output_data TEXT,
        status TEXT DEFAULT 'pending',
        executed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE CASCADE,
        FOREIGN KEY (step_id) REFERENCES workflow_steps(step_id) ON DELETE CASCADE
      );
    `);

    // Create Workflow Inputs table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS workflow_inputs (
        input_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id INTEGER NOT NULL,
        source_type TEXT NOT NULL,
        source_id INTEGER,
        input_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE CASCADE
      );
    `);

    // Create Workflow Outputs table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS workflow_outputs (
        output_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id INTEGER NOT NULL,
        output_type TEXT NOT NULL,
        file_id INTEGER,
        output_data TEXT,
        version INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE CASCADE,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
      );
    `);

    // Create Workflow Feedback table
    await runQuery(`
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
    `);

    // Populate workflow steps
    const workflowSteps = [
      // Idea Model
      {
        model_name: 'Idea Model',
        step_number: 1,
        step_name: 'Market Research',
        step_description: 'Analyze market trends and opportunities',
        ai_prompt_template:
          'Based on the following project idea: {project_description}, conduct market research and identify key trends, target audience, and market opportunities.',
      },
      {
        model_name: 'Idea Model',
        step_number: 2,
        step_name: 'Idea Validation',
        step_description: 'Validate the business idea feasibility',
        ai_prompt_template:
          'Validate this business idea: {project_description}. Assess technical feasibility, market demand, and competitive landscape.',
      },
      {
        model_name: 'Idea Model',
        step_number: 3,
        step_name: 'Value Proposition',
        step_description: 'Define the unique value proposition',
        ai_prompt_template:
          'Create a compelling value proposition for: {project_description}. What makes this solution unique and valuable to customers?',
      },

      // Business Model
      {
        model_name: 'Business Model',
        step_number: 1,
        step_name: 'Executive Summary',
        step_description: 'Create executive summary for the business plan',
        ai_prompt_template:
          'Write an executive summary for a business plan based on: {project_description}. Include company overview, mission, and key objectives.',
      },
      {
        model_name: 'Business Model',
        step_number: 2,
        step_name: 'Market Analysis',
        step_description: 'Analyze target market and competition',
        ai_prompt_template:
          'Conduct a comprehensive market analysis for: {project_description}. Include market size, target segments, and competitive analysis.',
      },
      {
        model_name: 'Business Model',
        step_number: 3,
        step_name: 'Revenue Model',
        step_description: 'Define revenue streams and pricing strategy',
        ai_prompt_template:
          'Design a revenue model for: {project_description}. Include pricing strategy, revenue streams, and financial projections.',
      },
      {
        model_name: 'Business Model',
        step_number: 4,
        step_name: 'Operations Plan',
        step_description: 'Outline operational requirements and processes',
        ai_prompt_template:
          'Create an operations plan for: {project_description}. Include key processes, resources needed, and operational milestones.',
      },

      // Financial Model
      {
        model_name: 'Financial Model',
        step_number: 1,
        step_name: 'Startup Costs',
        step_description: 'Calculate initial startup costs',
        ai_prompt_template:
          'Estimate startup costs for: {project_description}. Include one-time expenses, initial inventory, and setup costs.',
      },
      {
        model_name: 'Financial Model',
        step_number: 2,
        step_name: 'Revenue Projections',
        step_description: 'Project revenue for 3-5 years',
        ai_prompt_template:
          'Create 5-year revenue projections for: {project_description}. Include conservative, moderate, and optimistic scenarios.',
      },
      {
        model_name: 'Financial Model',
        step_number: 3,
        step_name: 'Expense Analysis',
        step_description: 'Analyze ongoing expenses and cost structure',
        ai_prompt_template:
          'Analyze operating expenses for: {project_description}. Categorize fixed vs variable costs and create expense projections.',
      },
      {
        model_name: 'Financial Model',
        step_number: 4,
        step_name: 'Cash Flow Statement',
        step_description: 'Create cash flow projections',
        ai_prompt_template:
          'Generate a cash flow statement for: {project_description}. Include monthly projections for the first year and annual for years 2-5.',
      },

      // Funding Model
      {
        model_name: 'Funding Model',
        step_number: 1,
        step_name: 'Funding Requirements',
        step_description: 'Determine funding needs and use of funds',
        ai_prompt_template:
          'Calculate funding requirements for: {project_description}. Specify how much capital is needed and how it will be used.',
      },
      {
        model_name: 'Funding Model',
        step_number: 2,
        step_name: 'Investor Pitch',
        step_description: 'Create investor presentation content',
        ai_prompt_template:
          'Write an investor pitch for: {project_description}. Include problem, solution, market opportunity, and ask.',
      },
      {
        model_name: 'Funding Model',
        step_number: 3,
        step_name: 'Funding Strategy',
        step_description: 'Develop comprehensive funding strategy',
        ai_prompt_template:
          'Create a funding strategy for: {project_description}. Include bootstrapping, angel investment, venture capital, and crowdfunding options.',
      },

      // Marketing Model
      {
        model_name: 'Marketing Model',
        step_number: 1,
        step_name: 'Brand Identity',
        step_description: 'Define brand positioning and messaging',
        ai_prompt_template:
          'Develop brand identity for: {project_description}. Include brand values, positioning, and key messaging.',
      },
      {
        model_name: 'Marketing Model',
        step_number: 2,
        step_name: 'Marketing Channels',
        step_description: 'Identify effective marketing channels',
        ai_prompt_template:
          'Recommend marketing channels for: {project_description}. Include digital marketing, content marketing, and traditional channels.',
      },
      {
        model_name: 'Marketing Model',
        step_number: 3,
        step_name: 'Content Strategy',
        step_description: 'Create content marketing strategy',
        ai_prompt_template:
          'Develop a content marketing strategy for: {project_description}. Include content types, publishing schedule, and distribution channels.',
      },

      // Team Model
      {
        model_name: 'Team Model',
        step_number: 1,
        step_name: 'Core Team Assessment',
        step_description: 'Evaluate current team capabilities',
        ai_prompt_template:
          'Assess the current team for: {project_description}. Identify strengths, gaps, and additional roles needed.',
      },
      {
        model_name: 'Team Model',
        step_number: 2,
        step_name: 'Hiring Plan',
        step_description: 'Create hiring strategy and timeline',
        ai_prompt_template:
          'Develop a hiring plan for: {project_description}. Include key positions, hiring timeline, and recruitment strategy.',
      },
      {
        model_name: 'Team Model',
        step_number: 3,
        step_name: 'Organization Structure',
        step_description: 'Design organizational structure',
        ai_prompt_template:
          'Design an organizational structure for: {project_description}. Include reporting relationships and team composition.',
      },

      // Legal Model
      {
        model_name: 'Legal Model',
        step_number: 1,
        step_name: 'Business Structure',
        step_description: 'Recommend legal business structure',
        ai_prompt_template:
          'Recommend a legal business structure for: {project_description}. Consider liability, taxation, and growth potential.',
      },
      {
        model_name: 'Legal Model',
        step_number: 2,
        step_name: 'Intellectual Property',
        step_description: 'Identify IP assets and protection needs',
        ai_prompt_template:
          'Identify intellectual property for: {project_description}. Include trademarks, patents, copyrights, and protection strategies.',
      },
      {
        model_name: 'Legal Model',
        step_number: 3,
        step_name: 'Compliance Requirements',
        step_description: 'Outline regulatory compliance needs',
        ai_prompt_template:
          'Outline compliance requirements for: {project_description}. Include industry regulations, licenses, and legal obligations.',
      },
    ];

    for (const step of workflowSteps) {
      await runQuery(
        `
        INSERT INTO workflow_steps (model_id, step_number, step_name, step_description, ai_prompt_template)
        SELECT model_id, ?, ?, ?, ? FROM ai_models WHERE model_name = ?
      `,
        [
          step.step_number,
          step.step_name,
          step.step_description,
          step.ai_prompt_template,
          step.model_name,
        ]
      );
    }

    console.log('✅ AI workflow setup completed successfully!');
    console.log('Created 7 AI models with 22 total workflow steps.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to setup AI workflows:', error);
    process.exit(1);
  }
}

// Use dbRun from config
const runQuery = dbRun;

setupAIWorkflows();
