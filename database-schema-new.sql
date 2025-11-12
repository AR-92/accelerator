-- PostgreSQL Database Schema for Accelerator Application

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for better data integrity
CREATE TYPE user_type_enum AS ENUM ('student', 'startup', 'enterprise', 'corporate', 'admin');
CREATE TYPE org_type_enum AS ENUM ('corporate', 'enterprise', 'startup');
CREATE TYPE visibility_enum AS ENUM ('private', 'public');
CREATE TYPE task_status_enum AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE transaction_type_enum AS ENUM ('purchase_credits', 'reward_spend', 'refund');

-- ORGANIZATIONS (corporate/enterprise/startup) - Created first, without foreign keys initially
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  org_type org_type_enum NOT NULL,       -- 'corporate'|'enterprise'|'startup'
  owner_user_id INTEGER,                 -- who created/owns the org (a user) - foreign key added later
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (org_type IN ('corporate', 'enterprise', 'startup'))
);

-- USERS (auth + profile + type) - Created after organizations, but without org foreign key initially
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password_hash VARCHAR(255),            -- NULL if oauth
  first_name VARCHAR(255),               -- first name of the user
  last_name VARCHAR(255),                -- last name of the user
  name VARCHAR(255),                     -- full name (concatenation of first and last name)
  user_type user_type_enum NOT NULL,     -- 'student'|'startup'|'enterprise'|'corporate'|'admin'
  organization_id INTEGER,               -- optional: user belongs to an org - foreign key added later
  wallet_credits INTEGER DEFAULT 0 CHECK (wallet_credits >= 0),  -- credits column required by query
  status VARCHAR(50) DEFAULT 'active',   -- 'active'|'inactive'|'pending', etc.
  banned BOOLEAN DEFAULT FALSE,          -- whether user is banned
  ban_reason TEXT,                       -- reason for ban if banned
  banned_reason TEXT,                    -- alternate name for ban reason
  banned_at TIMESTAMP,                   -- when user was banned
  theme VARCHAR(50) DEFAULT 'default',   -- UI theme preference
  bio TEXT,                              -- user biography
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  CHECK (user_type IN ('student', 'startup', 'enterprise', 'corporate', 'admin'))
);

-- PROJECTS - Created after users and organizations but without foreign keys initially
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  owner_user_id INTEGER NOT NULL,        -- owner (usually a startup user or enterprise) - foreign key added later
  organization_id INTEGER,               -- optional owner org - foreign key added later
  title VARCHAR(255) NOT NULL,
  description TEXT,
  visibility visibility_enum DEFAULT 'private', -- 'private'|'public'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  CHECK (visibility IN ('private', 'public'))
);

-- PROJECT COLLABORATORS (many-to-many with roles) - Created after projects and users
CREATE TABLE project_collaborators (
  project_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),     -- 'admin','member','viewer'...
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id),
  CHECK (role IN ('admin', 'member', 'viewer'))
);

-- VOTES (user votes on project) - Created after projects and users
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  score INTEGER NOT NULL DEFAULT 1 CHECK (score IN (-1, 1)),      -- 1 for upvote, -1 for downvote
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- For compatibility with existing queries
  UNIQUE (user_id, project_id),           -- one vote per user per project
  CHECK (score IN (-1, 1))
);

-- TRANSACTIONS (payments, credit purchases) - Created after users
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  tx_type transaction_type_enum NOT NULL, -- 'purchase_credits','reward_spend','refund', etc.
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),         -- money in cents
  credits INTEGER DEFAULT 0 CHECK (credits >= 0),             -- credits minted/used
  currency VARCHAR(3) DEFAULT 'USD',
  provider VARCHAR(50),                  -- e.g. 'stripe'
  provider_tx_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (tx_type IN ('purchase_credits', 'reward_spend', 'refund'))
);

-- REWARDS (credits distributed to a project/user) - Created after other tables
CREATE TABLE rewards (
  id SERIAL PRIMARY KEY,
  giver_user_id INTEGER NOT NULL,        -- who spent credits
  recipient_user_id INTEGER,             -- optional: direct recipient user
  project_id INTEGER,                    -- optional: recipient project
  credits INTEGER NOT NULL CHECK (credits > 0),
  reason TEXT,
  transaction_id INTEGER,                -- optional link to transaction
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (credits > 0),
  -- Ensure either recipient_user_id or project_id is set, but not both NULL
  CHECK ((recipient_user_id IS NOT NULL AND project_id IS NULL) OR 
         (recipient_user_id IS NULL AND project_id IS NOT NULL))
);

