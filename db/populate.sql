-- Populate all tables with sample data
-- Run this in your Supabase SQL Editor or PostgreSQL client

-- Accounts
INSERT INTO "Accounts" (user_id, account_type, display_name, username, bio, location, website, linkedin_url, twitter_url, github_url, company, job_title, industry, skills, interests, is_public, is_verified, email_verified, login_count, preferences, timezone, language, created_at, updated_at) VALUES
(1, 'personal', 'John Doe', 'johndoe', 'Entrepreneur and developer', 'New York', 'https://johndoe.com', 'https://linkedin.com/in/johndoe', 'https://twitter.com/johndoe', 'https://github.com/johndoe', 'Tech Startup', 'CEO', 'Technology', 'JavaScript, Node.js, Entrepreneurship', 'AI, Blockchain, Startups', true, false, true, 5, '{"theme": "dark"}'::jsonb, 'America/New_York', 'en', NOW(), NOW()),
(2, 'business', 'Jane Smith', 'janesmith', 'Business strategist', 'San Francisco', 'https://janesmith.com', 'https://linkedin.com/in/janesmith', NULL, NULL, 'Consulting Inc.', 'Consultant', 'Consulting', 'Strategy, Marketing', 'Innovation, Growth', true, true, true, 10, '{"notifications": true}'::jsonb, 'America/Los_Angeles', 'en', NOW(), NOW());

-- corporates
INSERT INTO corporates (user_id, name, description, industry, founded_date, website, status, revenue, location, headquarters, employee_count, sector) VALUES
(1, 'TechCorp Inc.', 'Leading technology company', 'Software', '2020-01-01', 'https://techcorp.com', 'active', 5000000, 'San Francisco', 'San Francisco', 150, 'Technology');

-- enterprises
INSERT INTO enterprises (user_id, name, description, industry, founded_date, website, status, revenue, location) VALUES
(2, 'Enterprise Solutions Ltd.', 'Enterprise software solutions', 'Enterprise Software', '2015-05-15', 'https://enterprisesolutions.com', 'active', 20000000, 'London');

-- startups
INSERT INTO startups (user_id, name, description, industry, founded_date, website, status) VALUES
(1, 'InnovateNow', 'Revolutionary startup in AI', 'AI', '2023-01-01', 'https://innovatenow.com', 'active');

-- todos
INSERT INTO todos (title, description, completed, created_at, updated_at) VALUES
('Complete project setup', 'Set up the development environment', false, NOW(), NOW()),
('Review documentation', 'Read through the project docs', true, NOW(), NOW()),
('Implement user authentication', 'Add login/signup functionality', false, NOW(), NOW());

-- ideas
INSERT INTO ideas (user_id, href, title, type, type_icon, rating, description, tags, is_favorite, upvotes, downvotes, views, status, created_at, updated_at) VALUES
(1, '/ideas/1', 'AI-Powered Task Manager', 'product', '💡', 5, 'An intelligent task management system using AI', '["AI", "Productivity"]'::jsonb, true, 10, 0, 100, 'active', CURRENT_TIMESTAMP, NULL),
(1, '/ideas/2', 'Sustainable Energy App', 'app', '🌱', 4, 'Track and optimize home energy usage', '["Sustainability", "Mobile"]'::jsonb, false, 8, 1, 75, 'active', CURRENT_TIMESTAMP, NULL);

-- projects
INSERT INTO projects (owner_user_id, title, description, visibility, created_at, updated_at) VALUES
(1, 'Accelerator Platform', 'A comprehensive startup accelerator platform', 'public', NOW(), NULL),
(1, 'AI Assistant', 'Building an AI-powered assistant for entrepreneurs', 'private', NOW(), NULL);

-- portfolios
INSERT INTO portfolios (user_id, title, description, category, tags, votes, upvotes, downvotes, is_public, image, demo_url, source_url, created_date, updated_date) VALUES
(1, 'My Portfolio', 'Collection of my projects', 'Web Development', '["React", "Node.js"]'::jsonb, 5, 5, 0, true, 'https://example.com/image.jpg', 'https://demo.com', 'https://github.com/user/repo', CURRENT_TIMESTAMP, NULL);

