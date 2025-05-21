-- Drop the existing unique constraint if it exists
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Add the new unique constraint that includes dosage and tablet_count
ALTER TABLE cart_items ADD CONSTRAINT cart_items_user_id_product_id_dosage_tablet_count_key 
UNIQUE(user_id, product_id, dosage, tablet_count); 