-- Add more products to each category
INSERT INTO products (id, name, slug, description, price, category, is_active, image_url) VALUES
-- Direct Purchase Products (Over-the-Counter)
(
  gen_random_uuid(),
  'Vitamin C 1000mg',
  'vitamin-c-1000mg',
  'High-strength Vitamin C tablets for immune support. Contains 1000mg of Vitamin C per tablet. Suitable for daily use.',
  14.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Omega-3 Fish Oil 1000mg',
  'omega-3-fish-oil-1000mg',
  'Pure fish oil capsules containing 1000mg of Omega-3 fatty acids. Supports heart and brain health.',
  19.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Probiotic Complex',
  'probiotic-complex',
  'Advanced probiotic supplement with 10 billion CFU per capsule. Supports gut health and digestion.',
  24.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Magnesium 400mg',
  'magnesium-400mg',
  'High-absorption magnesium tablets. Supports muscle function and energy production.',
  12.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Zinc 15mg',
  'zinc-15mg',
  'Essential mineral supplement. Supports immune function and skin health.',
  9.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Iron 14mg',
  'iron-14mg',
  'Gentle iron supplement. Helps maintain healthy blood and energy levels.',
  11.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'B Complex',
  'b-complex',
  'Complete B vitamin complex. Supports energy metabolism and nervous system health.',
  16.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Calcium + Vitamin D',
  'calcium-vitamin-d',
  'Combined calcium and vitamin D supplement. Supports bone health and strength.',
  15.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'CoQ10 100mg',
  'coq10-100mg',
  'High-strength CoQ10 supplement. Supports heart health and energy production.',
  29.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Turmeric Curcumin',
  'turmeric-curcumin',
  'Premium turmeric extract with black pepper. Supports joint health and inflammation response.',
  22.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Green Tea Extract',
  'green-tea-extract',
  'Concentrated green tea supplement. Rich in antioxidants and supports metabolism.',
  18.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Melatonin 3mg',
  'melatonin-3mg',
  'Natural sleep aid supplement. Helps regulate sleep cycles and improve sleep quality.',
  13.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),

-- Doctor Consultation Products
(
  gen_random_uuid(),
  'General Health Check',
  'general-health-check',
  'Comprehensive online health consultation. Get a full health assessment and personalized advice from our experienced doctors.',
  59.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Women''s Health Consultation',
  'womens-health-consultation',
  'Specialized consultation focusing on women''s health concerns. Discuss reproductive health, hormonal issues, and general wellbeing.',
  69.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Men''s Health Consultation',
  'mens-health-consultation',
  'Specialized consultation for men''s health concerns. Discuss sexual health, prostate health, and general wellbeing.',
  69.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Weight Management Consultation',
  'weight-management-consultation',
  'Personalized consultation for weight management. Get expert advice on diet, exercise, and lifestyle changes.',
  79.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Diabetes Management',
  'diabetes-management',
  'Specialized consultation for diabetes management. Get expert advice on blood sugar control and lifestyle management.',
  89.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Hypertension Consultation',
  'hypertension-consultation',
  'Expert consultation for blood pressure management. Get personalized advice on lifestyle changes and medication.',
  79.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Thyroid Health Consultation',
  'thyroid-health-consultation',
  'Specialized consultation for thyroid disorders. Get expert advice on managing thyroid conditions.',
  84.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Sleep Disorder Consultation',
  'sleep-disorder-consultation',
  'Expert consultation for sleep issues. Get personalized advice on improving sleep quality and managing sleep disorders.',
  74.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Nutrition Consultation',
  'nutrition-consultation',
  'Expert consultation for dietary needs. Get personalized nutrition advice and meal planning guidance.',
  69.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Allergy Consultation',
  'allergy-consultation',
  'Specialized consultation for allergy management. Get expert advice on identifying triggers and managing symptoms.',
  64.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Sports Medicine Consultation',
  'sports-medicine-consultation',
  'Expert consultation for sports-related injuries and performance. Get personalized advice on recovery and prevention.',
  89.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
),

-- Questionnaire Prescription Products
(
  gen_random_uuid(),
  'Birth Control Pills',
  'birth-control-pills',
  'Prescription contraceptive medication. Requires medical questionnaire to ensure safe and appropriate use.',
  29.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Migraine Treatment',
  'migraine-treatment',
  'Prescription medication for migraine prevention and treatment. Requires medical questionnaire for safe use.',
  45.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Anxiety Medication',
  'anxiety-medication',
  'Prescription medication for anxiety management. Requires medical questionnaire and approval.',
  39.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Sleep Medication',
  'sleep-medication',
  'Prescription sleep aid medication. Requires medical questionnaire to ensure safe use.',
  34.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Blood Pressure Medication',
  'blood-pressure-medication',
  'Prescription medication for blood pressure management. Requires medical questionnaire and approval.',
  42.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Cholesterol Medication',
  'cholesterol-medication',
  'Prescription medication for cholesterol management. Requires medical questionnaire and approval.',
  44.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Diabetes Medication',
  'diabetes-medication',
  'Prescription medication for diabetes management. Requires medical questionnaire and approval.',
  47.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Thyroid Medication',
  'thyroid-medication',
  'Prescription medication for thyroid disorders. Requires medical questionnaire and approval.',
  36.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Asthma Medication',
  'asthma-medication',
  'Prescription medication for asthma management. Requires medical questionnaire and approval.',
  39.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Allergy Medication',
  'allergy-medication',
  'Prescription medication for severe allergies. Requires medical questionnaire and approval.',
  32.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
),
(
  gen_random_uuid(),
  'Pain Management',
  'pain-management',
  'Prescription medication for chronic pain management. Requires medical questionnaire and approval.',
  49.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
); 