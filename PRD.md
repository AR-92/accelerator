# Accelerator Application - Product Requirements Document

## 1. Overview

**Product Name:** Accelerator  
**Version:** 1.0  
**Platform:** Web Application (Node.js + Express + Handlebars + Supabase)  
**Target Users:** Entrepreneurs, startup founders, business developers, students  
**Purpose:** AI-powered idea validation and business modeling platform with community voting

## 2. User Packages & Features

### 2.1 Package Tiers

#### Free Package

- **Features:** Vote on public ideas, view community content
- **Limitations:** Cannot create ideas, no portfolio access, limited dashboard
- **Credits:** 50 credits for voting rewards only

#### Student Package

- **Features:** Create ideas, complete models, generate reports, basic portfolio
- **Credits:** 500 credits for AI features
- **Price:** $9.99/month

#### Enterprise Package

- **Features:** All Student features + portfolio grouping, advanced analytics, team collaboration
- **Credits:** 2000 credits for AI features
- **Price:** $29.99/month

### 2.2 Credit System

- **AI Generations:** 10 credits per model section generation
- **Additional AI Features:** Random idea generation, auto-fill, chat assistance, and content improvement also deduct 10 credits per use
- **Report Generation:** 50 credits per report
- **Voting Rewards:** 5 credits total distributed per qualifying idea (shared among voters)
- **Credit Purchase:** Additional credits available for purchase
- **Integration:** Rewards tracked in `credit_transactions` table with types 'reward_given'/'reward_earned'
- **Credit Tracking:** Real-time balance monitoring with transaction history

## 3. Core Functionality

### 3.1 User Onboarding

**Post-Registration Flow:**

1. **Settings Page:** Avatar upload, profile details, package selection
2. **Credit Allocation:** Based on selected package
3. **Tutorial:** Guided introduction to platform features

**Profile Management:**

- `profiles` table extensible for: avatar_url, bio, location, website, social_links, preferences
- Settings stored in `user_settings` as key-value pairs for flexibility

### 3.2 Idea Management

- **Idea Creation:** Title, category, description, tags, privacy setting (public/private)
- **Random Idea Generation:** AI-powered ideation tool to generate complete idea concepts based on user input, including title, category, description, and tags
- **Auto-Fill Enhancement:** AI-assisted form completion that suggests or populates fields (e.g., description) based on existing inputs, deducting 10 credits per use
- **Privacy Control:** Public ideas allow community voting, private ideas restrict voting
- **Idea Exploration:** Browse public ideas with filtering/search
- **Idea Favoriting:** Personal tracking of interesting ideas
- **Idea Cards:** Display user avatar, username, created/last activity dates, completion percentage, overall status

### 3.3 Idea Validation Process

**Voting Mechanism:**

- **Eligibility:** Only public ideas can be voted on (private ideas hidden from public)
- **Rating System:** One upvote per user per idea (no downvotes)
- **Threshold:** Ideas need >3 average rating to unlock model progression
- **Notification:** Creator notified when threshold reached
- **Rewards:** 5 credits total distributed among voters of qualifying ideas
- **Private Sharing:** Users can share private idea links with specific audience for voting

### 3.4 Model Application System

**Progression Rules:**

- **Idea Model:** Always available first
- **Sequential Unlock:** Business → Financial → Legal → Marketing → Team → Funding
- **Validation Required:** >3 star rating needed to proceed beyond Idea model
- **AI Assistance:** Credit-based content generation
- **Chat-Based AI Assistance:** Temporary, per-question chat interface for model sections, allowing users to ask specific questions about section content with no persistent chat history, deducting 10 credits per interaction
- **Detailed Prompt Templates:** Pre-built Handlebars templates for each model section, incorporating dynamic variables to guide AI responses and ensure consistency
- **Additional AI Features:** Auto-fill for section forms, executive summary explanations, and content improvement tools, all costing 10 credits per use
- **Progress Tracking:** Section completion status

### 3.5 Portfolio Management (Enterprise Only)

- **Idea Grouping:** Organize related ideas into portfolios
- **Grouped Analytics:** Dashboard shows aggregated stats for portfolio groups
- **Team Collaboration:** Share portfolios with team members

### 3.6 Activity Logging

**Logged Events:**

- Idea creation/modification
- Model section completion
- Voting activity
- Rewards earned/spent
- Credit purchases
- Settings changes
- Package upgrades
- Portfolio operations (creation, updates, idea additions/removals, member management)

## 4. Database Schema Updates

### 4.1 Existing Tables (Already Implemented)

