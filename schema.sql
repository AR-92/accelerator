-- Accelerator Application Schema SQL
-- Generated based on PRD.md (Product Requirements Document)
-- This file provides the complete database schema with tables, relationships, RLS policies, indexes, and functions
-- Upload to Supabase SQL Query Runner for deployment
-- Reference for future schema updates and migrations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS on all tables (run after creation if needed)

-- 1. profiles (consolidated user data, replaces user_credits)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    role TEXT,
    package_type TEXT CHECK (package_type IN ('free', 'student', 'enterprise')) DEFAULT 'free',
    package_status TEXT CHECK (package_status IN ('active', 'cancelled')) DEFAULT 'active',
    package_started TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    package_expires TIMESTAMP WITH TIME ZONE,
    credit_balance INTEGER DEFAULT 1000,  -- Updated to 1000 default per code
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    last_credit_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. ideas
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT,
    category_icon TEXT,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    privacy TEXT CHECK (privacy IN ('public', 'private')) DEFAULT 'public',
    validation_threshold_met BOOLEAN DEFAULT FALSE,
    unlocked_models TEXT[] DEFAULT ARRAY['idea'],
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    overall_status TEXT CHECK (overall_status IN ('draft', 'in_progress', 'completed', 'reported')) DEFAULT 'draft',
    rating DECIMAL(3,2),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- 3. votes
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(idea_id, user_id)
);
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 4. model_instances
CREATE TABLE model_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    model_type TEXT CHECK (model_type IN ('idea', 'business', 'financial', 'funding', 'legal', 'marketing', 'team')),
    status TEXT CHECK (status IN ('draft', 'completed')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE model_instances ENABLE ROW LEVEL SECURITY;

-- 5. model_sections
CREATE TABLE model_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_instance_id UUID REFERENCES model_instances(id) ON DELETE CASCADE,
    section_name TEXT,
    section_data JSONB DEFAULT '{}',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE model_sections ENABLE ROW LEVEL SECURITY;

-- 6. team_members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
    name TEXT,
    role TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 7. reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type TEXT CHECK (report_type IN ('business-plan', 'pitch-deck', 'valuation')),
    report_data JSONB DEFAULT '{}',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 8. notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 9. credit_transactions
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type TEXT CHECK (transaction_type IN ('credit_purchase', 'ai_generation', 'report_generation', 'reward_given', 'reward_earned')),
    amount INTEGER,
    metadata JSONB DEFAULT '{}',
    status TEXT CHECK (status IN ('active', 'cancelled')) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- 10. activity_log
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT,
    entity_type TEXT,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- 11. voting_rewards
CREATE TABLE voting_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
    voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_amount INTEGER,
    distributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE voting_rewards ENABLE ROW LEVEL SECURITY;

-- Additional existing tables (from PRD 4.1)
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    key TEXT,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE TABLE billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER,
    currency TEXT DEFAULT 'USD',
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

CREATE TABLE credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    credits INTEGER,
    price INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;

CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    type TEXT,
    price_monthly INTEGER,
    credits_monthly INTEGER,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT,
    amount INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic user-owned access)
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own ideas" ON ideas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read public ideas" ON ideas FOR SELECT USING (privacy = 'public');
CREATE POLICY "Users can vote on public ideas" ON votes FOR ALL USING (EXISTS (SELECT 1 FROM ideas WHERE id = idea_id AND privacy = 'public'));
CREATE POLICY "Users can manage own model instances" ON model_instances FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own model sections" ON model_sections FOR ALL USING (EXISTS (SELECT 1 FROM model_instances WHERE id = model_instance_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own team members" ON team_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reports" ON reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own credit transactions" ON credit_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own activity log" ON activity_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own voting rewards" ON voting_rewards FOR ALL USING (auth.uid() = voter_id);
CREATE POLICY "Users can manage own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own billing" ON billing_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own rewards" ON rewards FOR ALL USING (auth.uid() = user_id);

-- Indexes (PRD 5.5)
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_user_id_created_at ON ideas(user_id, created_at);
CREATE INDEX idx_votes_idea_id ON votes(idea_id);
CREATE INDEX idx_model_instances_idea_id ON model_instances(idea_id);
CREATE INDEX idx_model_instances_user_id_model_type ON model_instances(user_id, model_type);
CREATE INDEX idx_model_sections_model_instance_id ON model_sections(model_instance_id);
CREATE INDEX idx_model_sections_section_data ON model_sections USING GIN (section_data);
CREATE INDEX idx_reports_idea_id ON reports(idea_id);
CREATE INDEX idx_reports_report_data ON reports USING GIN (report_data);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_user_id_created_at ON credit_transactions(user_id, created_at);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_user_id_action_type ON activity_log(user_id, action_type);
CREATE INDEX idx_activity_log_details ON activity_log USING GIN (details);

-- Database Functions (PRD 5.9)
CREATE OR REPLACE FUNCTION calculate_completion_percentage(idea_uuid UUID) RETURNS INTEGER AS $$
DECLARE
    total_sections INTEGER;
    completed_sections INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_sections FROM model_sections ms
    JOIN model_instances mi ON ms.model_instance_id = mi.id
    WHERE mi.idea_id = idea_uuid AND mi.status = 'completed';
    
    SELECT COUNT(*) INTO completed_sections FROM model_sections ms
    JOIN model_instances mi ON ms.model_instance_id = mi.id
    WHERE mi.idea_id = idea_uuid AND mi.status = 'completed' AND ms.is_completed = TRUE;
    
    IF total_sections = 0 THEN RETURN 0; END IF;
    RETURN (completed_sections * 100) / total_sections;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updates
CREATE OR REPLACE FUNCTION update_completion_on_section_change() RETURNS TRIGGER AS $$
BEGIN
    UPDATE ideas SET completion_percentage = calculate_completion_percentage(idea_id)
    FROM model_instances mi WHERE mi.id = NEW.model_instance_id AND ideas.id = mi.idea_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_completion
AFTER INSERT OR UPDATE ON model_sections
FOR EACH ROW EXECUTE FUNCTION update_completion_on_section_change();

-- Sample Data (PRD 6.8)
INSERT INTO credit_packages (name, credits, price) VALUES ('Basic', 500, 999), ('Pro', 2000, 2999);
INSERT INTO packages (name, type, price_monthly, credits_monthly, features) VALUES 
('Free', 'free', 0, 50, '{"vote": true}'),
('Student', 'student', 999, 500, '{"create": true, "models": true}'),
('Enterprise', 'enterprise', 2999, 2000, '{"all": true, "team": true}');

-- End of schema