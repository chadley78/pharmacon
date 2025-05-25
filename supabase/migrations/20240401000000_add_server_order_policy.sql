-- Add a policy to allow server-side API routes to create orders
CREATE POLICY "Server can create orders"
ON public.orders FOR INSERT
WITH CHECK (
  -- Allow server-side API routes to create orders
  (auth.jwt() ->> 'role' = 'service_role') OR
  -- Keep existing policies
  (auth.uid() = user_id) OR
  (user_id IS NULL AND guest_email IS NOT NULL)
);

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY; 