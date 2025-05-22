'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton'
import { SearchBar } from '@/components/ui/SearchBar'

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchQuery = searchParams.get('q') || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        let query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true)

        if (searchQuery) {
          query = query.textSearch('fts_document_vector', searchQuery, {
            type: 'plain',
            config: 'english'
          })
        }

        const { data, error } = await query
          .order('category')
          .order('name')

        if (error) throw error
        setProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery])

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
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <SearchBar className="w-full sm:w-64" />
      </div>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : !products?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? `No products found matching "${searchQuery}"`
              : 'No products available'}
          </p>
        </div>
      ) : (
        groupedProducts && categoryOrder.map((category) => (
          groupedProducts[category] && groupedProducts[category].length > 0 && (
            <div key={category} className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                {categoryTitles[category as keyof typeof categoryTitles]}
              </h2>
              <div className="max-w-[320px] sm:max-w-none mx-auto sm:mx-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedProducts[category].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        ))
      )}
    </div>
  )
} 