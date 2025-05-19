import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'direct_purchase')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Over-the-Counter Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
} 