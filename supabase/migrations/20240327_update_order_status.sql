-- First, remove the default value from the status column
ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;

-- Create a new enum type with all statuses
CREATE TYPE order_status_new AS ENUM (
  'processing',
  'packed',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- Update the orders table to use the new enum type
ALTER TABLE orders 
  ALTER COLUMN status TYPE order_status_new 
  USING status::text::order_status_new;

-- Drop the old enum type
DROP TYPE order_status;

-- Rename the new enum type to the original name
ALTER TYPE order_status_new RENAME TO order_status;

-- Add back the default value
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'processing'::order_status; 