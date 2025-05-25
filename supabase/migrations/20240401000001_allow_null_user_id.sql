-- Allow null values for user_id in orders table
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to allow guest orders
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR  -- Authenticated user creating their own order
    (user_id IS NULL AND guest_email IS NOT NULL)  -- Guest checkout
  );

-- Ensure RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY; 