-- Create the consultation_requests table
CREATE TABLE consultation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  customer_details JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('submitted', 'pending', 'approved', 'rejected', 'completed')) DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consultation requests"
ON consultation_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultation requests"
ON consultation_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create an index on user_id for faster lookups
CREATE INDEX consultation_requests_user_id_idx ON consultation_requests(user_id);

-- Create an index on status for filtering
CREATE INDEX consultation_requests_status_idx ON consultation_requests(status);

-- Add a trigger to update the updated_at timestamp
CREATE TRIGGER set_consultation_requests_updated_at
  BEFORE UPDATE ON consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 