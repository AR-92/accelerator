-- Comprehensive seed data for Accelerator Platform (simplified for reliable execution)

-- Insert sample organizations
INSERT INTO organizations (name, org_type, owner_user_id, created_at) VALUES 
  ('Tech Corp', 'corporate', NULL, CURRENT_TIMESTAMP),
  ('Innovation Labs', 'enterprise', NULL, CURRENT_TIMESTAMP),
  ('StartupXYZ', 'startup', NULL, CURRENT_TIMESTAMP),
  ('Future Innovations', 'startup', NULL, CURRENT_TIMESTAMP),
  ('Global Solutions Inc', 'corporate', NULL, CURRENT_TIMESTAMP),
  ('Digital Ventures', 'enterprise', NULL, CURRENT_TIMESTAMP),
  ('EcoTech Startups', 'startup', NULL, CURRENT_TIMESTAMP),
  ('HealthTech Innovations', 'startup', NULL, CURRENT_TIMESTAMP);

-- Get user IDs for reference (using variables for cleaner code)
-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, name, user_type, organization_id, wallet_credits, status, banned, ban_reason, banned_reason, banned_at, theme, bio, created_at, updated_at) VALUES
  ('admin@accelerator.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Admin', 'User', 'Admin User', 'admin', NULL, 10000, 'active', false, NULL, NULL, NULL, 'default', 'Administrator of the platform', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('corporate@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Corporate', 'User', 'Corporate User', 'corporate', NULL, 500, 'active', false, NULL, NULL, NULL, 'default', 'Corporate account user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('enterprise@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Enterprise', 'User', 'Enterprise User', 'enterprise', NULL, 300, 'active', false, NULL, NULL, NULL, 'default', 'Enterprise account user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('startup1@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Alex', 'Johnson', 'Startup Alex Johnson', 'startup', NULL, 100, 'active', false, NULL, NULL, NULL, 'default', 'Startup founder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('startup2@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Sarah', 'Chen', 'Startup Sarah Chen', 'startup', NULL, 150, 'active', false, NULL, NULL, NULL, 'default', 'Startup founder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('student@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Mike', 'Davis', 'Student Mike Davis', 'student', NULL, 50, 'active', false, NULL, NULL, NULL, 'default', 'Student user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('corporate2@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Jane', 'Smith', 'Corporate Jane Smith', 'corporate', NULL, 750, 'active', false, NULL, NULL, NULL, 'default', 'Corporate account user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('enterprise2@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Robert', 'Wilson', 'Enterprise Robert Wilson', 'enterprise', NULL, 450, 'active', false, NULL, NULL, NULL, 'default', 'Enterprise account user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('startup3@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Emma', 'Rodriguez', 'Startup Emma Rodriguez', 'startup', NULL, 200, 'active', false, NULL, NULL, NULL, 'default', 'Startup founder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('startup4@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'David', 'Kim', 'Startup David Kim', 'startup', NULL, 180, 'active', false, NULL, NULL, NULL, 'default', 'Startup founder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('student2@example.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Olivia', 'Brown', 'Student Olivia Brown', 'student', NULL, 75, 'active', false, NULL, NULL, NULL, 'default', 'Student user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Update organizations to set owner_user_id
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'corporate@example.com') WHERE name = 'Tech Corp';
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'enterprise@example.com') WHERE name = 'Innovation Labs';
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'startup1@example.com') WHERE name = 'StartupXYZ';
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'startup2@example.com') WHERE name = 'Future Innovations';
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'corporate2@example.com') WHERE name = 'Global Solutions Inc';
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'enterprise2@example.com') WHERE name = 'Digital Ventures';
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'startup3@example.com') WHERE name = 'EcoTech Startups';
UPDATE organizations SET owner_user_id = (SELECT id FROM users WHERE email = 'startup4@example.com') WHERE name = 'HealthTech Innovations';

