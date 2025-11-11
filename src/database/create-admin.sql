-- Simple admin user creation for accelerator platform

-- First, insert the admin user directly
INSERT INTO users (email, password_hash, first_name, last_name, name, user_type, organization_id, wallet_credits, status, banned, ban_reason, banned_reason, banned_at, theme, bio, created_at, updated_at)
VALUES ('admin@accelerator.com', '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu', 'Admin', 'User', 'Admin User', 'admin', NULL, 10000, 'active', false, NULL, NULL, NULL, 'default', 'Administrator of the platform', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Output to confirm creation
SELECT 'Admin user created successfully with email admin@accelerator.com and initial wallet_credits 10000';