- `billing_history` - Subscription billing records
- `credit_packages` - Credit purchase packages
- `credit_transactions` - Detailed credit transaction history
- `ideas` - Idea storage with aggregate voting
- `notifications` - User notifications
- `packages` - Subscription package definitions
- `profiles` - Complete user profile data (name, avatar, role, package, credits, preferences)
- `rewards` - Reward system (to be integrated with voting)
- `user_settings` - Key-value user preferences

### 4.2 New Tables to Create

#### activity_log

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `action_type` (TEXT: idea_created/model_completed/vote_cast/reward_earned/credit_spent/portfolio_created/portfolio_updated/portfolio_idea_added/etc)
- `entity_type` (TEXT: idea/model/vote/report/credit/portfolio/etc)
- `entity_id` (UUID)
- `details` (JSONB)
- `created_at` (TIMESTAMP)

#### votes

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas)
- `user_id` (UUID, FK → auth.users)
- `created_at` (TIMESTAMP)
- UNIQUE(idea_id, user_id)

#### model_instances

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas, NULLABLE)
- `user_id` (UUID, FK → auth.users)
- `model_type` (TEXT: business/financial/funding/idea/legal/marketing/team)
- `status` (TEXT: draft/completed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### model_sections

- `id` (UUID, PK)
- `model_instance_id` (UUID, FK → model_instances)
- `section_name` (TEXT)
- `section_data` (JSONB) // Flexible storage for questions, answers, AI responses
- `is_completed` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### team_members

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `idea_id` (UUID, FK → ideas, NULLABLE)
- `name` (TEXT)
- `role` (TEXT)
- `email` (TEXT)
- `created_at` (TIMESTAMP)

#### reports

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas)
- `user_id` (UUID, FK → auth.users)
- `report_type` (TEXT: business-plan/pitch-deck/valuation)
- `report_data` (JSONB)
- `generated_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### portfolios

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `color` (TEXT, DEFAULT '#3B82F6') // Hex color for UI theming
- `is_default` (BOOLEAN, DEFAULT FALSE) // One default portfolio per user
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### portfolio_ideas

- `id` (UUID, PK)
- `portfolio_id` (UUID, FK → portfolios)
- `idea_id` (UUID, FK → ideas)
- `added_at` (TIMESTAMP)
- UNIQUE(portfolio_id, idea_id)

#### portfolio_members

- `id` (UUID, PK)
- `portfolio_id` (UUID, FK → portfolios)
- `user_id` (UUID, FK → auth.users)
- `role` (TEXT: owner/editor/viewer, DEFAULT 'viewer')
- `invited_by` (UUID, FK → auth.users)
- `invited_at` (TIMESTAMP)
- UNIQUE(portfolio_id, user_id)

### 4.3 Enhanced Existing Tables

#### ideas (modifications)

- Add: `privacy` (TEXT: public/private, DEFAULT 'public')
- Add: `validation_threshold_met` (BOOLEAN, DEFAULT FALSE)
- Add: `unlocked_models` (TEXT[], DEFAULT ARRAY['idea'])
- Add: `completion_percentage` (INTEGER, 0-100)
- Add: `overall_status` (TEXT: draft/in_progress/completed/reported)
- Change: `rating` DECIMAL(3,2) (for average calculations)
- Remove: `upvotes`, `downvotes` (replaced by `votes` table)

#### profiles (consolidated user data)

- Add: `name` (TEXT) // Username for idea cards and display
- Add: `avatar_url` (TEXT) // Profile picture URL from Supabase Storage
- Add: `package_type` (TEXT: free/student/enterprise) // User's current package
- Add: `package_status` (TEXT: active/cancelled) // Package subscription status
- Add: `package_started` (TIMESTAMP) // When package was activated
- Add: `package_expires` (TIMESTAMP) // When package expires
- Add: `credit_balance` (INTEGER) // Current credit balance
- Add: `total_earned` (INTEGER) // Total credits earned
- Add: `total_spent` (INTEGER) // Total credits spent
- Add: `last_credit_update` (TIMESTAMP) // Last credit transaction
- Add: `preferences` (JSONB) // UI preferences and settings

#### notifications (fix)

- Change: `user_id` from INTEGER to UUID (match auth.users)

#### credit_transactions (extend for rewards)

- Extend transaction_type to include: 'reward_given', 'reward_earned'
- Use existing `metadata` JSONB for reward details (idea_id, voter_id, etc.)
- `status` (TEXT: active/cancelled)
- `started_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 5. Updated User Journey

1. **Registration** → Package selection → Profile setup → Credit allocation
2. **Idea Creation** → Privacy setting → Basic details → Idea model access
3. **Community Validation** → Public voting → Rating threshold check
4. **Model Progression** → Sequential model unlocking → AI-assisted completion
5. **Report Generation** → Data aggregation → PDF download
6. **Portfolio Building** (Enterprise) → Idea grouping → Team collaboration
7. **Activity Review** → Comprehensive activity log → Analytics insights

