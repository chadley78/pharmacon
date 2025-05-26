-- First, delete all consultation requests that reference products
DELETE FROM public.consultation_requests;

-- Then delete all questionnaire approvals that reference products
DELETE FROM public.questionnaire_approvals;

-- Then delete all order items that reference products
DELETE FROM public.order_items;

-- Then delete all orders (if they exist)
DELETE FROM public.orders;

-- Now we can safely delete all products
DELETE FROM public.products;

-- Reset all sequences if they exist
ALTER SEQUENCE IF EXISTS products_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS orders_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS questionnaire_approvals_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS consultation_requests_id_seq RESTART WITH 1;

-- Insert male products
INSERT INTO public.products (
    name,
    slug,
    description,
    price,
    image_url,
    category,
    is_active,
    sku,
    manufacturer,
    requires_prescription,
    stock_quantity,
    dosage_instructions,
    side_effects,
    ingredients,
    storage_instructions,
    expiry_warning_days,
    gender
) VALUES
-- ED Medications
(
    'Viagra 100mg',
    'viagra-100mg',
    'Sildenafil 100mg tablets for erectile dysfunction. Take 30-60 minutes before sexual activity.',
    89.99,
    '/images/viagra.jpg',
    'prescription',
    true,
    'VIAG-100-30',
    'Pfizer',
    true,
    100,
    'Take one tablet 30-60 minutes before sexual activity. Do not take more than one tablet per day.',
    'Common side effects include headache, flushing, and nasal congestion. Seek medical attention if you experience chest pain or vision changes.',
    'Sildenafil Citrate 100mg',
    'Store at room temperature (15-30°C) in a dry place. Keep out of reach of children.',
    365,
    'male'
),
(
    'Cialis 20mg',
    'cialis-20mg',
    'Tadalafil 20mg tablets for erectile dysfunction. Can be taken daily or as needed.',
    94.99,
    '/images/cialis.jpg',
    'prescription',
    true,
    'CIAL-20-30',
    'Lilly',
    true,
    100,
    'Take one tablet daily or 30 minutes before sexual activity. Do not take more than one tablet per day.',
    'Common side effects include headache, back pain, and muscle aches. Seek medical attention if you experience chest pain or vision changes.',
    'Tadalafil 20mg',
    'Store at room temperature (15-30°C) in a dry place. Keep out of reach of children.',
    365,
    'male'
),
(
    'Sidena 100mg',
    'sidena-100mg',
    'Generic sildenafil tablets for erectile dysfunction. Take 30-60 minutes before sexual activity.',
    49.99,
    '/images/sidena.jpg',
    'restricted',
    true,
    'SIDE-100-30',
    'Various',
    false,
    75,
    'Take one tablet 30-60 minutes before sexual activity. Do not take more than one tablet per day.',
    'Common side effects include headache, flushing, and nasal congestion. Seek medical attention if you experience chest pain or vision changes.',
    'Sildenafil Citrate 100mg',
    'Store at room temperature (15-30°C) in a dry place. Keep out of reach of children.',
    365,
    'male'
),
-- Premature Ejaculation
(
    'Priligy 30mg',
    'priligy-30mg',
    'Dapoxetine tablets for premature ejaculation. Take 1-3 hours before sexual activity.',
    59.99,
    '/images/priligy.jpg',
    'prescription',
    true,
    'PRIL-30-6',
    'Menarini',
    true,
    50,
    'Take one tablet 1-3 hours before sexual activity. Do not take more than one tablet per day.',
    'Common side effects include nausea, headache, and dizziness. Do not take with alcohol.',
    'Dapoxetine 30mg',
    'Store at room temperature (15-30°C) in a dry place. Keep out of reach of children.',
    365,
    'male'
),
-- Hair Loss Treatment
(
    'Finasteride 1mg',
    'finasteride-1mg',
    'Oral medication for male pattern hair loss. Take daily.',
    39.99,
    '/images/finasteride.jpg',
    'prescription',
    true,
    'FINA-1-30',
    'Various',
    true,
    100,
    'Take one tablet daily with or without food.',
    'May cause decreased libido, erectile dysfunction, and breast tenderness. Not for use by women.',
    'Finasteride 1mg',
    'Store at room temperature (15-30°C). Keep out of reach of children and women.',
    365,
    'male'
),
(
    'Minoxidil 5%',
    'minoxidil-5',
    'Topical solution for male pattern hair loss. Apply twice daily.',
    29.99,
    '/images/minoxidil.jpg',
    'direct_purchase',
    true,
    'MINO-5-60',
    'Various',
    false,
    150,
    'Apply 1ml to affected area twice daily. Massage gently.',
    'May cause scalp irritation, itching, or unwanted hair growth in other areas.',
    'Minoxidil 5%',
    'Store at room temperature (15-30°C). Keep out of reach of children.',
    365,
    'male'
);

