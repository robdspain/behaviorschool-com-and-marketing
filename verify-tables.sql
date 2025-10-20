-- Verify that all required tables were created successfully

SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('checkout_access', 'checkout_access_logs', 'checkout_settings')
ORDER BY table_name;

