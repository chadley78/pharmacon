-- First, set all female products to direct_purchase and not requiring prescription
UPDATE public.products
SET 
    category = 'direct_purchase',
    requires_prescription = false
WHERE 
    gender = 'female';

-- Then, update the specific prescription-required products
UPDATE public.products
SET 
    category = 'prescription',
    requires_prescription = true
WHERE 
    gender = 'female' 
    AND name IN (
        'Levonorgestrel 1.5mg',
        'Microgynon 30',
        'Cerazette 75mcg',
        'Depo-Provera 150mg/ml',
        'Norethisterone 5mg',
        'Vagifem 10mcg',
        'Ovestin 1mg',
        'Trimethoprim 200mg',
        'Nitrofurantoin 100mg',
        'Clotrimazole Pessary 500mg'
    ); 