## 6. Technical Requirements

### 5.1 Business Logic

- **Rating Threshold Check:** Automatic validation when idea reaches >3 stars
- **Model Unlock Logic:** Sequential progression based on package and validation
- **Credit Validation:** Pre-check before AI operations
- **Reward Distribution:** Automatic credit allocation to voters
- **Activity Logging:** Comprehensive audit trail for all user actions
- **AI Validation:** Pre-check credit validation for all AI features (generations, chat, auto-fill, random ideas) before processing requests

### 5.2 Performance Considerations

- **Real-time Updates:** Rating changes, credit balances, progress tracking
- **Caching Strategy:** Frequently accessed dashboard data
- **Background Jobs:** Report generation, reward distribution

### 5.7 Migration Strategy

**No Production Data:** Fresh implementation, no existing data to migrate

- Extend `profiles` table with package and credit fields (consolidated approach)
- Create all new tables with proper constraints
- Add new columns to existing tables (`ideas` completion fields)
- Remove obsolete columns (upvotes/downvotes from ideas)
- Set up indexes, triggers, and RLS policies
- Create database functions for completion calculations
- Create `idea_cards` view for efficient querying
- Populate initial data (credit packages, subscription packages)

### 5.8 Schema Design Decisions

**Consolidated Profiles Approach:**

- All user-related data (profile, packages, credits) in single `profiles` table
- Benefits: Simpler queries, centralized user management, reduced table joins
- Tradeoff: Less normalized schema, mixed concerns (profile vs business logic)

### 5.9 Idea Card Implementation

**Completion Calculation:**

- Based on completed model sections from completed model instances only
- Formula: (completed_sections / total_sections) \* 100
- Status progression: Draft → In Progress → Completed → Reported

**Display Fields:**

- User avatar and username from consolidated `profiles` table
- Created date and last activity timestamp
- Completion percentage (0-100%)
- Overall status with color-coded indicators
- Privacy status (public/private)

### 5.3 Final Database Schema

#### profiles (consolidated)

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `name` (TEXT)
- `avatar_url` (TEXT)
- `role` (TEXT)
- `package_type` (TEXT)
- `package_status` (TEXT)
- `package_started` (TIMESTAMP)
- `package_expires` (TIMESTAMP)
- `credit_balance` (INTEGER)
- `total_earned` (INTEGER)
- `total_spent` (INTEGER)
- `last_credit_update` (TIMESTAMP)
- `preferences` (JSONB)
- `created_at` (TIMESTAMP)

#### ideas

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `title` (TEXT)
- `category` (TEXT)
- `category_icon` (TEXT)
- `description` (TEXT)
- `tags` (TEXT[])
- `status` (TEXT: 'active'/'inactive')
- `slug` (TEXT, UNIQUE)
- `rating` (DECIMAL(3,2))
- `is_favorite` (BOOLEAN)
- `privacy` (TEXT: public/private, DEFAULT 'public')
- `validation_threshold_met` (BOOLEAN, DEFAULT FALSE)
- `unlocked_models` (TEXT[], DEFAULT ARRAY['idea'])
- `completion_percentage` (INTEGER, 0-100)
- `overall_status` (TEXT: draft/in_progress/completed/reported)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### votes

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas)
- `user_id` (UUID, FK → auth.users)
- `rating` (INTEGER, 1-5)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- UNIQUE(idea_id, user_id)

#### model_instances

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas, NULLABLE)
- `user_id` (UUID, FK → auth.users)
- `model_type` (TEXT: business/financial/funding/idea/legal/marketing/team)
- `status` (TEXT: draft/completed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### model_sections

- `id` (UUID, PK)
- `model_instance_id` (UUID, FK → model_instances)
- `section_name` (TEXT)
- `section_data` (JSONB) // Flexible storage for dynamic question structures and AI responses
- `is_completed` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### team_members

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `idea_id` (UUID, FK → ideas, NULLABLE)
- `name` (TEXT)
- `role` (TEXT)
- `email` (TEXT)
- `created_at` (TIMESTAMP)

#### reports

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas)
- `user_id` (UUID, FK → auth.users)
- `report_type` (TEXT: business-plan/pitch-deck/valuation)
- `report_data` (JSONB)
- `generated_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### notifications

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `type` (TEXT)
- `message` (TEXT)
- `is_read` (BOOLEAN)
- `created_at` (TIMESTAMP)

#### credit_transactions

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `transaction_type` (TEXT: credit_purchase, ai_generation, report_generation, reward_given, reward_earned)
- `amount` (INTEGER)
- `metadata` (JSONB)
- `status` (TEXT: active/cancelled)
- `started_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### activity_log

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `action_type` (TEXT: idea_created/model_completed/vote_cast/reward_earned/credit_spent/portfolio_created/portfolio_updated/portfolio_idea_added/etc)
- `entity_type` (TEXT: idea/model/vote/report/credit/portfolio/etc)
- `entity_id` (UUID)
- `details` (JSONB)
- `created_at` (TIMESTAMP)

