-- Add requires_prescription column to products table
ALTER TABLE public.products
ADD COLUMN requires_prescription BOOLEAN NOT NULL DEFAULT false;

-- Update existing products to set requires_prescription based on category
UPDATE public.products
SET requires_prescription = true
WHERE category IN ('doctor_consultation', 'questionnaire_prescription');

-- Add comment to explain the field
COMMENT ON COLUMN public.products.requires_prescription IS 'Indicates whether this product requires a prescription or consultation'; 