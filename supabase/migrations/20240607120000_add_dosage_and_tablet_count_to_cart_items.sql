-- Add dosage and tablet_count columns to cart_items
ALTER TABLE cart_items ADD COLUMN dosage INTEGER;
ALTER TABLE cart_items ADD COLUMN tablet_count INTEGER; 