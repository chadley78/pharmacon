'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Product, ProductCategory } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton'
import { SearchBar } from '@/components/ui/SearchBar'
import { useRouter } from 'next/navigation'

const ITEMS_PER_PAGE = 9 // 3 columns of 3 items each

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'category'

const sortOptions = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'category', label: 'Category' }
] as const

export function SearchResults() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchQuery = searchParams.get('q') || ''
  const sortBy = (searchParams.get('sort') as SortOption) || 'category'
  const currentPage = Number(searchParams.get('page')) || 1
  const selectedCategories = useMemo(() => 
    new Set(searchParams.getAll('category') as ProductCategory[]),
    [searchParams]
  )
  const router = useRouter()

  // Create a stable Supabase client instance
  const supabase = useMemo(() => createClient(), [])

  const categoryTitles: Record<ProductCategory, string> = {
    direct_purchase: 'Over-the-Counter Products',
    questionnaire_prescription: 'Prescription Products',
    doctor_consultation: 'Doctor Consultations'
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handleCategoryChange = (category: ProductCategory) => {
    const params = new URLSearchParams(searchParams.toString())
    const newCategories = new Set(selectedCategories)
    
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    
    // Update URL with new categories and reset to page 1
    params.delete('category')
    params.delete('page')
    newCategories.forEach(cat => params.append('category', cat))
    router.push(`/search?${params.toString()}`)
  }

  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSort)
    params.delete('page') // Reset to page 1 when sorting changes
    router.push(`/search?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/search?${params.toString()}`)
  }

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      if (!isMounted) return
      
      console.log('🔍 Search component - Starting search with params:', {
        searchQuery,
        selectedCategories: Array.from(selectedCategories),
        sortBy,
        currentPage,
        itemsPerPage: ITEMS_PER_PAGE
      })
      
      setLoading(true)
      setError(null)
      
      try {
        // First, get the total count
        let countQuery = supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)

        if (selectedCategories.size > 0) {
          const categories = Array.from(selectedCategories)
          console.log('🔍 Search component - Filtering by categories:', categories)
          countQuery = countQuery.in('category', categories)
        }

        if (searchQuery) {
          console.log('🔍 Search component - Adding text search for query:', searchQuery)
          countQuery = countQuery.textSearch('fts_document_vector', searchQuery, {
            type: 'plain',
            config: 'english'
          })
        }

        console.log('🔍 Search component - Executing count query')
        const { count, error: countError } = await countQuery

        if (countError) {
          console.error('🔍 Search component - Count query error:', {
            error: countError,
            errorMessage: countError.message,
            errorDetails: countError.details,
            errorHint: countError.hint,
            errorCode: countError.code
          })
          throw countError
        }
        
        console.log('🔍 Search component - Count query successful:', { count })
        if (isMounted) {
          setTotalCount(count || 0)
        }

        // Then fetch the paginated results with sorting
        let query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true)

        if (selectedCategories.size > 0) {
          const categories = Array.from(selectedCategories)
          query = query.in('category', categories)
        }

        if (searchQuery) {
          query = query.textSearch('fts_document_vector', searchQuery, {
            type: 'plain',
            config: 'english'
          })
        }

        // Apply sorting at the database level
        console.log('🔍 Search component - Applying sort:', sortBy)
        switch (sortBy) {
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
            query = query
              .order('category', { ascending: true })
              .order('name', { ascending: true })
            break
        }

        const rangeStart = (currentPage - 1) * ITEMS_PER_PAGE
        const rangeEnd = currentPage * ITEMS_PER_PAGE - 1
        console.log('🔍 Search component - Fetching products with range:', { rangeStart, rangeEnd })
        
        const { data, error } = await query
          .range(rangeStart, rangeEnd)

        if (error) {
          console.error('🔍 Search component - Products query error:', {
            error,
            errorMessage: error.message,
            errorDetails: error.details,
            errorHint: error.hint,
            errorCode: error.code
          })
          throw error
        }
        
        console.log('🔍 Search component - Products query successful:', {
          count: data?.length || 0,
          firstFewProducts: data?.slice(0, 3).map(p => ({ id: p.id, name: p.name }))
        })
        
        if (isMounted) {
          setProducts(data)
        }
      } catch (err) {
        console.error('🔍 Search component - Unexpected error:', {
          error: err,
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        })
        if (isMounted) {
          setError('Failed to load products. Please try again later.')
        }
      } finally {
        if (isMounted) {
          console.log('🔍 Search component - Search complete, setting loading to false')
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      console.log('🔍 Search component - Cleanup: unmounting')
      isMounted = false
    }
  }, [searchQuery, selectedCategories, supabase, sortBy, currentPage])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Search Results</h1>
        <div className="max-w-xl mb-4">
          <SearchBar 
            placeholder="Search products..."
            className="w-full"
            debounceMs={500}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-4 flex-grow">
            {(Object.entries(categoryTitles) as [ProductCategory, string][]).map(([category, title]) => (
              <label
                key={category}
                className="inline-flex items-center px-3 py-2 rounded-full border cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  backgroundColor: selectedCategories.has(category) ? 'rgb(250 204 21 / 0.1)' : 'transparent',
                  borderColor: selectedCategories.has(category) ? 'rgb(250 204 21)' : 'rgb(229 231 235)'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="sr-only"
                />
                <span className="text-sm font-medium" style={{ color: selectedCategories.has(category) ? 'rgb(161 98 7)' : 'rgb(55 65 81)' }}>
                  {title}
                </span>
              </label>
            ))}
          </div>
          <div className="flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                searchQuery={searchParams.get('q') || ''}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-fuchsia-600 text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          )}

          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} products
          </div>
        </>
      )}
    </>
  )
} 