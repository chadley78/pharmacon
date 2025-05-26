-- Add popularity column to products table
ALTER TABLE public.products
ADD COLUMN popularity INTEGER NOT NULL DEFAULT 0;

-- Create an index on popularity for faster sorting
CREATE INDEX idx_products_popularity ON public.products(popularity DESC);

-- Add a comment to explain the column
COMMENT ON COLUMN public.products.popularity IS 'Tracks how popular a product is based on views and purchases. Higher numbers indicate more popular products.'; 