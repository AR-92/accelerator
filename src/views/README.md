# Views Directory Structure

This directory contains all the Handlebars (.hbs) template files organized by functional areas of the application. The structure follows the main sections of the application as they appear in the sidebar navigation.

## Directory Structure

```
views/
├── layouts/           # Main layout templates
│   ├── main.hbs       # Default application layout with sidebar
│   ├── settings.hbs   # Settings page layout
│   └── auth.hbs       # Authentication page layout
├── partials/          # Reusable UI components
│   ├── sidebar.hbs    # Main sidebar navigation
│   ├── settings-nav.hbs  # Settings navigation menu
│   └── subscription-nav.hbs  # Subscription navigation menu
├── dashboard/         # Dashboard pages and tabs
│   ├── dashboard.hbs  # Main dashboard (idea tab)
│   ├── dashboard-business.hbs
│   ├── dashboard-financial.hbs
│   ├── dashboard-marketing.hbs
│   ├── dashboard-fund.hbs
│   ├── dashboard-team.hbs
│   └── dashboard-promote.hbs
├── portfolio/         # Portfolio-related pages
│   ├── portfolio.hbs      # Portfolio listing page
│   └── portfolio-idea.hbs # Individual portfolio item page
├── chat/              # Chat and communication pages
│   └── chat.hbs       # Main chat interface
├── ideas/             # Idea management pages
│   └── ideas.hbs      # Ideas submission page
├── public/            # Public-facing pages
│   ├── auth/          # Authentication pages
│   │   ├── auth.hbs       # Login page
│   │   └── auth-signup.hbs # Signup page
│   └── 404.hbs        # Error page
├── ideas/             # Idea management pages
│   └── ideas.hbs      # Ideas submission page
├── startup/           # Startup building and promotion
│   ├── build/         # Business model development
│   │   ├── idea/          # Idea validation
│   │   │   └── idea-model.hbs
│   │   ├── business/      # Business model
│   │   │   └── business-model.hbs
│   │   ├── financial/     # Financial model
│   │   │   └── financial-model.hbs
│   │   ├── fund/          # Funding model
│   │   │   └── fund-model.hbs
│   │   ├── marketing/     # Marketing model
│   │   │   └── marketing-model.hbs
│   │   ├── team/          # Team model
│   │   │   └── team-model.hbs
│   │   └── legal/         # Legal framework
│   │       └── legal-model.hbs
│   └── promote/       # Marketing and promotion
│       ├── pitch-deck/    # Pitch deck
│       │   └── pitch-deck.hbs
│       ├── business-plan/ # Business plan
│       │   └── business-plan.hbs
│       └── valuation/     # Company valuation
│           └── valuation.hbs
├── account/           # Account management
│   ├── settings/      # Account settings
│   │   ├── profile.hbs
│   │   ├── password.hbs
│   │   ├── votes.hbs
│   │   └── rewards.hbs
│   ├── billing/       # Billing management
│   │   ├── index.hbs
│   │   └── history.hbs
│   ├── payment/       # Payment methods
│   │   ├── index.hbs
│   │   └── methods.hbs
│   ├── subscriptions/ # Subscription management
│   │   └── index.hbs
│   └── reports.hbs    # Analytics reports
└── README.md          # This documentation
```

## Route Mapping

The directory structure aligns with the application's route structure:

- `/pages/dashboard` → `views/dashboard/dashboard.hbs`
- `/pages/dashboard/tab/business` → `views/dashboard/dashboard-business.hbs`
- `/pages/portfolio` → `views/portfolio/portfolio.hbs`
- `/pages/ideas` → `views/ideas/ideas.hbs`
- `/pages/business-model` → `views/startup/build/business/business-model.hbs`
- `/pages/pitch-deck` → `views/startup/promote/pitch-deck/pitch-deck.hbs`
- `/pages/auth` → `views/public/auth/auth.hbs`
- `/pages/settings/profile` → `views/account/settings/profile.hbs`
- `/pages/subscriptions` → `views/account/subscriptions/index.hbs`
- `/pages/subscriptions/billing` → `views/account/billing/history.hbs`
- `/pages/subscriptions/payment` → `views/account/payment/methods.hbs`

## Layout Usage

Different pages use different layouts based on their purpose:
- Main application pages: `main` layout (includes sidebar)
- Settings pages: `settings` layout (includes settings navigation)
- Authentication pages: `auth` layout (minimal interface)

## Partials

Common UI components are stored as partials and can be included in any template:
- `{{> sidebar}}` - Main navigation sidebar
- `{{> settings-nav}}` - Settings menu navigation
- `{{> subscription-nav}}` - Subscription management navigation

## Adding New Pages

When adding new pages:
1. Place them in the appropriate subdirectory based on their function
2. Update routes in `routes/pages.js` to point to the correct file path
3. Ensure internal links use the correct `/pages/...` paths
4. Use the appropriate layout for the page type