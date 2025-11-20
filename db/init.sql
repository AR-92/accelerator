-- Database initialization script for Accelerator Boilerplate

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on completed status for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- Insert sample data (optional)
INSERT INTO todos (title, description, completed) VALUES
  ('Welcome to Accelerator', 'This is your first todo item!', false),
  ('Explore the features', 'Check out the HTMX interactions and Tailwind styling', false),
  ('Customize the boilerplate', 'Add your own models, controllers, and views', false)
ON CONFLICT DO NOTHING;