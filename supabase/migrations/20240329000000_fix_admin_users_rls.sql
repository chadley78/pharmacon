-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert into admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete from admin_users" ON admin_users;
DROP POLICY IF EXISTS "First admin can bypass RLS" ON admin_users;
DROP POLICY IF EXISTS "Users can check their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON admin_users;

-- Create a simple policy that allows users to check their own admin status
CREATE POLICY "Users can check their own admin status"
ON admin_users FOR SELECT
USING (auth.uid() = user_id);

-- Create a policy that allows the first admin to manage the table
CREATE POLICY "First admin can manage admin_users"
ON admin_users FOR ALL
USING (user_id = 'facd9193-4716-48a6-8d52-9f0cc9a15abb')
WITH CHECK (user_id = 'facd9193-4716-48a6-8d52-9f0cc9a15abb'); 