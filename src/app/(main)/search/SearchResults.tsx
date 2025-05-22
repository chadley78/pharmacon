'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton'
import { SearchBar } from '@/components/ui/SearchBar'

export function SearchResults() {
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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Search Results</h1>
        <div className="max-w-xl">
          <SearchBar 
            placeholder="Search products..."
            className="w-full"
            debounceMs={500}
          />
        </div>
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
              : 'Enter a search term to find products'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
} 