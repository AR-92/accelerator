#!/bin/bash

# Reset the database by dropping and recreating it

# Terminate any active connections to the database
echo "Terminating active connections..."
psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'accelerator_db' AND pid <> pg_backend_pid();"

# Drop the existing database
echo "Dropping existing database..."
dropdb -h localhost -p 5432 -U postgres --if-exists accelerator_db

# Create the new database
echo "Creating new database..."
createdb -h localhost -p 5432 -U postgres accelerator_db

echo "Database reset successfully!"

echo "Now running application migrations to set up schema..."
cd /home/rana/Documents/accelerator
npm run db:migrate