-- tasks
INSERT INTO tasks (project_id, title, description, assignee_user_id, status, created_at, updated_at) VALUES
(1, 'Design UI', 'Create user interface designs', 1, 'todo', NOW(), NULL),
(1, 'Implement Backend', 'Build the server-side logic', 2, 'in_progress', NOW(), NULL);

-- learning_categories
INSERT INTO learning_categories (name, slug, description, icon, color, sort_order, category_type, is_active, is_featured, estimated_total_duration, content_count, total_views, total_completions, average_engagement, default_sorting, allow_user_contributions, require_moderation, access_level, target_audience, learning_outcomes, created_at, updated_at, deleted_at) VALUES
('Programming', 'programming', 'Learn programming languages and concepts', '💻', '#007bff', 1, 'general', true, true, 100, 10, 1000, 100, 0.8, 'newest', false, true, 'public', ARRAY['beginners', 'developers'], ARRAY['Write code', 'Debug programs'], NOW(), NOW(), NULL);

-- learning_content
INSERT INTO learning_content (content_type, category_id, title, slug, excerpt, content, difficulty_level, estimated_duration_minutes, prerequisites, learning_objectives, author_name, status, is_featured, view_count, like_count, completion_count, average_rating, rating_count, published_at, created_at, updated_at, deleted_at) VALUES
('article', 1, 'Introduction to JavaScript', 'intro-javascript', 'Learn the basics of JavaScript', 'JavaScript is a programming language...', 'beginner', 30, ARRAY['Basic computer skills'], ARRAY['Understand variables', 'Write functions'], 'John Doe', 'published', true, 500, 50, 200, 4.5, 100, NOW(), NOW(), NOW(), NULL);

-- learning_assessments
INSERT INTO learning_assessments (content_id, title, description, assessment_type, passing_score, time_limit_minutes, max_attempts, randomize_questions, show_correct_answers, allow_review, questions, total_points, difficulty_level, estimated_duration_minutes, auto_grade, instant_feedback, is_active, is_required, created_at, updated_at) VALUES
(1, 'JavaScript Basics Quiz', 'Test your knowledge of JavaScript basics', 'quiz', 70, 15, 3, false, true, true, '[{"question": "What is a variable?", "options": ["A container for data", "A function"], "correct": 0}]'::jsonb, 10, 'beginner', 15, true, true, true, false, NOW(), NOW());