-- Update users to link them to organizations
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'Tech Corp') WHERE email = 'corporate@example.com';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'Innovation Labs') WHERE email = 'enterprise@example.com';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'StartupXYZ') WHERE email = 'startup1@example.com';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'Future Innovations') WHERE email = 'startup2@example.com';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'Global Solutions Inc') WHERE email = 'corporate2@example.com';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'Digital Ventures') WHERE email = 'enterprise2@example.com';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'EcoTech Startups') WHERE email = 'startup3@example.com';
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE name = 'HealthTech Innovations') WHERE email = 'startup4@example.com';

-- Insert sample projects
INSERT INTO projects (owner_user_id, organization_id, title, description, visibility, created_at) VALUES 
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), (SELECT id FROM organizations WHERE name = 'StartupXYZ'), 'AI-Powered Analytics Platform', 'An advanced analytics platform using artificial intelligence to provide insights from large datasets. This project leverages machine learning algorithms to identify patterns and generate actionable business intelligence from complex data sources.', 'public', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), (SELECT id FROM organizations WHERE name = 'Future Innovations'), 'Blockchain Supply Chain Solution', 'A blockchain-based solution to track and verify products throughout the supply chain. This ensures transparency, authenticity, and security in product distribution across multiple stakeholders.', 'public', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), (SELECT id FROM organizations WHERE name = 'StartupXYZ'), 'IoT Smart City Infrastructure', 'Internet of Things infrastructure to make cities smarter and more efficient. This includes smart traffic management, environmental monitoring, and resource optimization systems.', 'private', CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), (SELECT id FROM organizations WHERE name = 'Future Innovations'), 'Healthcare Management System', 'Digital healthcare platform to connect patients with healthcare providers. Features include appointment scheduling, electronic medical records, and telemedicine capabilities.', 'public', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'student@example.com'), NULL, 'Student Project - Green Energy', 'Research project on green energy solutions for residential buildings. Focuses on solar panel optimization and energy storage systems for sustainable living.', 'public', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE email = 'startup3@example.com'), (SELECT id FROM organizations WHERE name = 'EcoTech Startups'), 'Climate Monitoring Network', 'Real-time climate and environmental monitoring system using IoT sensors. Provides data for climate research and environmental protection initiatives.', 'public', CURRENT_TIMESTAMP - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE email = 'startup4@example.com'), (SELECT id FROM organizations WHERE name = 'HealthTech Innovations'), 'Remote Patient Monitoring App', 'Mobile application for continuous patient monitoring outside of clinical settings. Includes vital signs tracking and predictive health analytics.', 'private', CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE email = 'startup3@example.com'), (SELECT id FROM organizations WHERE name = 'EcoTech Startups'), 'Sustainable Agriculture Platform', 'Technology platform for sustainable farming practices. Uses satellite imagery and ground sensors to optimize water usage and crop yields.', 'public', CURRENT_TIMESTAMP - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE email = 'student2@example.com'), NULL, 'AI Ethics Framework', 'Research project developing ethical guidelines for AI implementation in various industries. Focuses on bias prevention and transparency in AI systems.', 'public', CURRENT_TIMESTAMP - INTERVAL '9 days'),
  ((SELECT id FROM users WHERE email = 'startup4@example.com'), (SELECT id FROM organizations WHERE name = 'HealthTech Innovations'), 'Mental Health Support Platform', 'Digital platform providing mental health resources, support groups, and therapy matching services. Uses AI to personalize content and track mental wellness.', 'public', CURRENT_TIMESTAMP - INTERVAL '10 days');

