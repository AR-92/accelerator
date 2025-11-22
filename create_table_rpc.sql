-- RPC Function to create a table dynamically (use with caution)
CREATE OR REPLACE FUNCTION create_custom_table(table_name text, columns_definition text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sql_query text;
BEGIN
  -- Validate table name (basic check)
  IF table_name !~ '^[a-zA-Z_][a-zA-Z0-9_]*$' THEN
    RAISE EXCEPTION 'Invalid table name: %', table_name;
  END IF;

  -- Build the CREATE TABLE query
  sql_query := 'CREATE TABLE IF NOT EXISTS ' || quote_ident(table_name) || ' (' || columns_definition || ');';

  -- Execute the query
  EXECUTE sql_query;

  RETURN 'Table ' || table_name || ' created successfully';
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating table: %', SQLERRM;
END;
$$;

-- Example usage:
-- SELECT create_custom_table('test_table', 'id SERIAL PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW()');