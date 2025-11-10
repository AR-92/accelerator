# Database Migrations

This directory contains database migrations organized by feature for better scalability and maintainability.

## Organization

Migrations are grouped into subfolders by domain/feature:

- `content/` - Learning articles, help content, and related tables
- `user/` - User settings, credits, status, and admin activity logs
- `business/` - Startups, enterprises, and corporates tables
- `billing/` - Packages, billing transactions, and rewards
- `landing/` - Landing pages content

## Naming Convention

Migrations follow the pattern: `NNN_description.js`

- `NNN` - Sequential number within each subfolder (starting from 001)
- `description` - Brief, descriptive name in snake_case

## Creating New Migrations

1. Choose the appropriate subfolder based on the feature/domain
2. Find the next sequential number in that folder
3. Create a new migration file following the naming convention
4. Implement `up` and `down` methods for forward and rollback operations

## Migration Structure

Each migration exports an object with:

```javascript
module.exports = {
  up: async (db) => {
    // Forward migration logic
  },

  down: async (db) => {
    // Rollback logic
  },
};
```

## Running Migrations

Use the scripts in the `scripts/` folder:

- `run-migration.js` - Run all pending migrations
- `run-populate-migration.js` - Run data population migrations

## Best Practices

- Keep migrations focused on a single change
- Test rollback functionality
- Use transactions for multi-statement operations
- Document complex migrations with comments
- Avoid large data insertions in schema migrations (use separate population migrations)
