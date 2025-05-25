-- Add guest_email column to orders table
ALTER TABLE public.orders
ADD COLUMN guest_email TEXT;

-- Update RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Allow users to create orders with their user_id or as guests with email
CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) OR  -- Authenticated users can create their own orders
  (user_id IS NULL AND guest_email IS NOT NULL)  -- Guests can create orders with email
);

-- Allow users to view their own orders or guest orders by email
CREATE POLICY "Users can view orders"
ON public.orders FOR SELECT
USING (
  (auth.uid() = user_id) OR  -- Authenticated users can view their own orders
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')  -- Guests can view by email
);

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY; 