-- Insert sample project collaborators
INSERT INTO project_collaborators (project_id, user_id, role, joined_at) VALUES 
  -- AI Analytics Platform collaborators
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), (SELECT id FROM users WHERE email = 'startup1@example.com'), 'admin', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), (SELECT id FROM users WHERE email = 'student@example.com'), 'member', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), (SELECT id FROM users WHERE email = 'student2@example.com'), 'viewer', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  -- Blockchain Supply Chain Solution collaborators
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), (SELECT id FROM users WHERE email = 'startup2@example.com'), 'admin', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), (SELECT id FROM users WHERE email = 'student@example.com'), 'viewer', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  -- Healthcare Management System collaborators
  ((SELECT id FROM projects WHERE title = 'Healthcare Management System'), (SELECT id FROM users WHERE email = 'startup2@example.com'), 'admin', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM projects WHERE title = 'Healthcare Management System'), (SELECT id FROM users WHERE email = 'student2@example.com'), 'member', CURRENT_TIMESTAMP),
  -- Climate Monitoring Network collaborators
  ((SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), (SELECT id FROM users WHERE email = 'startup3@example.com'), 'admin', CURRENT_TIMESTAMP - INTERVAL '6 days'),
  ((SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), (SELECT id FROM users WHERE email = 'student@example.com'), 'member', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  -- Remote Patient Monitoring App collaborators
  ((SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), (SELECT id FROM users WHERE email = 'startup4@example.com'), 'admin', CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ((SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), (SELECT id FROM users WHERE email = 'student2@example.com'), 'member', CURRENT_TIMESTAMP - INTERVAL '6 days');

-- Insert sample votes
INSERT INTO votes (user_id, project_id, score, created_at) VALUES 
  -- Votes for AI Analytics Platform
  ((SELECT id FROM users WHERE email = 'student@example.com'), (SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 1, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'corporate@example.com'), (SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'enterprise@example.com'), (SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  -- Votes for Blockchain Supply Chain Solution
  ((SELECT id FROM users WHERE email = 'student@example.com'), (SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), (SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), -1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'corporate@example.com'), (SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), 1, CURRENT_TIMESTAMP),
  -- Votes for other projects
  ((SELECT id FROM users WHERE email = 'student@example.com'), (SELECT id FROM projects WHERE title = 'Healthcare Management System'), 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'enterprise@example.com'), (SELECT id FROM projects WHERE title = 'Healthcare Management System'), 1, CURRENT_TIMESTAMP),
  ((SELECT id FROM users WHERE email = 'corporate2@example.com'), (SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'enterprise2@example.com'), (SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), 1, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Insert sample transactions
INSERT INTO transactions (user_id, tx_type, amount_cents, credits, currency, provider, provider_tx_id, created_at) VALUES 
  ((SELECT id FROM users WHERE email = 'admin@accelerator.com'), 'purchase_credits', 10000, 1000, 'USD', 'stripe', 'txn_admin_100', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'corporate@example.com'), 'purchase_credits', 5000, 500, 'USD', 'stripe', 'txn_corp_50', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'enterprise@example.com'), 'purchase_credits', 3000, 300, 'USD', 'stripe', 'txn_ent_30', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), 'purchase_credits', 1000, 100, 'USD', 'stripe', 'txn_stp1_10', CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), 'purchase_credits', 1500, 150, 'USD', 'stripe', 'txn_stp2_15', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE email = 'student@example.com'), 'purchase_credits', 500, 50, 'USD', 'stripe', 'txn_stu_5', CURRENT_TIMESTAMP - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE email = 'corporate2@example.com'), 'purchase_credits', 7500, 750, 'USD', 'stripe', 'txn_corp2_75', CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE email = 'enterprise2@example.com'), 'purchase_credits', 4500, 450, 'USD', 'stripe', 'txn_ent2_45', CURRENT_TIMESTAMP - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE email = 'startup3@example.com'), 'purchase_credits', 2000, 200, 'USD', 'stripe', 'txn_stp3_20', CURRENT_TIMESTAMP - INTERVAL '9 days'),
  ((SELECT id FROM users WHERE email = 'startup4@example.com'), 'purchase_credits', 1800, 180, 'USD', 'stripe', 'txn_stp4_18', CURRENT_TIMESTAMP - INTERVAL '10 days'),
  -- Reward spending transactions
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), 'reward_spend', 0, 30, 'USD', 'internal', 'reward_spent_stp1_30', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), 'reward_spend', 0, 50, 'USD', 'internal', 'reward_spent_stp2_50', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Insert sample rewards
INSERT INTO rewards (giver_user_id, recipient_user_id, project_id, credits, reason, transaction_id, awarded_at) VALUES 
  ((SELECT id FROM users WHERE email = 'corporate@example.com'), NULL, (SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 50, 'Outstanding innovation in AI analytics and potential for business impact', (SELECT id FROM transactions WHERE provider_tx_id = 'reward_spent_stp2_50'), CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'enterprise@example.com'), NULL, (SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), 30, 'Excellent blockchain implementation and security measures', NULL, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'corporate@example.com'), (SELECT id FROM users WHERE email = 'student@example.com'), NULL, 10, 'Great contribution as a student and innovative approach to green energy', NULL, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'corporate2@example.com'), NULL, (SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), 40, 'Sustainable tech solution with significant environmental impact', NULL, CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE email = 'enterprise2@example.com'), NULL, (SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), 35, 'Innovative approach to healthcare technology and patient care', NULL, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE email = 'corporate@example.com'), (SELECT id FROM users WHERE email = 'student2@example.com'), NULL, 15, 'Excellent research on AI ethics and responsible technology development', NULL, CURRENT_TIMESTAMP - INTERVAL '6 days');

