# PostgreSQL Database Setup for Accelerator Application

This document explains how to set up and use the PostgreSQL database for the Accelerator application with all relations, views, and triggers.

## Database Schema Overview

The database consists of the following main entities:
- **Users**: Authentication and user profiles with different types (student, startup, enterprise, corporate)
- **Organizations**: Corporate/Enterprise/Startup hierarchy
- **Projects**: Projects owned by users or organizations
- **Votes**: User votes on projects
- **Transactions**: Credit purchases and spending
- **Rewards**: Distribution of credits to users/projects
- **Project Collaborators**: Many-to-many relationship between users and projects
- **Tasks**: Project tasks with assignment
- **Messages**: Project chat and collaboration

## Prerequisites

- PostgreSQL 12 or higher installed and running
- `psql` command-line tool available

## Database Setup Instructions

### 1. Create the Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create the database
CREATE DATABASE accelerator_db;

# Create a user for the application (optional but recommended)
CREATE USER accelerator_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE accelerator_db TO accelerator_user;

# Connect to the new database
\c accelerator_db;

# If creating for application user, grant schema privileges
GRANT ALL ON SCHEMA public TO accelerator_user;

# Exit psql
\q
```

### 2. Apply the Database Schema

```bash
# Apply the schema to create tables, constraints, indexes, views, and triggers
psql -U postgres -d accelerator_db -f database-schema.sql
```

### 3. (Optional) Load Sample Data

```bash
# Load sample data for testing
psql -U postgres -d accelerator_db -f sample-data.sql
```

### 4. Test the Database

```bash
# Run tests to verify the database functionality
psql -U postgres -d accelerator_db -f test-database.sql
```

## Key Features Implemented

### 1. Data Types and Constraints
- PostgreSQL-specific data types (SERIAL, TIMESTAMP, VARCHAR with lengths)
- Custom ENUM types for user_type, org_type, visibility, task_status, transaction_type
- Comprehensive CHECK constraints to ensure data integrity
- Email format validation
- Credit constraints (non-negative values)
- Card number and date validation

### 2. Relations
- Proper foreign key constraints with CASCADE and SET NULL behaviors
- Referential integrity enforced at database level

### 3. Indexes
- Performance indexes on frequently queried columns
- Composite indexes for common query patterns
- Full-text search index for project titles and descriptions
- Partial indexes for soft deletes

### 4. Views
- `user_project_summary`: Aggregated project statistics per user
- `project_vote_summary`: Vote statistics per project
- `user_wallet_summary`: Credit balance and transaction history per user
- `project_collaborators_detailed`: Project collaboration details
- `organization_hierarchy`: Organization structure with statistics
- `recent_activities`: Timeline of recent activities (messages, projects, votes)
- `reward_tracking`: Detailed tracking of credit rewards

### 5. Triggers
- Automatic wallet credit updates on transactions
- Automatic wallet credit updates on rewards
- Prevention of self-voting on projects
- Validation of sufficient credits before rewards
- Automatic updated_at timestamp maintenance

## Important Business Rules Enforced

1. **Voting**: Users cannot vote on their own projects (enforced by trigger)
2. **Credits**: Users cannot spend more credits than they have (enforced by trigger)
3. **Data Integrity**: Various CHECK constraints ensure valid data
4. **Wallet Updates**: Automatic credit balance updates when transactions and rewards occur

## Usage Examples

### Query user project summary:
```sql
SELECT * FROM user_project_summary WHERE user_id = 1;
```

### Get project vote statistics:
```sql
SELECT * FROM project_vote_summary WHERE project_id = 1;
```

### Check user wallet balance:
```sql
SELECT * FROM user_wallet_summary WHERE user_id = 1;
```

### View recent activities:
```sql
SELECT * FROM recent_activities LIMIT 20;
```

## Security Considerations

- Payment method information stores only provider IDs and minimal metadata
- Full PCI compliance depends on proper application-level handling
- Passwords should be properly hashed before insertion
- Use application-level permissions in addition to database constraints

## Maintenance

- Regular backup of the database is recommended
- Monitor indexes performance and add/remove as needed
- Consider partitioning for large tables if needed in production
- Use the views for most reporting needs for optimized queries