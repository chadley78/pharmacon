-- Insert example products for each category
INSERT INTO products (id, name, slug, description, price, category, is_active, image_url) VALUES
-- Over-the-Counter Products
(
  '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  'Ibuprofen 200mg',
  'ibuprofen-200mg',
  'Fast-acting pain relief tablets. Contains 200mg ibuprofen per tablet. Suitable for headaches, muscle pain, and fever.',
  5.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
  'Paracetamol 500mg',
  'paracetamol-500mg',
  'Effective pain relief and fever reduction. Contains 500mg paracetamol per tablet. Suitable for adults and children over 12.',
  4.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
  'Vitamin D3 1000IU',
  'vitamin-d3-1000iu',
  'Supports bone health and immune function. Contains 1000IU of Vitamin D3 per tablet. Suitable for daily use.',
  12.99,
  'direct_purchase',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),

-- Prescription Products (Questionnaire Required)
(
  '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
  'ED Treatment',
  'ed-treatment',
  'Prescription medication for erectile dysfunction. Requires medical questionnaire and approval. Contains 100mg sildenafil per tablet.',
  49.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
  'Hair Loss Treatment',
  'hair-loss-treatment',
  'Prescription medication for male pattern baldness. Requires medical questionnaire and approval. Contains 1mg finasteride per tablet.',
  39.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
  'Acne Treatment',
  'acne-treatment',
  'Prescription medication for moderate to severe acne. Requires medical questionnaire and approval. Contains 20mg isotretinoin per capsule.',
  59.99,
  'questionnaire_prescription',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),

-- Doctor Consultations
(
  '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
  'Online Doctor Consultation',
  'online-doctor-consultation',
  'Book a video consultation with a qualified doctor. Discuss your health concerns and receive professional medical advice.',
  49.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
  'Mental Health Consultation',
  'mental-health-consultation',
  'Book a video consultation with a mental health professional. Discuss your mental wellbeing and receive expert guidance.',
  79.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
),
(
  '9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
  'Skin Condition Consultation',
  'skin-condition-consultation',
  'Book a video consultation with a dermatologist. Get expert advice on skin conditions and treatment options.',
  69.99,
  'doctor_consultation',
  true,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
); 