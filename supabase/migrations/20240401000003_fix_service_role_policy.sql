-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create orders" ON orders;

-- Create a new policy that includes service role access
CREATE POLICY "Users and service role can create orders" ON orders
  FOR INSERT
  WITH CHECK (
    (auth.jwt() ->> 'role' = 'service_role') OR  -- Allow service role
    (auth.uid() = user_id) OR  -- Authenticated user creating their own order
    (user_id IS NULL AND guest_email IS NOT NULL)  -- Guest checkout
  );

-- Ensure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY; 