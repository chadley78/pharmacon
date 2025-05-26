'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton'
import { SearchBar } from '@/components/ui/SearchBar'

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'category' | 'popularity'

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'category', label: 'Category' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
] as const

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchQuery = searchParams.get('q') || ''
  const sortBy = (searchParams.get('sort') as SortOption) || 'popularity'

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSort)
    router.push(`/products?${params.toString()}`)
  }

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

        // Apply sorting
        switch (sortBy) {
          case 'popularity':
            query = query.order('popularity', { ascending: false })
            break
          case 'price_asc':
            query = query.order('price', { ascending: true })
            break
          case 'price_desc':
            query = query.order('price', { ascending: false })
            break
          case 'name_asc':
            query = query.order('name', { ascending: true })
            break
          case 'name_desc':
            query = query.order('name', { ascending: false })
            break
          case 'category':
          default:
            query = query
              .order('category', { ascending: true })
              .order('name', { ascending: true })
            break
        }

        const { data, error } = await query

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
  }, [searchQuery, sortBy])

  // Group products by category
  const groupedProducts = products?.reduce((acc, product) => {
    // Combine restricted products with direct_purchase into "Over-the-Counter Products"
    const displayCategory = product.category === 'restricted' ? 'direct_purchase' : product.category
    if (!acc[displayCategory]) {
      acc[displayCategory] = []
    }
    acc[displayCategory].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const categoryTitles = {
    direct_purchase: 'Over-the-Counter Products',
    prescription: 'Prescription Products'
  }

  const categoryOrder = [
    'prescription',
    'direct_purchase'
  ]

  // Group products by category only when sorting by category
  const displayProducts: Record<string, Product[]> = sortBy === 'category' 
    ? (groupedProducts || {})
    : { all: products || [] }

  const displayCategories = sortBy === 'category' 
    ? categoryOrder 
    : ['all']

  const getCategoryTitle = (category: string) => {
    if (category === 'all') return 'All Products'
    return categoryTitles[category as keyof typeof categoryTitles]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
          <SearchBar className="w-full sm:w-64" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="block w-full sm:w-48 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
              : 'No products available'}
          </p>
        </div>
      ) : (
        displayCategories.map((category) => {
          const categoryProducts = displayProducts[category]
          return categoryProducts && categoryProducts.length > 0 && (
            <div key={category} className="mb-8 sm:mb-12">
              {sortBy === 'category' && (
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                  {getCategoryTitle(category)}
                </h2>
              )}
              <div className="max-w-[320px] sm:max-w-none mx-auto sm:mx-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
} 