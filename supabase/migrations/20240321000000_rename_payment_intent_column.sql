-- Rename stripe_payment_intent_id to payment_intent_id
ALTER TABLE orders RENAME COLUMN stripe_payment_intent_id TO payment_intent_id; 