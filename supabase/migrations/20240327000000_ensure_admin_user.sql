-- Ensure the admin user exists
INSERT INTO admin_users (user_id)
VALUES ('facd9193-4716-48a6-8d52-9f0cc9a15abb')
ON CONFLICT (user_id) DO NOTHING;

-- Add a policy to allow the first admin to bypass RLS for initial setup
CREATE POLICY "First admin can bypass RLS" ON admin_users
  FOR ALL
  USING (
    user_id = 'facd9193-4716-48a6-8d52-9f0cc9a15abb'
  ); 