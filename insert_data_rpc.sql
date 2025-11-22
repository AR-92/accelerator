-- RPC Function to insert data into a table dynamically
CREATE OR REPLACE FUNCTION insert_custom_data(table_name text, data_json jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  columns text[];
  values text[];
  sql_query text;
  result jsonb;
BEGIN
  -- Validate table name
  IF table_name !~ '^[a-zA-Z_][a-zA-Z0-9_]*$' THEN
    RAISE EXCEPTION 'Invalid table name: %', table_name;
  END IF;

  -- Extract columns and values from JSON
  SELECT array_agg(key), array_agg(value)
  INTO columns, values
  FROM jsonb_object_keys(data_json) AS k(key)
  CROSS JOIN LATERAL jsonb_extract_path_text(data_json, k.key) AS v(value);

  -- Build the INSERT query
  sql_query := 'INSERT INTO ' || quote_ident(table_name) || ' (' ||
               array_to_string(columns, ', ') || ') VALUES (' ||
               array_to_string(ARRAY(SELECT quote_literal(v) FROM unnest(values) AS v), ', ') || ') RETURNING *;';

  -- Execute the query and get the result
  EXECUTE sql_query INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error inserting data: %', SQLERRM;
END;
$$;

-- Example usage:
-- SELECT insert_custom_data('test_table', '{"name": "John Doe", "email": "john@example.com"}'::jsonb);