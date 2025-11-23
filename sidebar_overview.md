# Sidebar Pages Overview

This document provides an overview of all pages accessible via the admin sidebar, organized by section.

## Main Section
- **Dashboard** (`/admin/dashboard`) - Main overview and analytics
- **Todos** (`/admin/todos`) - Task management
- **Tables** (`/admin/tables`) - Data table views
- **Users** (`/admin/users`) - User management
- **Ideas** (`/admin/ideas`) - Idea submission and management
- **Votes** (`/admin/votes`) - Voting system
- **Collaborations** (`/admin/collaborations`) - Collaboration tools

## Content Management Section
- **Content** (`/admin/content`) - Content creation and editing
- **Landing Page** (`/admin/landing-page`) - Landing page management

## System Section
- **System Health** (`/admin/system-health`) - System monitoring and health checks
- **Notifications** (`/admin/notifications`) - Notification management
- **Activity Log** (`/admin/activity`) - System activity logging
- **Tables** (`/admin/tables`) - Data table views (duplicate from main)
- **Todos** (`/admin/todos`) - Task management (duplicate from main)
- **Settings** (`/admin/settings`) - System configuration

## Business Section
- **Business Model** (`/admin/business-model`) - Business model documentation
- **Business Plan** (`/admin/business-plan`) - Business planning tools
- **Financial Model** (`/admin/financial-model`) - Financial modeling
- **PitchDeck** (`/admin/pitchdeck`) - Pitch deck creation
- **Valuation** (`/admin/valuation`) - Company valuation tools
- **Funding** (`/admin/funding`) - Funding management
- **Team** (`/admin/team`) - Team management
- **Legal** (`/admin/legal`) - Legal document management
- **Marketing** (`/admin/marketing`) - Marketing tools
- **Corporate** (`/admin/corporate`) - Corporate governance
- **Enterprises** (`/admin/enterprises`) - Enterprise management

## Learning Section
- **Learning Content** (`/admin/learning-content`) - Educational content management
- **Learning Categories** (`/admin/learning-categories`) - Content categorization
- **Learning Assessments** (`/admin/learning-assessments`) - Assessment tools
- **Learning Analytics** (`/admin/learning-analytics`) - Learning data analysis

## Projects Section
- **Messages** (`/admin/messages`) - Project messaging
- **Project Collaborators** (`/admin/project-collaborators`) - Collaborator management
- **Calendar** (`/admin/calendar`) - Project scheduling

## Help Section
- **Help Center** (`/admin/help-center`) - User support and documentation

## Financial Section
- **Packages** (`/admin/packages`) - Package/subscription management
- **Billing** (`/admin/billing`) - Billing and invoicing
- **Rewards** (`/admin/rewards`) - Reward system management

## Notes
- Some pages appear in multiple sections (e.g., Tables and Todos in both Main and System)
- Each section is conditionally displayed based on the `currentSection` variable
- All pages use Handlebars templates located in `views/admin/`