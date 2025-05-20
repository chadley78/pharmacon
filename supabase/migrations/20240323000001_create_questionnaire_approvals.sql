-- Create the questionnaire_approvals table
CREATE TABLE questionnaire_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  questionnaire_answers JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending_approval', 'approved', 'rejected')) DEFAULT 'pending_approval',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE questionnaire_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own questionnaire approvals"
ON questionnaire_approvals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own questionnaire approvals"
ON questionnaire_approvals FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX questionnaire_approvals_user_id_idx ON questionnaire_approvals(user_id);
CREATE INDEX questionnaire_approvals_status_idx ON questionnaire_approvals(status);

-- Add a trigger to update the updated_at timestamp
CREATE TRIGGER set_questionnaire_approvals_updated_at
  BEFORE UPDATE ON questionnaire_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 