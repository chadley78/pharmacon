-- Update RLS policies for questionnaire_approvals
DROP POLICY IF EXISTS "Users can create their own questionnaire approvals" ON public.questionnaire_approvals;
DROP POLICY IF EXISTS "Users can view their own questionnaire approvals" ON public.questionnaire_approvals;

CREATE POLICY "Enable insert for authenticated users and guests"
ON public.questionnaire_approvals FOR INSERT
WITH CHECK (
  -- Allow authenticated users to create their own approvals
  (auth.uid() = user_id) OR
  -- Allow guest submissions with email
  (user_id IS NULL AND guest_email IS NOT NULL)
);

CREATE POLICY "Enable select for authenticated users and guests"
ON public.questionnaire_approvals FOR SELECT
USING (
  -- Allow authenticated users to view their own approvals
  (auth.uid() = user_id) OR
  -- Allow guests to view their own approvals by email
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

-- Update RLS policies for orders
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) OR  -- Authenticated users can create their own orders
  (user_id IS NULL AND guest_email IS NOT NULL)  -- Guests can create orders with email
);

CREATE POLICY "Users can view orders"
ON public.orders FOR SELECT
USING (
  (auth.uid() = user_id) OR  -- Authenticated users can view their own orders
  (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')  -- Guests can view by email
);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.questionnaire_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY; 