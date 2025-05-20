-- Add questionnaire_approval_id column to cart_items
ALTER TABLE cart_items
ADD COLUMN questionnaire_approval_id UUID REFERENCES questionnaire_approvals(id) ON DELETE SET NULL;

-- Add a check constraint to ensure questionnaire_approval_id is set for questionnaire products
CREATE OR REPLACE FUNCTION check_questionnaire_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- If the product is a questionnaire product, require a questionnaire_approval_id
  IF EXISTS (
    SELECT 1 FROM products 
    WHERE id = NEW.product_id 
    AND category = 'questionnaire_prescription'
  ) THEN
    IF NEW.questionnaire_approval_id IS NULL THEN
      RAISE EXCEPTION 'Questionnaire approval is required for questionnaire prescription products';
    END IF;
    
    -- Verify the approval exists and is approved
    IF NOT EXISTS (
      SELECT 1 FROM questionnaire_approvals
      WHERE id = NEW.questionnaire_approval_id
      AND status = 'approved'
      AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Invalid or unapproved questionnaire approval';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce the constraint
CREATE TRIGGER enforce_questionnaire_approval
BEFORE INSERT OR UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION check_questionnaire_approval(); 