#### voting_rewards

- `id` (UUID, PK)
- `idea_id` (UUID, FK → ideas)
- `voter_id` (UUID, FK → auth.users)
- `reward_amount` (INTEGER)
- `distributed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

#### portfolios

- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `color` (TEXT, DEFAULT '#3B82F6')
- `is_default` (BOOLEAN, DEFAULT FALSE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### portfolio_ideas

- `id` (UUID, PK)
- `portfolio_id` (UUID, FK → portfolios)
- `idea_id` (UUID, FK → ideas)
- `added_at` (TIMESTAMP)
- UNIQUE(portfolio_id, idea_id)

#### portfolio_members

- `id` (UUID, PK)
- `portfolio_id` (UUID, FK → portfolios)
- `user_id` (UUID, FK → auth.users)
- `role` (TEXT: owner/editor/viewer, DEFAULT 'viewer')
- `invited_by` (UUID, FK → auth.users)
- `invited_at` (TIMESTAMP)
- UNIQUE(portfolio_id, user_id)

#### idea_cards (view)

- Aggregated view combining ideas, profiles, and calculated completion data
- Includes username, avatar, completion percentage, overall status
- Filters for privacy (public ideas or user's own ideas)

### 5.4 Data Relationships

```
auth.users
├── profiles (1:1) // Consolidated user data, packages, credits
├── user_settings (1:many) // Additional preferences
├── billing_history (1:many) // Payment history
├── credit_transactions (1:many) // Detailed credit logs
├── rewards (1:many) // Reward system
├── notifications (1:many) // User notifications
├── portfolios (1:many) // User's portfolios
│   ├── portfolio_ideas (1:many) // Ideas in portfolio
│   │   └── ideas (many:1) // Referenced ideas
│   └── portfolio_members (1:many) // Team members
├── ideas (1:many) // User's ideas
│   ├── votes (1:many) // Votes on user's ideas
│   ├── model_instances (1:many) // Model applications
│   │   └── model_sections (1:many) // Section data
│   ├── team_members (1:many) // Team data
│   └── reports (1:many) // Generated reports
├── packages (subscription definitions)
├── activity_log (1:many) // Audit trail
└── votes (1:many, on other ideas) // User's votes
```

### 5.5 Indexes & Performance

- Primary keys on all tables
- Foreign key indexes on all FK columns
- Composite indexes: (user_id, created_at), (idea_id, model_type), (user_id, action_type)
- Portfolio indexes: (portfolios.user_id), (portfolio_ideas.portfolio_id), (portfolio_ideas.idea_id), (portfolio_members.portfolio_id), (portfolio_members.user_id)
- JSONB indexes on frequently queried fields in model_sections/report_data/activity_log.details

### 5.6 Security & Access Control

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Portfolio access: owners have full access, members have role-based permissions (owner/editor/viewer)
- Public read access for active public ideas and votes
- Authenticated users can vote on public ideas only

## 7. Technical Architecture

### 6.1 Backend

- **Framework:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI Service:** Integration with OpenAI/Anthropic
- **File Storage:** Supabase Storage for avatars and generated reports
- **Email Service:** For notifications (voting thresholds, rewards)

### 6.2 Frontend

- **Templates:** Handlebars
- **Styling:** Tailwind CSS
- **JavaScript:** Vanilla JS for interactions, including AI interactions like chat interfaces and form auto-fill triggers
- **File Upload:** Avatar and document uploads
- **Real-time Updates:** WebSocket or polling for live data

### 6.3 API Endpoints

- `GET/POST /api/auth` - Authentication
- `GET/POST /api/users/profile` - User profile management
- `GET/POST /api/packages` - Package management
- `GET/POST /api/ideas` - Idea CRUD
- `POST /api/votes` - Voting system
- `POST /api/models/:type` - Model instance creation
- `GET/PUT /api/models/:id/sections/:section` - Section data
- `GET /api/dashboard/stats` - Dashboard metrics
- `POST /api/reports/:type` - Report generation
- `GET /api/activity` - Activity log
- `POST /api/credits/purchase` - Credit purchases

## 8. Success Metrics

- User engagement: Daily/weekly active users
- Idea completion rate: % of ideas with completed models
- Report generation: Reports created per user
- User retention: 7-day/30-day retention rates
- Credit utilization: Average credits spent per user
- Voting participation: % of users who vote regularly
- Validation success rate: % of ideas passing >3 star threshold
