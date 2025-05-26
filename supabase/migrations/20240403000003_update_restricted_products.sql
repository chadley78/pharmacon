-- Update specific products to be restricted (requiring questionnaire)
UPDATE public.products
SET 
    category = 'restricted',
    requires_prescription = false
WHERE 
    name IN (
        'Viagra 100mg',
        'Cialis 20mg',
        'Sidena 100mg'
    ); 