-- Insert female products
INSERT INTO public.products (
    name,
    slug,
    description,
    price,
    image_url,
    category,
    is_active,
    sku,
    manufacturer,
    requires_prescription,
    stock_quantity,
    dosage_instructions,
    side_effects,
    ingredients,
    storage_instructions,
    expiry_warning_days,
    gender
) VALUES
-- Emergency Contraception
(
    'Levonorgestrel 1.5mg',
    'levonorgestrel-1-5mg',
    'Emergency contraceptive pill for use within 72 hours of unprotected intercourse.',
    24.99,
    '/images/levonorgestrel.jpg',
    'restricted',
    true,
    'LEVO-1.5-1',
    'Various',
    false,
    50,
    'Take one tablet as soon as possible, within 72 hours of unprotected intercourse.',
    'May cause nausea, headache, and irregular bleeding. Not for regular contraception.',
    'Levonorgestrel 1.5mg',
    'Store at room temperature (15-30°C). Keep out of reach of children.',
    365,
    'female'
),
(
    'ellaOne 30mg',
    'ellaone-30mg',
    'Emergency contraceptive pill for use within 120 hours of unprotected intercourse.',
    34.99,
    '/images/ellaone.jpg',
    'restricted',
    true,
    'ELLA-30-1',
    'HRA Pharma',
    false,
    50,
    'Take one tablet as soon as possible, within 120 hours of unprotected intercourse.',
    'May cause headache, nausea, and irregular bleeding. Not for regular contraception.',
    'Ulipristal Acetate 30mg',
    'Store at room temperature (15-30°C). Keep out of reach of children.',
    365,
    'female'
),
-- Regular Contraception
(
    'Microgynon 30',
    'microgynon-30',
    'Combined oral contraceptive pill containing ethinylestradiol and levonorgestrel.',
    14.99,
    '/images/microgynon.jpg',
    'prescription',
    true,
    'MICR-30-21',
    'Bayer',
    true,
    100,
    'Take one tablet daily for 21 days, followed by a 7-day break.',
    'May cause mood changes, breast tenderness, and breakthrough bleeding. Increased risk of blood clots.',
    'Ethinylestradiol 30mcg, Levonorgestrel 150mcg',
    'Store at room temperature (15-30°C). Keep out of reach of children.',
    365,
    'female'
),
(
    'Cerazette 75mcg',
    'cerazette-75mcg',
    'Progestogen-only contraceptive pill containing desogestrel.',
    16.99,
    '/images/cerazette.jpg',
    'prescription',
    true,
    'CERZ-75-28',
    'Organon',
    true,
    100,
    'Take one tablet daily without a break.',
    'May cause irregular bleeding, breast tenderness, and mood changes.',
    'Desogestrel 75mcg',
    'Store at room temperature (15-30°C). Keep out of reach of children.',
    365,
    'female'
),
(
    'Depo-Provera 150mg/ml',
    'depo-provera-150mg',
    'Injectable contraceptive providing protection for 12 weeks.',
    39.99,
    '/images/depo-provera.jpg',
    'prescription',
    true,
    'DEPO-150-1',
    'Pfizer',
    true,
    30,
    'One injection every 12 weeks by healthcare professional.',
    'May cause irregular bleeding, weight gain, and delayed return to fertility.',
    'Medroxyprogesterone Acetate 150mg/ml',
    'Store in refrigerator (2-8°C). Do not freeze.',
    365,
    'female'
),
(
    'Norethisterone 5mg',
    'norethisterone-5mg',
    'Progestogen tablet for delaying periods or treating heavy menstrual bleeding.',
    19.99,
    '/images/norethisterone.jpg',
    'prescription',
    true,
    'NOR-5-30',
    'Various',
    true,
    75,
    'Take one tablet three times daily as prescribed.',
    'May cause irregular bleeding, breast tenderness, and mood changes.',
    'Norethisterone 5mg',
    'Store at room temperature (15-30°C). Keep out of reach of children.',
    365,
    'female'
);

-- Insert unisex products
INSERT INTO public.products (
    name,
    slug,
    description,
    price,
    image_url,
    category,
    is_active,
    sku,
    manufacturer,
    requires_prescription,
    stock_quantity,
    dosage_instructions,
    side_effects,
    ingredients,
    storage_instructions,
    expiry_warning_days,
    gender
) VALUES
(
    'Vitamin D3 1000IU',
    'vitamin-d3-1000iu',
    'High-strength Vitamin D3 supplements for bone health and immune support.',
    19.99,
    '/images/vitamin-d.jpg',
    'direct_purchase',
    true,
    'VITD-1000-90',
    'Nature Made',
    false,
    200,
    'Take one tablet daily with food.',
    'Very few side effects. May cause nausea in high doses.',
    'Vitamin D3 (Cholecalciferol) 1000IU, Cellulose, Magnesium Stearate',
    'Store in a cool, dry place. Keep out of direct sunlight.',
    730,
    'either'
),
(
    'Omega-3 Fish Oil 1000mg',
    'omega-3-fish-oil-1000mg',
    'Pure fish oil supplements for heart health and joint support.',
    24.99,
    '/images/fish-oil.jpg',
    'direct_purchase',
    true,
    'OMG3-1000-60',
    'Nordic Naturals',
    false,
    150,
    'Take two softgels daily with meals.',
    'May cause fishy aftertaste or mild digestive upset.',
    'Fish Oil (EPA 180mg, DHA 120mg), Vitamin E, Gelatin, Glycerin',
    'Store in a cool, dry place. Refrigerate after opening.',
    365,
    'either'
);

-- Update the full-text search vector for all products
UPDATE products
SET fts_document_vector = to_tsvector('english', 
    name || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(manufacturer, '') || ' ' || 
    COALESCE(ingredients, '')
); 