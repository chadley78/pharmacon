-- Check if out_for_delivery_at column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'out_for_delivery_at'
    ) THEN
        -- Add out_for_delivery_at column if it doesn't exist
        ALTER TABLE orders
        ADD COLUMN out_for_delivery_at TIMESTAMP WITH TIME ZONE;

        -- Add comment to explain the column
        COMMENT ON COLUMN orders.out_for_delivery_at IS 'Timestamp when the order was marked as out for delivery';
    END IF;
END $$; 