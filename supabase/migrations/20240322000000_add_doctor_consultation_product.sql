-- Insert a sample doctor consultation product
INSERT INTO products (
  name,
  slug,
  description,
  price,
  category,
  is_active,
  created_at,
  updated_at
) VALUES (
  'Online Doctor Consultation',
  'online-doctor-consultation',
  'Book a private online consultation with one of our registered doctors. Discuss your health concerns and get professional medical advice from the comfort of your home. Our doctors can provide prescriptions for eligible medications and offer guidance on treatment options.',
  49.99,
  'doctor_consultation',
  true,
  NOW(),
  NOW()
); 