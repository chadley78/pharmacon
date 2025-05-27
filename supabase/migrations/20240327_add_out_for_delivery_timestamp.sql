-- Add out_for_delivery_at column to orders table
ALTER TABLE orders
ADD COLUMN out_for_delivery_at TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the column
COMMENT ON COLUMN orders.out_for_delivery_at IS 'Timestamp when the order was marked as out for delivery'; 