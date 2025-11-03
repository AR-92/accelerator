# Pages Structure

This directory contains all the Handlebars template files organized by functionality:

## Directories

### `/account/`
- User account management pages
  - `/settings/` - Profile, password, and account settings
  - `/billing/` - Billing and payment history
  - `/payment/` - Payment methods management
  - `/subscriptions/` - Subscription management

### `/auth/`
- Authentication-related pages (login, signup, password reset)

### `/chat/`
- Communication and collaboration pages (team chat, AI chat)

### `/core/`
- Core application functionality
  - `upgrade-plan.hbs` - Subscription upgrade page

### `/content/`
- Content browsing and viewing pages
  - `browse-ideas.hbs` - Browse community ideas
  - `view-idea.hbs` - Detailed view of a single idea

### `/communication/`
- Communication and notification pages
  - `notifications.hbs` - User notifications
  - `ai-assistant.hbs` - AI assistant interface

### `/dashboard/`
- Dashboard pages for different sections

### `/error/`
- Error pages
  - `page-not-found.hbs` - 404 page

### `/ideas/`
- Idea management pages

### `/learning/`
- Learning and educational content
  - `courses.hbs` - Learning paths and courses

### `/portfolio/`
- User project portfolio pages

### `/projects/`
- Project management pages
  - `create-project.hbs` - New project creation page

### `/startup/`
- Startup building tools
  - `/build/` - Pages for building different aspects of startups
  - `/promote/` - Pages for promoting and marketing startups

## Naming Conventions

- File names use kebab-case for readability
- Pages are grouped by functionality in appropriately named directories
- Specific functionality pages are kept in their respective directories