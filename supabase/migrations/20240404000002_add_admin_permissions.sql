-- Add new permission columns to admin_users table
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS can_add_admins BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS can_delete_admins BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policies to consider these new permissions
DROP POLICY IF EXISTS "Admin users can manage admin users" ON admin_users;

CREATE POLICY "Admin users can manage admin users"
ON admin_users
FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM admin_users 
    WHERE can_add_admins = true OR can_delete_admins = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM admin_users 
    WHERE can_add_admins = true OR can_delete_admins = true
  )
);

-- Notify PostgREST to reload the schema
NOTIFY pgrst, 'reload schema'; 