-- Create the search_products_with_rank RPC function
CREATE OR REPLACE FUNCTION search_products_with_rank(search_term TEXT)
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
    AND p.fts_document_vector @@ plainto_tsquery('english', search_term)
  ORDER BY rank DESC;
END;
$$; 