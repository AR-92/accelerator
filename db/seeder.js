import DatabaseService from '../src/services/supabase.js';

const seeder = {
  async populateAllTables() {
    try {
      console.log('Starting database seeding...');

      // Sample data for Accounts
      const accounts = [
        {
          user_id: 501,
          account_type: 'personal',
          display_name: 'John Doe',
          username: 'johndoe501',
          bio: 'Entrepreneur and developer',
          location: 'New York',
          website: 'https://johndoe.com',
          linkedin_url: 'https://linkedin.com/in/johndoe',
          twitter_url: 'https://twitter.com/johndoe',
          github_url: 'https://github.com/johndoe',
          company: 'Tech Startup',
          job_title: 'CEO',
          industry: 'Technology',
          skills: 'JavaScript, Node.js, Entrepreneurship',
          interests: 'AI, Blockchain, Startups',
          is_public: true,
          is_verified: false,
          email_verified: true,
          login_count: 5,
          preferences: { theme: 'dark' },
          timezone: 'America/New_York',
          language: 'en'
        },
        {
          user_id: 502,
          account_type: 'business',
          display_name: 'Jane Smith',
          username: 'janesmith502',
          bio: 'Business strategist',
          location: 'San Francisco',
          website: 'https://janesmith.com',
          linkedin_url: 'https://linkedin.com/in/janesmith',
          company: 'Consulting Inc.',
          job_title: 'Consultant',
          industry: 'Consulting',
          skills: 'Strategy, Marketing',
          interests: 'Innovation, Growth',
          is_public: true,
          is_verified: true,
          email_verified: true,
          login_count: 10,
          preferences: { notifications: true },
          timezone: 'America/Los_Angeles',
          language: 'en'
        }
      ];

      for (const account of accounts) {
        await DatabaseService.create('Accounts', account);
      }
      console.log('✅ Populated Accounts table');

      // Sample data for corporates
      const corporates = [
        {
          user_id: 401,
          name: 'TechCorp Inc.',
          description: 'Leading technology company',
          industry: 'Software',
          founded_date: '2020-01-01',
          website: 'https://techcorp.com',
          status: 'active',
          company_size: 'medium',
          revenue: 5000000,
          location: 'San Francisco',
          headquarters: 'San Francisco',
          employee_count: 150,
          sector: 'Technology'
        }
      ];

      for (const corporate of corporates) {
        await DatabaseService.create('corporates', corporate);
      }
      console.log('✅ Populated corporates table');

      // Sample data for enterprises
      const enterprises = [
        {
          user_id: 302,
          name: 'Enterprise Solutions Ltd.',
          description: 'Enterprise software solutions',
          industry: 'Enterprise Software',
          founded_date: '2015-05-15',
          website: 'https://enterprisesolutions.com',
          status: 'active',
          company_size: 'large',
          revenue: 20000000,
          location: 'London'
        }
      ];

      for (const enterprise of enterprises) {
        await DatabaseService.create('enterprises', enterprise);
      }
      console.log('✅ Populated enterprises table');

      // Sample data for startups
      const startups = [
        {
          user_id: 401,
          name: 'InnovateNow',
          description: 'Revolutionary startup in AI',
          industry: 'AI',
          founded_date: '2023-01-01',
          website: 'https://innovatenow.com',
          status: 'active'
        }
      ];

      for (const startup of startups) {
        await DatabaseService.create('startups', startup);
      }
      console.log('✅ Populated startups table');

      // Sample data for todos
      const todos = [
        { title: 'Complete project setup', description: 'Set up the development environment', completed: false },
        { title: 'Review documentation', description: 'Read through the project docs', completed: true },
        { title: 'Implement user authentication', description: 'Add login/signup functionality', completed: false }
      ];

      for (const todo of todos) {
        await DatabaseService.create('todos', todo);
      }
      console.log('✅ Populated todos table');

      // Sample data for ideas
      const ideas = [
        {
          user_id: 401,
          href: '/ideas/101',
          title: 'AI-Powered Task Manager',
          type: 'product',
          type_icon: '💡',
          rating: 5,
          description: 'An intelligent task management system using AI',
          tags: ['AI', 'Productivity'],
          is_favorite: true,
          upvotes: 10,
          downvotes: 0,
          views: 100,
          status: 'active'
        },
        {
          user_id: 401,
          href: '/ideas/102',
          title: 'Sustainable Energy App',
          type: 'app',
          type_icon: '🌱',
          rating: 4,
          description: 'Track and optimize home energy usage',
          tags: ['Sustainability', 'Mobile'],
          is_favorite: false,
          upvotes: 8,
          downvotes: 1,
          views: 75,
          status: 'active'
        }
      ];

      for (const idea of ideas) {
        await DatabaseService.create('ideas', idea);
      }
      console.log('✅ Populated ideas table');

      // Sample data for projects
      const projects = [
        {
          owner_user_id: 401,
          title: 'Accelerator Platform',
          description: 'A comprehensive startup accelerator platform',
          visibility: 'public'
        },
        {
          owner_user_id: 401,
          title: 'AI Assistant',
          description: 'Building an AI-powered assistant for entrepreneurs',
          visibility: 'private'
        }
      ];

      for (const project of projects) {
        await DatabaseService.create('projects', project);
      }
      console.log('✅ Populated projects table');

      // Sample data for portfolios
      const portfolios = [
        {
          user_id: 401,
          title: 'My Portfolio',
          description: 'Collection of my projects',
          category: 'Web Development',
          tags: ['React', 'Node.js'],
          votes: 5,
          upvotes: 5,
          downvotes: 0,
          is_public: true,
          image: 'https://example.com/image.jpg',
          demo_url: 'https://demo.com',
          source_url: 'https://github.com/user/repo'
        }
      ];

      for (const portfolio of portfolios) {
        await DatabaseService.create('portfolios', portfolio);
      }
      console.log('✅ Populated portfolios table');

      // Sample data for tasks (assuming project id 1 exists)
      const tasks = [
        {
          project_id: 1,
          title: 'Design UI',
          description: 'Create user interface designs',
          assignee_user_id: 401,
          status: 'todo'
        },
        {
          project_id: 1,
          title: 'Implement Backend',
          description: 'Build the server-side logic',
          assignee_user_id: 302,
          status: 'in_progress'
        }
      ];

      for (const task of tasks) {
        await DatabaseService.create('tasks', task);
      }
      console.log('✅ Populated tasks table');

      // Sample data for learning_categories
      const learningCategories = [
        {
          name: 'Programming',
          slug: 'programming-new',
          description: 'Learn programming languages and concepts',
          icon: '💻',
          color: '#007bff',
          sort_order: 1,
          category_type: 'general',
          is_active: true,
          is_featured: true,
          estimated_total_duration: 100,
          content_count: 10,
          total_views: 1000,
          total_completions: 100,
          average_engagement: 0.8,
          default_sorting: 'newest',
          allow_user_contributions: false,
          require_moderation: true,
          access_level: 'public',
          target_audience: ['beginners', 'developers'],
          learning_outcomes: ['Write code', 'Debug programs']
        }
      ];

      for (const category of learningCategories) {
        await DatabaseService.create('learning_categories', category);
      }
      console.log('✅ Populated learning_categories table');

      // Sample data for learning_content
      const learningContent = [
        {
          content_type: 'article',
          category_id: 1,
          title: 'Introduction to JavaScript',
          slug: 'intro-javascript',
          excerpt: 'Learn the basics of JavaScript',
          content: 'JavaScript is a programming language...',
          difficulty_level: 'beginner',
          estimated_duration_minutes: 30,
          learning_objectives: ['Understand variables', 'Write functions'],
          author_name: 'John Doe',
          status: 'published',
          is_featured: true,
          view_count: 500,
          like_count: 50,
          completion_count: 200,
          average_rating: 4.5,
          rating_count: 100,
          published_at: new Date().toISOString()
        }
      ];

      for (const content of learningContent) {
        await DatabaseService.create('learning_content', content);
      }
      console.log('✅ Populated learning_content table');

      // Sample data for learning_assessments
      const learningAssessments = [
        {
          content_id: 1,
          title: 'JavaScript Basics Quiz',
          description: 'Test your knowledge of JavaScript basics',
          assessment_type: 'quiz',
          passing_score: 70,
          time_limit_minutes: 15,
          max_attempts: 3,
          randomize_questions: false,
          show_correct_answers: true,
          allow_review: true,
          questions: [{ question: 'What is a variable?', options: ['A container for data', 'A function'], correct: 0 }],
          total_points: 10,
          difficulty_level: 'beginner',
          estimated_duration_minutes: 15,
          auto_grade: true,
          instant_feedback: true,
          is_active: true,
          is_required: false
        }
      ];

      for (const assessment of learningAssessments) {
        await DatabaseService.create('learning_assessments', assessment);
      }
      console.log('✅ Populated learning_assessments table');

      // Sample data for learning_paths
      const learningPaths = [
        {
          title: 'Full Stack Development',
          slug: 'full-stack-dev',
          description: 'Learn to build full stack applications',
          path_type: 'skill',
          target_audience: ['developers'],
          content_modules: [{ id: 1, title: 'Frontend Basics' }],
          total_duration_minutes: 200,
          learning_objectives: ['Build web apps'],
          skills_gained: ['React', 'Node.js'],
          is_featured: true,
          certificate_earned: true,
          enrolled_users: 50,
          completed_users: 20,
          success_rate: 0.4
        }
      ];

      for (const path of learningPaths) {
        await DatabaseService.create('learning_paths', path);
      }
      console.log('✅ Populated learning_paths table');

      // Sample data for user_learning_progress
      const userLearningProgress = [
        {
          user_id: 401,
          content_id: 1,
          progress_percentage: 50,
          time_spent_seconds: 1800,
          is_completed: false,
          session_count: 2,
          average_session_duration: 900,
          first_access_date: new Date().toISOString(),
          last_access_date: new Date().toISOString()
        }
      ];

      for (const progress of userLearningProgress) {
        await DatabaseService.create('user_learning_progress', progress);
      }
      console.log('✅ Populated user_learning_progress table');

      // Sample data for user_learning_path_progress
      const userLearningPathProgress = [
        {
          user_id: 401,
          learning_path_id: 1,
          current_module_index: 0,
          completed_modules: 1,
          total_modules: 5,
          progress_percentage: 20,
          enrolled_at: new Date().toISOString(),
          last_access_date: new Date().toISOString()
        }
      ];

      for (const pathProgress of userLearningPathProgress) {
        await DatabaseService.create('user_learning_path_progress', pathProgress);
      }
      console.log('✅ Populated user_learning_path_progress table');

      // Sample data for user_assessment_attempts
      const userAssessmentAttempts = [
        {
          user_id: 401,
          assessment_id: 1,
          attempt_number: 1,
          answers: { q1: 'A container for data' },
          score: 8,
          is_passed: true,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          time_taken_seconds: 600
        }
      ];

      for (const attempt of userAssessmentAttempts) {
        await DatabaseService.create('user_assessment_attempts', attempt);
      }
      console.log('✅ Populated user_assessment_attempts table');

      // Sample data for learning_analytics
      const learningAnalytics = [
        {
          user_id: 401,
          content_id: 1,
          category_id: 1,
          event_type: 'view',
          event_data: { duration: 300 },
          session_duration_seconds: 300,
          time_on_page_seconds: 300,
          country: 'US',
          city: 'New York',
          engagement_score: 0.8,
          page_load_time_ms: 500,
          is_processed: true
        }
      ];

      for (const analytic of learningAnalytics) {
        await DatabaseService.create('learning_analytics', analytic);
      }
      console.log('✅ Populated learning_analytics table');

      // Sample data for Business Model
      const businessModels = [
        {
          user_id: 401,
          session_id: 'session1',
          status: 'draft',
          current_section: 1,
          overall_progress: 0.1,
          core_function: 'To provide AI solutions',
          key_activities: 'Development, Marketing',
          key_resources: 'Team, Technology',
          key_partners: 'Investors',
          market_category: 'B2B',
          target_market: 'Tech companies',
          target_geographic_area: 'Global',
          tam_estimate: '1B',
          sam_estimate: '100M',
          som_estimate: '10M',
          key_competitors: 'Company A, Company B',
          competition_level: 'high',
          customer_job: 'Solve problems',
          customer_pains: 'Inefficiency',
          customer_gains: 'Efficiency',
          solution_components: 'AI engine',
          cost_structure: { development: 100000 },
          revenue_streams: { subscription: 50000 },
          monthly_costs_cents: 100000,
          monthly_revenue_cents: 50000,
          name: 'AI Startup',
          description: 'AI solutions for businesses',
          business_type: 'SaaS',
          industry: 'AI',
          tags: 'AI, SaaS',
          is_public: false,
          validation_score: 50
        }
      ];

      for (const model of businessModels) {
        await DatabaseService.create('Business Model', model);
      }
      console.log('✅ Populated Business Model table');

      // Sample data for Business Plan
      const businessPlans = [
        {
          user_id: 401,
          status: 'draft',
          version: '1.0',
          company_name: 'AI Startup Inc.',
          company_description: 'Providing AI solutions',
          founded_date: '2023-01-01',
          location: 'New York',
          legal_structure: 'LLC',
          current_stage: 'Seed',
          mission_statement: 'To innovate with AI',
          vision_statement: 'AI for everyone',
          executive_summary: 'Summary...',
          projected_revenue_year3: 1000000,
          market_share_target: 0.05,
          funding_required: 500000,
          industry_overview: 'AI is growing',
          market_size_current: 1000000000,
          market_size_projected: 2000000000,
          market_cagr: 0.2,
          tam_estimate: 1000000000,
          sam_estimate: 100000000,
          som_estimate: 10000000,
          market_trends: { trend: 'Increasing adoption' },
          competitor_analysis: { competitors: ['A', 'B'] },
          competitive_landscape: 'Competitive',
          core_product_offering: 'AI Platform',
          unique_value_proposition: 'Easy to use',
          product_roadmap: { phase1: 'MVP' },
          marketing_strategy: { channels: ['Online'] },
          sales_strategy: { direct: true },
          customer_acquisition_channels: ['Website'],
          technology_infrastructure: 'Cloud',
          supply_chain_logistics: 'N/A',
          operational_metrics: { metric: 'Users' },
          management_team: { ceo: 'John' },
          advisory_board: { advisor: 'Jane' },
          revenue_projections: { year1: 100000 },
          expense_breakdown: { salaries: 200000 },
          key_financial_metrics: { margin: 0.3 },
          customer_acquisition_cost: 100,
          lifetime_value: 1000,
          payback_period_months: 12,
          ebitda_year3: 500000,
          use_of_funds: { product: 300000 },
          funding_strategy: { equity: true },
          investment_highlights: 'High growth',
          total_funding_sought: 500000,
          industry: 'AI',
          tags: 'AI',
          is_public: false,
          is_featured: false
        }
      ];

      for (const plan of businessPlans) {
        await DatabaseService.create('Business Plan', plan);
      }
      console.log('✅ Populated Business Plan table');

      // Sample data for Financial Model
      const financialModels = [
        {
          user_id: 401,
          model_name: 'Financial Model',
          model_description: 'Startup financials',
          model_status: 'draft',
          progress_percentage: 10,
          current_section: 1,
          monthly_revenue: 10000,
          growth_period: '3 years',
          revenue_stage: 'early',
          revenue_assumptions_completed: false,
          revenue_streams: { subscription: 10000 },
          monthly_cogs: 3000,
          cogs_breakdown: { hosting: 1000 },
          opex_data: { salaries: 5000 },
          total_monthly_opex: 5000,
          total_capex: 10000,
          capex_description: 'Equipment',
          amortization_years: 5,
          statement_format: 'standard',
          output_format: 'excel',
          investor_capital: 500000,
          income_statement: { revenue: 10000 },
          cash_flow_statement: { operating: 5000 },
          balance_sheet: { assets: 100000 },
          model_completed: false
        }
      ];

      for (const model of financialModels) {
        await DatabaseService.create('Financial Model', model);
      }
      console.log('✅ Populated Financial Model table');

      // Sample data for Funding
      const fundings = [
        {
          total_funding_required: 500000,
          funding_type: ['equity'],
          funding_stage: 'seed',
          use_of_funds: { product: 300000 },
          revenue_model: { subscription: true },
          market_size: { tam: 1000000000 },
          burn_rate: 20000,
          runway: 24
        }
      ];

      for (const funding of fundings) {
        await DatabaseService.create('Funding', funding);
      }
      console.log('✅ Populated Funding table');

      // Sample data for Legal
      const legals = [
        {
          company_name: 'AI Startup Inc.',
          company_type: 'LLC',
          commercial_registration: '12345',
          incorporation_date: '2023-01-01',
          registered_address: '123 Main St',
          tax_id: 'TAX123',
          shareholders: [{ name: 'John', share: 50 }],
          directors: [{ name: 'John' }],
          compliance_status: 'compliant',
          regulatory_approvals: ['None']
        }
      ];

      for (const legal of legals) {
        await DatabaseService.create('Legal', legal);
      }
      console.log('✅ Populated Legal table');

      // Sample data for Marketing
      const marketings = [
        {
          target_audience: { age: '25-35' },
          unique_value_proposition: 'Easy AI',
          marketing_objectives: ['Acquire users'],
          marketing_channels: ['Social Media'],
          marketing_budget: 50000,
          content_strategy: { blog: true },
          brand_guidelines: { colors: '#000' },
          competitor_analysis: { competitors: ['A'] },
          market_research: { surveys: true }
        }
      ];

      for (const marketing of marketings) {
        await DatabaseService.create('Marketing', marketing);
      }
      console.log('✅ Populated Marketing table');

      // Sample data for PitchDeck
      const pitchDecks = [
        {
          title_slide: { title: 'AI Startup', subtitle: 'Revolutionizing AI' },
          problem_statement: 'Problem...',
          solution_overview: 'Solution...',
          market_opportunity: { size: 1000000000 },
          product_demo: 'Demo link',
          business_model: { subscription: true },
          traction_metrics: { users: 100 },
          competitive_advantage: 'Unique tech',
          team_overview: { members: ['John'] },
          financial_projections: { revenue: 100000 },
          funding_ask: { amount: 500000 },
          contact_info: { email: 'john@ai.com' }
        }
      ];

      for (const deck of pitchDecks) {
        await DatabaseService.create('PitchDeck', deck);
      }
      console.log('✅ Populated PitchDeck table');

      // Sample data for Team
      const teams = [
        {
          founders_count: 2,
          employees_count: 5,
          team_structure: 'Flat',
          readiness_score: 8,
          work_mode: 'remote',
          roles: { ceo: 'John', cto: 'Jane' },
          skills_matrix: { tech: 9 },
          hiring_plan: { next: 'Developer' },
          compensation_structure: { salary: 100000 },
          performance_metrics: { kpi: 'Growth' },
          development_plan: { training: true }
        }
      ];

      for (const team of teams) {
        await DatabaseService.create('Team', team);
      }
      console.log('✅ Populated Team table');

      // Sample data for Valuation
      const valuations = [
        {
          valuation_date: '2023-01-01',
          valuation_method: 'dcf',
          enterprise_value: { value: 1000000 },
          equity_value: { value: 800000 },
          per_share_value: 10,
          key_assumptions: ['Growth 20%'],
          comparable_companies: [{ name: 'Comp A', value: 2000000 }],
          precedent_transactions: [{ deal: 'Deal A' }],
          dcf_projections: { year1: 200000 },
          sensitivity_analysis: { scenario: 'Base' },
          risk_factors: ['Market risk']
        }
      ];

      for (const valuation of valuations) {
        await DatabaseService.create('Valuation', valuation);
      }
      console.log('✅ Populated Valuation table');

      // Sample data for Activity Logs
      const activityLogs = [
        {
          user_id: 401,
          session_id: 'session1',
          activity_type: 'login',
          action: 'login',
          description: 'User logged in',
          ip_address: '192.168.1.1',
          user_agent: 'Chrome',
          browser: 'Chrome',
          os: 'Windows',
          device: 'Desktop',
          location_country: 'US',
          location_city: 'New York',
          status: 'success',
          duration_ms: 100,
          request_method: 'POST',
          request_url: '/login',
          response_status: 200,
          severity: 'info',
          tags: 'auth'
        }
      ];

      for (const log of activityLogs) {
        await DatabaseService.create('Activity Logs', log);
      }
      console.log('✅ Populated Activity Logs table');

      // Sample data for Billing
      const billings = [
        {
          user_id: 401,
          invoice_number: 'INV001',
          billing_type: 'subscription',
          amount_cents: 10000,
          currency: 'USD',
          status: 'paid',
          description: 'Monthly subscription',
          due_date: '2023-02-01',
          paid_at: '2023-01-15',
          payment_method: 'card',
          provider: 'stripe',
          total_amount_cents: 10000,
          billing_period_start: '2023-01-01',
          billing_period_end: '2023-01-31',
          subscription_id: 'sub_123',
          plan_name: 'Pro',
          credits_purchased: 100,
          notes: 'Paid on time'
        }
      ];

      for (const billing of billings) {
        await DatabaseService.create('Billing', billing);
      }
      console.log('✅ Populated Billing table');

      // Sample data for Credits
      const credits = [
        {
          user_id: 401,
          transaction_id: 1,
          credit_type: 'purchased',
          amount: 100,
          balance_after: 100,
          description: 'Purchased credits',
          expires_at: '2024-01-01'
        }
      ];

      for (const credit of credits) {
        await DatabaseService.create('Credits', credit);
      }
      console.log('✅ Populated Credits table');

      // Sample data for notifications
      const notifications = [
        {
          user_id: 401,
          type: 'info',
          title: 'Welcome',
          message: 'Welcome to the platform',
          action_url: '/dashboard',
          action_text: 'Go to Dashboard',
          is_read: false,
          priority: 'normal',
          expires_at: '2023-02-01'
        }
      ];

      for (const notification of notifications) {
        await DatabaseService.create('notifications', notification);
      }
      console.log('✅ Populated notifications table');

      // Sample data for rewards
      const rewards = [
        {
          user_id: 401,
          type: 'achievement',
          title: 'First Login',
          description: 'Logged in for the first time',
          credits: 10,
          status: 'active',
          earned_at: new Date().toISOString()
        }
      ];

      for (const reward of rewards) {
        await DatabaseService.create('rewards', reward);
      }
      console.log('✅ Populated rewards table');

      // Sample data for user_settings
      const userSettings = [
        {
          user_id: 401,
          category: 'general',
          setting_key: 'theme',
          setting_value: 'dark',
          setting_type: 'string',
          is_public: false
        }
      ];

      for (const setting of userSettings) {
        await DatabaseService.create('user_settings', setting);
      }
      console.log('✅ Populated user_settings table');

      // Sample data for Calendar
      const calendars = [
        {
          user_id: 401,
          title: 'Team Meeting',
          description: 'Weekly team sync',
          event_type: 'meeting',
          start_time: '2023-01-15T10:00:00Z',
          end_time: '2023-01-15T11:00:00Z',
          all_day: false,
          location: 'Conference Room',
          is_virtual: false,
          organizer_id: 1,
          participants: [{ id: 2, name: 'Jane' }],
          max_participants: 10,
          is_private: false,
          category: 'work',
          priority: 'medium',
          status: 'scheduled',
          reminder_minutes: 15,
          email_reminder: true,
          push_notification: true,
          project_id: 1
        }
      ];

      for (const calendar of calendars) {
        await DatabaseService.create('Calendar', calendar);
      }
      console.log('✅ Populated Calendar table');

      // Sample data for Help Center
      const helpCenters = [
        {
          user_id: 401,
          content_type: 'article',
          category_name: 'Getting Started',
          category_slug: 'getting-started',
          title: 'How to Login',
          slug: 'how-to-login',
          excerpt: 'Learn how to log in to the platform',
          content: 'Step 1: Go to the login page...',
          content_format: 'markdown',
          meta_title: 'Login Guide',
          meta_description: 'A guide to logging in',
          featured_image: 'login.jpg',
          sort_order: 1,
          is_featured: true,
          is_published: true,
          view_count: 100,
          helpful_count: 10,
          difficulty_level: 'beginner',
          read_time_minutes: 2,
          language: 'en',
          status: 'published',
          published_at: new Date().toISOString()
        }
      ];

      for (const help of helpCenters) {
        await DatabaseService.create('Help Center', help);
      }
      console.log('✅ Populated Help Center table');

      // Sample data for collaborations
      const collaborations = [
        {
          project_id: 1,
          collaborator_user_id: 302,
          role: 'editor',
          status: 'accepted'
        }
      ];

      for (const collab of collaborations) {
        await DatabaseService.create('collaborations', collab);
      }
      console.log('✅ Populated collaborations table');

      // Sample data for landing_pages
      const landingPages = [
        {
          section_type: 'hero',
          title: 'Welcome to Accelerator',
          subtitle: 'Build your startup',
          content: 'Accelerate your business with our tools',
          button_text: 'Get Started',
          button_url: '/signup',
          sort_order: 1,
          is_active: true
        }
      ];

      for (const page of landingPages) {
        await DatabaseService.create('landing_pages', page);
      }
      console.log('✅ Populated landing_pages table');

      // Sample data for messages
      const messages = [
        {
          project_id: 1,
          user_id: 401,
          body: 'Hello team, let\'s discuss the project!'
        }
      ];

      for (const message of messages) {
        await DatabaseService.create('messages', message);
      }
      console.log('✅ Populated messages table');

      // Sample data for project_collaborators
      const projectCollaborators = [
        {
          project_id: 1,
          user_id: 302,
          role: 'member'
        }
      ];

      for (const collab of projectCollaborators) {
        await DatabaseService.create('project_collaborators', collab);
      }
      console.log('✅ Populated project_collaborators table');

      // Sample data for Idea
      const businessIdeas = [
        {
          title: 'AI-Powered Task Manager',
          description: 'An intelligent task management system using AI',
          category: 'Productivity',
          tags: ['AI', 'Productivity'],
          problem_statement: 'People struggle with task management',
          solution_overview: 'AI helps prioritize tasks',
          target_market: { size: 1000000 },
          competitive_advantage: 'AI integration',
          business_model: 'SaaS',
          traction: { users: 100 }
        }
      ];

      for (const idea of businessIdeas) {
        await DatabaseService.create('Idea', idea);
      }
      console.log('✅ Populated Idea table');

      // Sample data for Landing Page Management
      const landingPageManagement = [
        {
          page_name: 'Home Page',
          template: 'hero',
          content: { title: 'Welcome', subtitle: 'Build your startup' },
          is_active: true,
          version: 1
        }
      ];

      for (const page of landingPageManagement) {
        await DatabaseService.create('Landing Page Management', page);
      }
      console.log('✅ Populated Landing Page Management table');

      // Sample data for Corporate
      const corporateData = [
        {
          user_id: 401,
          name: 'TechCorp Inc.',
          description: 'Leading technology company',
          industry: 'Software',
          founded_date: '2020-01-01',
          website: 'https://techcorp.com',
          status: 'active',
          company_size: 'medium',
          revenue: 5000000,
          location: 'San Francisco',
          headquarters: 'San Francisco',
          employee_count: 150,
          sector: 'Technology'
        }
      ];

      for (const corporate of corporateData) {
        await DatabaseService.create('Corporate', corporate);
      }
      console.log('✅ Populated Corporate table');

      // Sample data for Enterprises
      const enterpriseRecords = [
        {
          user_id: 302,
          name: 'Enterprise Solutions Ltd.',
          description: 'Enterprise software solutions',
          industry: 'Enterprise Software',
          founded_date: '2015-05-15',
          website: 'https://enterprisesolutions.com',
          status: 'active',
          company_size: 'large',
          revenue: 20000000,
          location: 'London'
        }
      ];

      for (const enterprise of enterpriseRecords) {
        await DatabaseService.create('Enterprises', enterprise);
      }
      console.log('✅ Populated Enterprises table');

      // Sample data for Votes Management
      const votesManagement = [
        {
          user_id: 401,
          entity_type: 'idea',
          entity_id: 1,
          vote_type: 'upvote',
          weight: 1
        }
      ];

      for (const vote of votesManagement) {
        await DatabaseService.create('Votes Management', vote);
      }
      console.log('✅ Populated Votes Management table');

      console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seeder.populateAllTables().catch(console.error);
}

export default seeder;