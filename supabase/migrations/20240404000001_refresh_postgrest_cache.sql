-- Create temporary table to store existing admin users
CREATE TEMP TABLE temp_admin_users AS 
SELECT id, user_id, created_at FROM admin_users;

-- Drop and recreate the admin_users table
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Restore existing admin users with default role
INSERT INTO admin_users (id, user_id, role, created_at)
SELECT id, user_id, 'admin', created_at
FROM temp_admin_users;

-- Drop temporary table
DROP TABLE temp_admin_users;

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin client to manage admin users
DROP POLICY IF EXISTS "Admin client can manage admin users" ON admin_users;
CREATE POLICY "Admin client can manage admin users"
ON admin_users
FOR ALL
USING (true)
WITH CHECK (true);

-- Notify PostgREST to refresh its schema cache
NOTIFY pgrst, 'reload schema'; 