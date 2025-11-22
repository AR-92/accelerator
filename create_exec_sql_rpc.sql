-- RPC Function to execute arbitrary SQL (use with extreme caution - only for development)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Execute the SQL and return success
  EXECUTE sql;
  RETURN jsonb_build_object('status', 'success', 'message', 'SQL executed successfully');
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error executing SQL: %', SQLERRM;
END;
$$;