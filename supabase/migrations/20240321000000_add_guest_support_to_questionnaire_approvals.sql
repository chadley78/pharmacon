-- First, drop the existing foreign key constraint
ALTER TABLE public.questionnaire_approvals
DROP CONSTRAINT IF EXISTS questionnaire_approvals_user_id_fkey;

-- Make user_id nullable and add guest_email column
ALTER TABLE public.questionnaire_approvals
ALTER COLUMN user_id DROP NOT NULL,
ADD COLUMN guest_email TEXT;

-- Add a new foreign key constraint that allows NULL values
ALTER TABLE public.questionnaire_approvals
ADD CONSTRAINT questionnaire_approvals_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own questionnaire approvals" ON public.questionnaire_approvals;
DROP POLICY IF EXISTS "Users can view their own questionnaire approvals" ON public.questionnaire_approvals;

-- Create new policies that handle both authenticated and guest users
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

-- Ensure RLS is enabled
ALTER TABLE public.questionnaire_approvals ENABLE ROW LEVEL SECURITY; 