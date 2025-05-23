-- Create the search_products_with_rank RPC function
CREATE OR REPLACE FUNCTION search_products_with_rank(
  search_term TEXT,
  categories TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  rank FLOAT4
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.image_url,
    p.price,
    ts_rank_cd(p.fts_document_vector, plainto_tsquery('english', search_term)) as rank
  FROM products p
  WHERE 
    p.is_active = true
    AND (search_term IS NULL OR p.fts_document_vector @@ plainto_tsquery('english', search_term))
    AND (categories IS NULL OR p.category = ANY(categories))
  ORDER BY rank DESC NULLS LAST, p.name;
END;
$$; 