-- PAYMENT METHODS (stored minimally) - Created after users
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  provider VARCHAR(50) NOT NULL,         -- 'stripe','paypal'
  provider_method_id VARCHAR(255) NOT NULL, -- id inside provider
  last4 VARCHAR(4) CHECK (last4 ~ '^[0-9]{4}$'),  -- last 4 digits of card
  brand VARCHAR(50),
  exp_month INTEGER CHECK (exp_month BETWEEN 1 AND 12),
  exp_year INTEGER CHECK (exp_year >= 2020 AND exp_year <= 2050),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASKS (project tasks) - Created after projects and users
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_user_id INTEGER,
  status task_status_enum DEFAULT 'todo', -- 'todo','in_progress','done'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CHECK (status IN ('todo', 'in_progress', 'done'))
);

-- CHAT MESSAGES (project collaboration) - Created after projects and users
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IDEAS - Created after users
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  owner_user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  tags TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);




-- COLLABORATIONS - Created after projects and users
CREATE TABLE collaborations (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  collaborator_user_id INTEGER NOT NULL,
  role VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- For compatibility with existing queries
);

-- PACKAGES - Created after users
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- BILLING - Created after users
CREATE TABLE billing (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  package_id INTEGER,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL, -- 'pending', 'paid', 'failed', 'refunded'
  invoice_number VARCHAR(100),
  payment_method VARCHAR(100),
  provider VARCHAR(50),        -- 'stripe', 'paypal', etc.
  provider_tx_id VARCHAR(255), -- transaction ID from payment provider
  paid_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- HELP CATEGORIES - Created standalone
CREATE TABLE help_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  parent_category_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- HELP ARTICLES - Created after help_categories
CREATE TABLE help_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER,
  author_user_id INTEGER,
  slug VARCHAR(255) UNIQUE,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP
);

-- LANDING PAGES - Created standalone
CREATE TABLE landing_pages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  content TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  type VARCHAR(100), -- 'page', 'section', etc.
  config JSONB,      -- configuration settings for the landing page
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP
);

-- Now add foreign key constraints after all tables are created
ALTER TABLE organizations 
  ADD CONSTRAINT organizations_owner_user_id_fkey 
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE users 
  ADD CONSTRAINT users_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

ALTER TABLE projects 
  ADD CONSTRAINT projects_owner_user_id_fkey 
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT projects_organization_id_fkey 
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

ALTER TABLE project_collaborators
  ADD CONSTRAINT project_collaborators_project_id_fkey 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  ADD CONSTRAINT project_collaborators_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE votes
  ADD CONSTRAINT votes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT votes_project_id_fkey 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE rewards
  ADD CONSTRAINT rewards_giver_user_id_fkey 
  FOREIGN KEY (giver_user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT rewards_recipient_user_id_fkey 
  FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT rewards_project_id_fkey 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

ALTER TABLE payment_methods
  ADD CONSTRAINT payment_methods_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE tasks
  ADD CONSTRAINT tasks_project_id_fkey 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  ADD CONSTRAINT tasks_assignee_user_id_fkey 
  FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE messages
  ADD CONSTRAINT messages_project_id_fkey 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  ADD CONSTRAINT messages_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;



-- Add indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_banned ON users(banned);
CREATE INDEX idx_organizations_owner ON organizations(owner_user_id);
CREATE INDEX idx_organizations_type ON organizations(org_type);
CREATE INDEX idx_projects_owner ON projects(owner_user_id);
CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_projects_visibility ON projects(visibility);
CREATE INDEX idx_project_collaborators_user ON project_collaborators(user_id);
CREATE INDEX idx_project_collaborators_project ON project_collaborators(project_id);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_project ON votes(project_id);
CREATE INDEX idx_rewards_giver ON rewards(giver_user_id);
CREATE INDEX idx_rewards_recipient ON rewards(recipient_user_id);
CREATE INDEX idx_rewards_project ON rewards(project_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(tx_type);
CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_messages_project ON messages(project_id);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Add indexes for new tables
CREATE INDEX idx_users_first_name ON users(first_name);
CREATE INDEX idx_users_last_name ON users(last_name);
CREATE INDEX idx_users_ban_reason ON users(ban_reason);
CREATE INDEX idx_users_banned_reason ON users(banned_reason);
CREATE INDEX idx_users_banned_at ON users(banned_at);
CREATE INDEX idx_users_theme ON users(theme);
CREATE INDEX idx_collaborations_timestamp ON collaborations(timestamp);
CREATE INDEX idx_ideas_owner ON ideas(owner_user_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at);
CREATE INDEX idx_collaborations_project ON collaborations(project_id);
CREATE INDEX idx_collaborations_collaborator ON collaborations(collaborator_user_id);
CREATE INDEX idx_packages_is_active ON packages(is_active);
CREATE INDEX idx_billing_user ON billing(user_id);
CREATE INDEX idx_billing_status ON billing(status);
CREATE INDEX idx_billing_paid_at ON billing(paid_at);
CREATE INDEX idx_help_articles_category ON help_articles(category_id);
CREATE INDEX idx_help_articles_author ON help_articles(author_user_id);
CREATE INDEX idx_help_articles_is_published ON help_articles(is_published);
CREATE INDEX idx_help_articles_is_featured ON help_articles(is_featured);
CREATE INDEX idx_help_categories_is_active ON help_categories(is_active);
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX idx_landing_pages_is_active ON landing_pages(is_active);
CREATE INDEX idx_landing_pages_is_published ON landing_pages(is_published);

-- Add full-text search index for project titles and descriptions
CREATE INDEX idx_projects_search ON projects USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));