-- learning_paths
INSERT INTO learning_paths (title, slug, description, path_type, target_audience, content_modules, total_duration_minutes, learning_objectives, skills_gained, is_featured, certificate_earned, enrolled_users, completed_users, success_rate, created_at, updated_at, deleted_at) VALUES
('Full Stack Development', 'full-stack-dev', 'Learn to build full stack applications', 'course', ARRAY['developers'], '[{"id": 1, "title": "Frontend"}]'::jsonb, 200, ARRAY['Build apps'], ARRAY['React', 'Node.js'], true, true, 50, 20, 0.4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

-- user_learning_progress
INSERT INTO user_learning_progress (user_id, content_id, progress_percentage, time_spent_seconds, is_completed, session_count, average_session_duration, first_access_date, last_access_date, created_at, updated_at) VALUES
(1, 1, 50, 1800, false, 2, 900, NOW(), NOW(), NOW(), NOW());

-- user_learning_path_progress
INSERT INTO user_learning_path_progress (user_id, learning_path_id, current_module_index, completed_modules, total_modules, progress_percentage, enrolled_at, last_access_date, created_at, updated_at) VALUES
(1, 1, 0, 1, 5, 20, NOW(), NOW(), NOW(), NOW());

-- user_assessment_attempts
INSERT INTO user_assessment_attempts (user_id, assessment_id, attempt_number, answers, score, is_passed, started_at, completed_at, time_taken_seconds, created_at, updated_at) VALUES
(1, 1, 1, '{"q1": "A container for data"}'::jsonb, 8, true, NOW(), NOW(), 600, NOW(), NOW());

-- learning_analytics
INSERT INTO learning_analytics (user_id, content_id, category_id, event_type, event_data, session_duration_seconds, time_on_page_seconds, country, city, engagement_score, page_load_time_ms, is_processed, created_at) VALUES
(1, 1, 1, 'view', '{"duration": 300}'::jsonb, 300, 300, 'US', 'New York', 0.8, 500, true, NOW());

-- Business Model
INSERT INTO "Business Model" (user_id, session_id, status, current_section, overall_progress, core_function, key_activities, key_resources, key_partners, market_category, target_market, target_geographic_area, tam_estimate, sam_estimate, som_estimate, key_competitors, competition_level, customer_job, customer_pains, customer_gains, solution_components, cost_structure, revenue_streams, monthly_costs_cents, monthly_revenue_cents, name, description, business_type, industry, tags, is_public, validation_score, created_at, updated_at) VALUES
(1, 'session1', 'draft', 1, 0.1, 'To provide AI solutions', 'Development, Marketing', 'Team, Technology', 'Investors', 'B2B', 'Tech companies', 'Global', '1B', '100M', '10M', 'Company A, Company B', 'high', 'Solve problems', 'Inefficiency', 'Efficiency', 'AI engine', '{"development": 100000}'::jsonb, '{"subscription": 50000}'::jsonb, 100000, 50000, 'AI Startup', 'AI solutions for businesses', 'SaaS', 'AI', 'AI, SaaS', false, 50, NOW(), NOW());

-- Business Plan
INSERT INTO "Business Plan" (user_id, status, version, company_name, company_description, founded_date, location, legal_structure, current_stage, mission_statement, vision_statement, executive_summary, projected_revenue_year3, market_share_target, funding_required, industry_overview, market_size_current, market_size_projected, market_cagr, tam_estimate, sam_estimate, som_estimate, market_trends, competitor_analysis, competitive_landscape, core_product_offering, unique_value_proposition, product_roadmap, marketing_strategy, sales_strategy, customer_acquisition_channels, technology_infrastructure, supply_chain_logistics, operational_metrics, management_team, advisory_board, revenue_projections, expense_breakdown, key_financial_metrics, customer_acquisition_cost, lifetime_value, payback_period_months, ebitda_year3, use_of_funds, funding_strategy, investment_highlights, total_funding_sought, industry, tags, is_public, is_featured, created_at, updated_at) VALUES
(1, 'draft', '1.0', 'AI Startup Inc.', 'Providing AI solutions', '2023-01-01', 'New York', 'LLC', 'Seed', 'To innovate with AI', 'AI for everyone', 'Summary...', 1000000, 0.05, 500000, 'AI is growing', 1000000000, 2000000000, 0.2, 1000000000, 100000000, 10000000, '{"trend": "Increasing adoption"}'::jsonb, '{"competitors": ["A", "B"]}'::jsonb, 'Competitive', 'AI Platform', 'Easy to use', '{"phase1": "MVP"}'::jsonb, '{"channels": ["Online"]}'::jsonb, '{"direct": true}'::jsonb, '["Website"]'::jsonb, 'Cloud', 'N/A', '{"metric": "Users"}'::jsonb, '{"ceo": "John"}'::jsonb, '{"advisor": "Jane"}'::jsonb, '{"year1": 100000}'::jsonb, '{"salaries": 200000}'::jsonb, '{"margin": 0.3}'::jsonb, 100, 1000, 12, 500000, '{"product": 300000}'::jsonb, '{"equity": true}'::jsonb, 'High growth', 500000, 'AI', 'AI', false, false, NOW(), NOW());

-- Financial Model
INSERT INTO "Financial Model" (user_id, model_name, model_description, model_status, progress_percentage, current_section, monthly_revenue, growth_period, revenue_stage, revenue_assumptions_completed, revenue_streams, monthly_cogs, cogs_breakdown, opex_data, total_monthly_opex, total_capex, capex_description, amortization_years, statement_format, output_format, investor_capital, income_statement, cash_flow_statement, balance_sheet, model_completed, created_at, updated_at) VALUES
(1, 'Financial Model', 'Startup financials', 'draft', 10, 1, 10000, '3 years', 'early', false, '{"subscription": 10000}'::jsonb, 3000, '{"hosting": 1000}'::jsonb, '{"salaries": 5000}'::jsonb, 5000, 10000, 'Equipment', 5, 'standard', 'excel', 500000, '{"revenue": 10000}'::jsonb, '{"operating": 5000}'::jsonb, '{"assets": 100000}'::jsonb, false, NOW(), NOW());

-- Funding
INSERT INTO "Funding" (total_funding_required, funding_type, funding_stage, use_of_funds, revenue_model, market_size, burn_rate, runway, created_at) VALUES
(500000, ARRAY['equity'], 'seed', '{"product": 300000}'::jsonb, '{"subscription": true}'::jsonb, '{"tam": 1000000000}'::jsonb, 20000, 24, NOW());

-- Legal
INSERT INTO "Legal" (company_name, company_type, commercial_registration, incorporation_date, registered_address, tax_id, shareholders, directors, compliance_status, regulatory_approvals, created_at) VALUES
('AI Startup Inc.', 'LLC', '12345', '2023-01-01', '123 Main St', 'TAX123', '[{"name": "John", "share": 50}]'::jsonb, '[{"name": "John"}]'::jsonb, 'compliant', '["None"]'::jsonb, NOW());

-- Marketing
INSERT INTO "Marketing" (target_audience, unique_value_proposition, marketing_objectives, marketing_channels, marketing_budget, content_strategy, brand_guidelines, competitor_analysis, market_research, created_at) VALUES
('{"age": "25-35"}'::jsonb, 'Easy AI', '["Acquire users"]'::jsonb, ARRAY['Social Media'], 50000, '{"blog": true}'::jsonb, '{"colors": "#000"}'::jsonb, '{"competitors": ["A"]}'::jsonb, '{"surveys": true}'::jsonb, NOW());

-- PitchDeck
INSERT INTO "PitchDeck" (title_slide, problem_statement, solution_overview, market_opportunity, product_demo, business_model, traction_metrics, competitive_advantage, team_overview, financial_projections, funding_ask, contact_info, created_at) VALUES
('{"title": "AI Startup", "subtitle": "Revolutionizing AI"}'::jsonb, 'Problem...', 'Solution...', '{"size": 1000000000}'::jsonb, 'Demo link', '{"subscription": true}'::jsonb, '{"users": 100}'::jsonb, 'Unique tech', '{"members": ["John"]}'::jsonb, '{"revenue": 100000}'::jsonb, '{"amount": 500000}'::jsonb, '{"email": "john@ai.com"}'::jsonb, NOW());

-- Team
INSERT INTO "Team" (founders_count, employees_count, team_structure, readiness_score, work_mode, roles, skills_matrix, hiring_plan, compensation_structure, performance_metrics, development_plan, created_at) VALUES
(2, 5, 'Flat', 8, 'remote', '{"ceo": "John", "cto": "Jane"}'::jsonb, '{"tech": 9}'::jsonb, '{"next": "Developer"}'::jsonb, '{"salary": 100000}'::jsonb, '{"kpi": "Growth"}'::jsonb, '{"training": true}'::jsonb, NOW());

-- Valuation
INSERT INTO "Valuation" (valuation_date, valuation_method, enterprise_value, equity_value, per_share_value, key_assumptions, comparable_companies, precedent_transactions, dcf_projections, sensitivity_analysis, risk_factors, created_at) VALUES
('2023-01-01', 'dcf', '{"value": 1000000}'::jsonb, '{"value": 800000}'::jsonb, 10, ARRAY['Growth 20%'], '[{"name": "Comp A", "value": 2000000}]'::jsonb, '[{"deal": "Deal A"}]'::jsonb, '{"year1": 200000}'::jsonb, '{"scenario": "Base"}'::jsonb, ARRAY['Market risk'], NOW());

-- Activity Logs
INSERT INTO "Activity Logs" (user_id, session_id, activity_type, action, description, ip_address, user_agent, browser, os, device, location_country, location_city, status, duration_ms, request_method, request_url, response_status, severity, tags, created_at, updated_at) VALUES
(1, 'session1', 'login', 'login', 'User logged in', '192.168.1.1', 'Chrome', 'Chrome', 'Windows', 'Desktop', 'US', 'New York', 'success', 100, 'POST', '/login', 200, 'info', 'auth', NOW(), NULL);

-- Billing
INSERT INTO "Billing" (user_id, invoice_number, billing_type, amount_cents, currency, status, description, due_date, paid_at, payment_method, provider, total_amount_cents, billing_period_start, billing_period_end, subscription_id, plan_name, credits_purchased, notes, created_at, updated_at) VALUES
(1, 'INV001', 'subscription', 10000, 'USD', 'paid', 'Monthly subscription', '2023-02-01', '2023-01-15', 'card', 'stripe', 10000, '2023-01-01', '2023-01-31', 'sub_123', 'Pro', 100, 'Paid on time', NOW(), NOW());

-- Credits
INSERT INTO "Credits" (user_id, transaction_id, credit_type, amount, balance_after, description, expires_at, created_at, updated_at) VALUES
(1, 1, 'purchased', 100, 100, 'Purchased credits', '2024-01-01', NOW(), NOW());

-- notifications
INSERT INTO notifications (user_id, type, title, message, action_url, action_text, is_read, priority, expires_at, created_at) VALUES
(1, 'info', 'Welcome', 'Welcome to the platform', '/dashboard', 'Go to Dashboard', false, 'normal', '2023-02-01', NOW());

-- rewards
INSERT INTO rewards (user_id, type, title, description, credits, status, earned_at, created_at, updated_at) VALUES
(1, 'achievement', 'First Login', 'Logged in for the first time', 10, 'active', NOW(), NOW(), NOW());

-- user_settings
INSERT INTO user_settings (user_id, category, setting_key, setting_value, setting_type, is_public, created_at, updated_at) VALUES
(1, 'general', 'theme', 'dark', 'string', false, NOW(), NULL);

-- Calendar
INSERT INTO "Calendar" (user_id, title, description, event_type, start_time, end_time, all_day, location, is_virtual, organizer_id, participants, max_participants, is_private, category, priority, status, reminder_minutes, email_reminder, push_notification, project_id, created_at, updated_at) VALUES
(1, 'Team Meeting', 'Weekly team sync', 'meeting', '2023-01-15T10:00:00Z', '2023-01-15T11:00:00Z', false, 'Conference Room', false, 1, '[{"id": 2, "name": "Jane"}]'::jsonb, 10, false, 'work', 'medium', 'scheduled', 15, true, true, 1, NOW(), NOW());

-- Help Center
INSERT INTO "Help Center" (user_id, content_type, category_name, category_slug, title, slug, excerpt, content, content_format, meta_title, meta_description, featured_image, sort_order, is_featured, is_published, view_count, helpful_count, difficulty_level, read_time_minutes, language, status, published_at, created_at, updated_at) VALUES
(1, 'article', 'Getting Started', 'getting-started', 'How to Login', 'how-to-login', 'Learn how to log in to the platform', 'Step 1: Go to the login page...', 'markdown', 'Login Guide', 'A guide to logging in', 'login.jpg', 1, true, true, 100, 10, 'beginner', 2, 'en', 'published', NOW(), NOW(), NOW());

-- collaborations
INSERT INTO collaborations (project_id, collaborator_user_id, role, status, created_at, timestamp) VALUES
(1, 2, 'editor', 'accepted', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- landing_pages
INSERT INTO landing_pages (section_type, title, subtitle, content, button_text, button_url, sort_order, is_active, created_at, updated_at) VALUES
('hero', 'Welcome to Accelerator', 'Build your startup', 'Accelerate your business with our tools', 'Get Started', '/signup', 1, true, CURRENT_TIMESTAMP, NULL);

-- messages
INSERT INTO messages (project_id, user_id, body, created_at) VALUES
(1, 1, 'Hello team, let''s discuss the project!', CURRENT_TIMESTAMP);

-- project_collaborators
INSERT INTO project_collaborators (project_id, user_id, role, joined_at) VALUES
(1, 2, 'member', CURRENT_TIMESTAMP);