DROP FUNCTION get_table_schema(text);

CREATE OR REPLACE FUNCTION get_table_schema(tbl_name text)
RETURNS TABLE(column_name text, data_type text, is_nullable text, column_default text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_name = tbl_name
    AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
END;
$$; 
