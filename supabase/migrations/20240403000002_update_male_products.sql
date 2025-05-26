-- First, set all male products to direct_purchase and not requiring prescription
UPDATE public.products
SET 
    category = 'direct_purchase',
    requires_prescription = false
WHERE 
    gender = 'male';

-- Then, update the specific prescription-required products
UPDATE public.products
SET 
    category = 'prescription',
    requires_prescription = true
WHERE 
    gender = 'male' 
    AND name IN (
        'Priligy 30mg',
        'EMLA Cream 5%',
        'Finasteride 1mg',
        'Minoxidil 5%'
    ); 