-- Add partial indexes for soft deletes to improve query performance
CREATE INDEX idx_projects_not_deleted ON projects(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_not_deleted ON users(id) WHERE deleted_at IS NULL;

-- TRIGGERS for automatic wallet credit updates and business logic

-- Function to update user wallet credits after transaction
CREATE OR REPLACE FUNCTION update_user_wallet_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- For purchase transactions, add credits to user wallet
  IF NEW.tx_type = 'purchase_credits' THEN
    UPDATE users 
    SET wallet_credits = wallet_credits + NEW.credits,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
  
  -- For reward spend transactions, subtract credits from user wallet
  ELSIF NEW.tx_type = 'reward_spend' THEN
    UPDATE users 
    SET wallet_credits = wallet_credits - NEW.credits,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user wallet after transaction insert
CREATE TRIGGER trigger_update_user_wallet_after_transaction
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_wallet_on_transaction();

-- Function to update user wallet credits after reward
CREATE OR REPLACE FUNCTION update_user_wallet_on_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- Substract credits from giver
  IF NEW.giver_user_id IS NOT NULL THEN
    UPDATE users 
    SET wallet_credits = wallet_credits - NEW.credits,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.giver_user_id;
  END IF;
  
  -- Add credits to recipient user if specified
  IF NEW.recipient_user_id IS NOT NULL THEN
    UPDATE users 
    SET wallet_credits = wallet_credits + NEW.credits,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.recipient_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user wallets after reward insert
CREATE TRIGGER trigger_update_user_wallet_after_reward
  AFTER INSERT ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_user_wallet_on_reward();

-- Function to prevent user from voting on their own project
CREATE OR REPLACE FUNCTION prevent_self_vote()
RETURNS TRIGGER AS $$
DECLARE
  project_owner INTEGER;
BEGIN
  SELECT owner_user_id INTO project_owner
  FROM projects
  WHERE id = NEW.project_id;
  
  IF project_owner = NEW.user_id THEN
    RAISE EXCEPTION 'User cannot vote on their own project';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent self voting
CREATE TRIGGER trigger_prevent_self_vote
  BEFORE INSERT OR UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION prevent_self_vote();

-- Function to ensure transaction integrity (user has enough credits for reward spending)
CREATE OR REPLACE FUNCTION validate_reward_transaction()
RETURNS TRIGGER AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current wallet balance of the giver
  SELECT wallet_credits INTO current_balance
  FROM users
  WHERE id = NEW.giver_user_id;
  
  -- Check if user has enough credits
  IF current_balance < NEW.credits THEN
    RAISE EXCEPTION 'Insufficient credits: user has % but needs %', current_balance, NEW.credits;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate reward transaction
CREATE TRIGGER trigger_validate_reward_transaction
  BEFORE INSERT ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION validate_reward_transaction();

-- Function to maintain updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at columns
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_payments_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- VIEWS for common queries and reporting (created after all tables and functions exist)

-- View for user project summary
CREATE VIEW user_project_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.name,
    u.user_type,
    COUNT(p.id) as total_projects,
    COUNT(CASE WHEN p.visibility = 'public' THEN 1 END) as public_projects,
    COUNT(CASE WHEN p.visibility = 'private' THEN 1 END) as private_projects
FROM users u
LEFT JOIN projects p ON u.id = p.owner_user_id AND p.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.name, u.user_type;

-- View for project vote summary
CREATE VIEW project_vote_summary AS
SELECT 
    p.id as project_id,
    p.title,
    p.description,
    u.name as owner_name,
    u.user_type as owner_type,
    COUNT(v.id) as total_votes,
    COALESCE(SUM(v.score), 0) as net_score,
    COUNT(CASE WHEN v.score = 1 THEN 1 END) as upvotes,
    COUNT(CASE WHEN v.score = -1 THEN 1 END) as downvotes,
    p.created_at as project_created_at
FROM projects p
JOIN users u ON p.owner_user_id = u.id
LEFT JOIN votes v ON p.id = v.project_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.title, p.description, u.name, u.user_type, p.created_at;

-- View for user wallet balances with transaction history
CREATE VIEW user_wallet_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.name,
    u.user_type,
    u.wallet_credits as current_balance,
    COALESCE(SUM(CASE WHEN t.tx_type = 'purchase_credits' THEN t.credits ELSE 0 END), 0) as total_credits_purchased,
    COALESCE(SUM(CASE WHEN t.tx_type = 'reward_spend' THEN t.credits ELSE 0 END), 0) as total_credits_spent
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.name, u.user_type;

-- View for project collaborators with user details
CREATE VIEW project_collaborators_detailed AS
SELECT 
    pc.project_id,
    p.title as project_title,
    pc.user_id,
    u.name as collaborator_name,
    u.email as collaborator_email,
    u.user_type as collaborator_type,
    pc.role,
    pc.joined_at
FROM project_collaborators pc
JOIN projects p ON pc.project_id = p.id
JOIN users u ON pc.user_id = u.id
WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL;

-- View for organization hierarchy
CREATE VIEW organization_hierarchy AS
SELECT 
    o.id as org_id,
    o.name as org_name,
    o.org_type,
    u.id as owner_id,
    u.name as owner_name,
    u.email as owner_email,
    COUNT(DISTINCT p.id) as projects_count,
    COUNT(DISTINCT u2.id) as total_users
FROM organizations o
LEFT JOIN users u ON o.owner_user_id = u.id
LEFT JOIN projects p ON o.id = p.organization_id
LEFT JOIN users u2 ON o.id = u2.organization_id
WHERE u.deleted_at IS NULL OR u.deleted_at IS NULL
GROUP BY o.id, o.name, o.org_type, u.id, u.name, u.email;

-- View for recent activities (messages, project updates, votes)
CREATE VIEW recent_activities AS
SELECT 
    'message' as activity_type,
    m.created_at as activity_time,
    m.project_id,
    p.title as project_title,
    m.user_id,
    u.name as user_name,
    SUBSTRING(m.body, 1, 100) as activity_detail
FROM messages m
JOIN projects p ON m.project_id = p.id
JOIN users u ON m.user_id = u.id
WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL

UNION ALL

SELECT 
    'project_created' as activity_type,
    p.created_at as activity_time,
    p.id as project_id,
    p.title as project_title,
    p.owner_user_id as user_id,
    u.name as user_name,
    'New project created' as activity_detail
FROM projects p
JOIN users u ON p.owner_user_id = u.id
WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL

UNION ALL

SELECT 
    'vote' as activity_type,
    v.created_at as activity_time,
    v.project_id,
    pr.title as project_title,
    v.user_id,
    u.name as user_name,
    CONCAT('Voted ', CASE WHEN v.score = 1 THEN 'up' ELSE 'down' END, ' on project') as activity_detail
FROM votes v
JOIN projects pr ON v.project_id = pr.id
JOIN users u ON v.user_id = u.id
WHERE pr.deleted_at IS NULL AND u.deleted_at IS NULL

ORDER BY activity_time DESC;

-- View for reward distribution tracking
CREATE VIEW reward_tracking AS
SELECT 
    r.id as reward_id,
    r.credits,
    r.reason,
    r.awarded_at,
    giver.id as giver_id,
    giver.name as giver_name,
    giver.user_type as giver_type,
    COALESCE(recipient.id, pr.owner_user_id) as recipient_id,
    COALESCE(recipient.name, project_owner.name) as recipient_name,
    COALESCE(recipient.user_type, project_owner.user_type) as recipient_type,
    pr.id as project_id,
    pr.title as project_title,
    t.id as transaction_id,
    t.tx_type as transaction_type
FROM rewards r
JOIN users giver ON r.giver_user_id = giver.id
LEFT JOIN users recipient ON r.recipient_user_id = recipient.id
LEFT JOIN projects pr ON r.project_id = pr.id
LEFT JOIN users project_owner ON pr.owner_user_id = project_owner.id
LEFT JOIN transactions t ON r.transaction_id = t.id
WHERE giver.deleted_at IS NULL;