-- Insert a sample questionnaire product
INSERT INTO products (
  id,
  name,
  slug,
  description,
  price,
  category,
  is_active
) VALUES (
  gen_random_uuid(),
  'Erectile Dysfunction Treatment',
  'ed-treatment',
  'Prescription medication for erectile dysfunction. Requires a short medical questionnaire to ensure safe and appropriate use.',
  49.99,
  'questionnaire_prescription',
  true
); 