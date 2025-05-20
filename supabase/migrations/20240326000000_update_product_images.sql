-- Update product images with category-specific images
UPDATE products
SET image_url = CASE
  -- Over-the-Counter Products (Medicine bottles/pills)
  WHEN category = 'direct_purchase' AND slug = 'ibuprofen-200mg' THEN
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
  WHEN category = 'direct_purchase' AND slug = 'paracetamol-500mg' THEN
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
  WHEN category = 'direct_purchase' AND slug = 'vitamin-d3-1000iu' THEN
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop'
  
  -- Prescription Products (Medical consultation/healthcare)
  WHEN category = 'questionnaire_prescription' AND slug = 'ed-treatment' THEN
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
  WHEN category = 'questionnaire_prescription' AND slug = 'hair-loss-treatment' THEN
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
  WHEN category = 'questionnaire_prescription' AND slug = 'acne-treatment' THEN
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
  
  -- Doctor Consultations (Doctor/medical professional)
  WHEN category = 'doctor_consultation' AND slug = 'online-doctor-consultation' THEN
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
  WHEN category = 'doctor_consultation' AND slug = 'mental-health-consultation' THEN
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
  WHEN category = 'doctor_consultation' AND slug = 'skin-condition-consultation' THEN
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop'
  
  ELSE image_url
END; 