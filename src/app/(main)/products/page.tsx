import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('name')
    .returns<Product[]>()

  // Group products by category
  const groupedProducts = products?.reduce((acc, product) => {
    const category = product.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const categoryTitles = {
    direct_purchase: 'Over-the-Counter Products',
    questionnaire_prescription: 'Prescription Products',
    doctor_consultation: 'Doctor Consultations'
  }

  const categoryOrder = [
    'questionnaire_prescription',
    'direct_purchase',
    'doctor_consultation',
  ];

  // Show skeletons if products are not loaded yet
  if (!products) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Products</h1>
      {groupedProducts && categoryOrder.map((category) => (
        groupedProducts[category] && (
          <div key={category} className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{categoryTitles[category as keyof typeof categoryTitles]}</h2>
            <div className="max-w-[320px] sm:max-w-none mx-auto sm:mx-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedProducts[category].map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
} 