-- Insert sample tasks
INSERT INTO tasks (project_id, title, description, assignee_user_id, status, created_at) VALUES 
  -- Tasks for AI Analytics Platform
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 'Implement ML model', 'Build and train the core machine learning model using TensorFlow, focusing on anomaly detection for business data.', (SELECT id FROM users WHERE email = 'startup1@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 'Design UI components', 'Create responsive user interface components for the analytics dashboard, focusing on data visualization.', (SELECT id FROM users WHERE email = 'student@example.com'), 'todo', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 'Database optimization', 'Optimize database queries for large dataset handling and improve performance for real-time analytics.', (SELECT id FROM users WHERE email = 'student2@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), 'Security audit', 'Perform comprehensive security audit to ensure data protection and compliance with privacy regulations.', (SELECT id FROM users WHERE email = 'student@example.com'), 'todo', CURRENT_TIMESTAMP),
  -- Tasks for Blockchain Supply Chain Solution
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), 'Set up blockchain nodes', 'Configure and deploy blockchain infrastructure across multiple nodes for redundancy and performance.', (SELECT id FROM users WHERE email = 'startup2@example.com'), 'done', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), 'API development', 'Develop RESTful APIs for blockchain interaction, ensuring compatibility with existing supply chain systems.', (SELECT id FROM users WHERE email = 'student2@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), 'Smart contract testing', 'Comprehensive testing of smart contracts for various supply chain scenarios and edge cases.', (SELECT id FROM users WHERE email = 'student@example.com'), 'todo', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  -- Tasks for Healthcare Management System
  ((SELECT id FROM projects WHERE title = 'Healthcare Management System'), 'UI/UX Design', 'Design user interface for healthcare platform with focus on accessibility and usability for medical professionals.', (SELECT id FROM users WHERE email = 'startup2@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM projects WHERE title = 'Healthcare Management System'), 'Database schema', 'Create database schema for healthcare records with compliance to HIPAA regulations.', (SELECT id FROM users WHERE email = 'startup2@example.com'), 'todo', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM projects WHERE title = 'Healthcare Management System'), 'Patient portal development', 'Build secure patient portal for appointment scheduling and medical record access.', (SELECT id FROM users WHERE email = 'student@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  -- Tasks for Climate Monitoring Network
  ((SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), 'Sensor deployment', 'Deploy IoT sensors in selected locations and ensure proper connectivity to central monitoring system.', (SELECT id FROM users WHERE email = 'startup3@example.com'), 'done', CURRENT_TIMESTAMP - INTERVAL '6 days'),
  ((SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), 'Data visualization dashboard', 'Create interactive dashboard for climate data visualization with predictive modeling capabilities.', (SELECT id FROM users WHERE email = 'student2@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), 'Alert system implementation', 'Implement automated alert system for environmental threshold breaches with notification capabilities.', (SELECT id FROM users WHERE email = 'student@example.com'), 'todo', CURRENT_TIMESTAMP),
  -- Tasks for Remote Patient Monitoring App
  ((SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), 'Mobile app development', 'Develop native mobile applications for iOS and Android with real-time vital signs monitoring.', (SELECT id FROM users WHERE email = 'startup4@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), 'Data security implementation', 'Implement end-to-end encryption and secure data transmission for patient health information.', (SELECT id FROM users WHERE email = 'student2@example.com'), 'in_progress', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Insert sample messages
INSERT INTO messages (project_id, user_id, body, created_at) VALUES 
  -- Conversations for AI Analytics Platform
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), (SELECT id FROM users WHERE email = 'startup1@example.com'), 'Initial project planning meeting scheduled for tomorrow at 10 AM. We''ll discuss the machine learning model architecture and dataset requirements.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), (SELECT id FROM users WHERE email = 'student@example.com'), 'I''ve completed the initial design for the dashboard. Key metrics will include performance analytics, trend identification, and anomaly detection. Reviewing it with the team tomorrow.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM projects WHERE title = 'AI-Powered Analytics Platform'), (SELECT id FROM users WHERE email = 'student2@example.com'), 'Database performance is crucial for real-time analytics. I''m implementing indexing strategies and query optimization techniques. Early tests show 40% improvement.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  -- Conversations for Blockchain Supply Chain Solution
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), (SELECT id FROM users WHERE email = 'startup2@example.com'), 'Blockchain nodes are now operational and synchronized. Ready for integration testing with supply chain partners next week.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), (SELECT id FROM users WHERE email = 'student@example.com'), 'I''ve reviewed the implementation and it looks solid. The consensus mechanism is efficient and handles network partitions well. Great work on the cryptographic security!', CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM projects WHERE title = 'Blockchain Supply Chain Solution'), (SELECT id FROM users WHERE email = 'student2@example.com'), 'API endpoints are 80% complete. I''m implementing rate limiting and authentication middleware to secure external access.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  -- Conversations for Healthcare Management System
  ((SELECT id FROM projects WHERE title = 'Healthcare Management System'), (SELECT id FROM users WHERE email = 'startup2@example.com'), 'Need to discuss API integration with the existing hospital management system. Security and compliance requirements are critical for this integration.', CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM projects WHERE title = 'Healthcare Management System'), (SELECT id FROM users WHERE email = 'student@example.com'), 'Patient portal is taking shape! Focusing on accessibility features to ensure it works well for users of all ages and technical capabilities.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  -- Conversations for Climate Monitoring Network
  ((SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), (SELECT id FROM users WHERE email = 'startup3@example.com'), 'Sensor deployment is complete across 12 locations. Initial data is streaming in and looks promising. Temperature and humidity sensors are performing well.', CURRENT_TIMESTAMP - INTERVAL '6 days'),
  ((SELECT id FROM projects WHERE title = 'Climate Monitoring Network'), (SELECT id FROM users WHERE email = 'student2@example.com'), 'Dashboard development is progressing well. Added predictive modeling based on historical patterns. Users can now see forecasted trends.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  -- Conversations for Remote Patient Monitoring App
  ((SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), (SELECT id FROM users WHERE email = 'startup4@example.com'), 'Mobile app beta is ready for internal testing. We''re focusing on battery optimization for continuous monitoring and data transmission efficiency.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM projects WHERE title = 'Remote Patient Monitoring App'), (SELECT id FROM users WHERE email = 'student2@example.com'), 'Security implementation is critical. We''ve implemented end-to-end encryption for all health data transmission and storage. HIPAA compliance audit passed.', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Insert sample payment methods
INSERT INTO payment_methods (user_id, provider, provider_method_id, last4, brand, exp_month, exp_year, is_default, created_at) VALUES 
  ((SELECT id FROM users WHERE email = 'admin@accelerator.com'), 'stripe', 'pm_123456789', '4242', 'Visa', 12, 2027, true, CURRENT_TIMESTAMP - INTERVAL '1 year'),
  ((SELECT id FROM users WHERE email = 'corporate@example.com'), 'stripe', 'pm_987654321', '5555', 'Mastercard', 10, 2026, true, CURRENT_TIMESTAMP - INTERVAL '10 months'),
  ((SELECT id FROM users WHERE email = 'enterprise@example.com'), 'stripe', 'pm_555555555', '1111', 'American Express', 8, 2028, false, CURRENT_TIMESTAMP - INTERVAL '8 months'),
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), 'paypal', 'pm_paypal_stp1', '2222', 'PayPal', 5, 2025, true, CURRENT_TIMESTAMP - INTERVAL '6 months'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), 'stripe', 'pm_stp2_card', '3333', 'Visa', 3, 2029, true, CURRENT_TIMESTAMP - INTERVAL '4 months'),
  ((SELECT id FROM users WHERE email = 'corporate2@example.com'), 'stripe', 'pm_corp2_card', '6666', 'Mastercard', 7, 2027, true, CURRENT_TIMESTAMP - INTERVAL '9 months');

-- Insert sample ideas
INSERT INTO ideas (user_id, href, title, type, typeIcon, rating, description, tags, is_favorite, upvotes, downvotes, created_at) VALUES
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), 'ai-analytics-platform', 'AI-Powered Analytics Platform', 'Technology', 'Brain', 5, 'An advanced analytics platform using artificial intelligence to provide insights from large datasets. This project leverages machine learning algorithms to identify patterns and generate actionable business intelligence.', '["AI", "Analytics", "Machine Learning", "Data Science"]', true, 15, 2, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), 'blockchain-supply-chain', 'Blockchain Supply Chain Solution', 'Technology', 'Link', 4, 'A blockchain-based solution to track and verify products throughout the supply chain. This ensures transparency, authenticity, and security in product distribution across multiple stakeholders.', '["Blockchain", "Supply Chain", "Security", "Transparency"]', false, 12, 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), 'iot-smart-city', 'IoT Smart City Infrastructure', 'Technology', 'Zap', 4, 'Internet of Things infrastructure to make cities smarter and more efficient. This includes smart traffic management, environmental monitoring, and resource optimization systems.', '["IoT", "Smart City", "Infrastructure", "Sustainability"]', false, 8, 0, CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), 'healthcare-management', 'Healthcare Management System', 'Healthcare', 'Heart', 5, 'Digital healthcare platform to connect patients with healthcare providers. Features include appointment scheduling, electronic medical records, and telemedicine capabilities.', '["Healthcare", "Telemedicine", "EHR", "Patient Care"]', true, 20, 3, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'student@example.com'), 'green-energy-solutions', 'Student Project - Green Energy', 'Environment', 'Leaf', 3, 'Research project on green energy solutions for residential buildings. Focuses on solar panel optimization and energy storage systems for sustainable living.', '["Green Energy", "Solar", "Sustainability", "Research"]', false, 6, 1, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE email = 'startup3@example.com'), 'climate-monitoring', 'Climate Monitoring Network', 'Environment', 'Cloud', 4, 'Real-time climate and environmental monitoring system using IoT sensors. Provides data for climate research and environmental protection initiatives.', '["Climate", "IoT", "Environmental", "Monitoring"]', false, 10, 0, CURRENT_TIMESTAMP - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE email = 'startup4@example.com'), 'remote-patient-monitoring', 'Remote Patient Monitoring App', 'Healthcare', 'Activity', 4, 'Mobile application for continuous patient monitoring outside of clinical settings. Includes vital signs tracking and predictive health analytics.', '["Healthcare", "Mobile", "Monitoring", "Analytics"]', true, 18, 2, CURRENT_TIMESTAMP - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE email = 'startup3@example.com'), 'sustainable-agriculture', 'Sustainable Agriculture Platform', 'Agriculture', 'Sprout', 4, 'Technology platform for sustainable farming practices. Uses satellite imagery and ground sensors to optimize water usage and crop yields.', '["Agriculture", "Sustainability", "IoT", "Satellite"]', false, 9, 1, CURRENT_TIMESTAMP - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE email = 'student2@example.com'), 'ai-ethics-framework', 'AI Ethics Framework', 'Research', 'Shield', 3, 'Research project developing ethical guidelines for AI implementation in various industries. Focuses on bias prevention and transparency in AI systems.', '["AI", "Ethics", "Research", "Bias"]', false, 7, 0, CURRENT_TIMESTAMP - INTERVAL '9 days'),
  ((SELECT id FROM users WHERE email = 'startup4@example.com'), 'mental-health-platform', 'Mental Health Support Platform', 'Healthcare', 'Brain', 5, 'Digital platform providing mental health resources, support groups, and therapy matching services. Uses AI to personalize content and track mental wellness.', '["Mental Health", "AI", "Support", "Wellness"]', true, 22, 1, CURRENT_TIMESTAMP - INTERVAL '10 days');

