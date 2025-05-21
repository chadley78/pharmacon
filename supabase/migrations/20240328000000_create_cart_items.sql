-- Create cart_items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  questionnaire_approval_id UUID REFERENCES questionnaire_approvals(id) ON DELETE SET NULL,
  dosage INTEGER,
  tablet_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Add unique constraint that includes dosage and tablet_count
  UNIQUE(user_id, product_id, dosage, tablet_count)
);

-- Add RLS policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart items
CREATE POLICY "Users can view their own cart items"
ON cart_items FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items"
ON cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items"
ON cart_items FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items"
ON cart_items FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX cart_items_user_id_idx ON cart_items(user_id);
CREATE INDEX cart_items_product_id_idx ON cart_items(product_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 