-- Insert sample portfolio items
INSERT INTO portfolio (user_id, title, description, category, tags, votes, is_public, image, created_date, updated_date) VALUES
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), 'AI Analytics Dashboard', 'Interactive dashboard for AI-powered business analytics with real-time data visualization and predictive insights.', 'Technology', '["AI", "Analytics", "Dashboard", "Visualization"]', 25, true, '/images/portfolio/ai-dashboard.jpg', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), 'Blockchain Tracker App', 'Mobile application for tracking blockchain transactions and supply chain verification with QR code scanning.', 'Technology', '["Blockchain", "Mobile", "Tracking", "QR Code"]', 18, true, '/images/portfolio/blockchain-app.jpg', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'startup1@example.com'), 'Smart City Control Center', 'Centralized control system for managing IoT devices in smart city infrastructure with real-time monitoring.', 'Technology', '["IoT", "Smart City", "Control System", "Monitoring"]', 15, false, '/images/portfolio/smart-city.jpg', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'startup2@example.com'), 'Healthcare Portal', 'Patient and provider portal for healthcare management with appointment scheduling and medical records.', 'Healthcare', '["Healthcare", "Portal", "Scheduling", "Records"]', 30, true, '/images/portfolio/healthcare-portal.jpg', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
  ((SELECT id FROM users WHERE email = 'student@example.com'), 'Solar Optimization Study', 'Research paper and prototype for optimizing solar panel placement and energy storage in residential settings.', 'Research', '["Solar", "Optimization", "Research", "Energy"]', 12, true, '/images/portfolio/solar-study.jpg', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'startup3@example.com'), 'Climate Sensor Network', 'IoT sensor network for environmental monitoring with data analytics and visualization dashboard.', 'Environment', '["IoT", "Climate", "Sensors", "Analytics"]', 20, true, '/images/portfolio/climate-sensors.jpg', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE email = 'startup4@example.com'), 'Health Monitoring Wearable', 'Wearable device prototype for continuous health monitoring with mobile app integration.', 'Healthcare', '["Wearable", "Health", "Monitoring", "Mobile"]', 28, true, '/images/portfolio/health-wearable.jpg', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ((SELECT id FROM users WHERE email = 'startup3@example.com'), 'Farm Optimization Platform', 'Platform for precision agriculture with satellite imagery analysis and IoT sensor integration.', 'Agriculture', '["Agriculture", "Precision", "Satellite", "IoT"]', 16, true, '/images/portfolio/farm-platform.jpg', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE email = 'student2@example.com'), 'AI Ethics Whitepaper', 'Comprehensive whitepaper on ethical AI implementation with case studies and recommendations.', 'Research', '["AI", "Ethics", "Whitepaper", "Case Studies"]', 14, true, '/images/portfolio/ai-ethics.jpg', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE email = 'startup4@example.com'), 'Mental Wellness App', 'Mobile application for mental health support with AI-powered content personalization and mood tracking.', 'Healthcare', '["Mental Health", "Mobile", "AI", "Wellness"]', 35, true, '/images/portfolio/mental-wellness.jpg', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- Update user wallet credits based on transactions
UPDATE users SET wallet_credits = wallet_credits +
  (SELECT COALESCE(SUM(credits), 0) FROM transactions WHERE transactions.user_id = users.id AND tx_type = 'purchase_credits') -
  (SELECT COALESCE(SUM(credits), 0) FROM transactions WHERE transactions.user_id = users.id AND tx_type = 'reward_spend');