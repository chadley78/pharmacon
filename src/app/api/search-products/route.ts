import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { ProductCategory } from '@/lib/types'

// Define the type for a product with rank
type ProductWithRank = {
  id: string
  name: string
  slug: string
  image_url: string | null
  price: number
  rank: number
}

export async function GET(request: NextRequest) {
  console.log('🔍 Search API called with URL:', request.url)
  const supabase = createRouteHandlerClient({ cookies })
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const categories = searchParams.getAll('category') as ProductCategory[]
  
  console.log('🔍 Search parameters:', { query, categories })

  // If no query and no categories, return empty results
  if ((!query || query.trim() === '') && categories.length === 0) {
    console.log('🔍 No search parameters provided, returning empty results')
    return NextResponse.json({ products: [] })
  }

  try {
    console.log('🔍 Executing search with params:', {
      search_term: query || null,
      categories: categories.length > 0 ? categories : null
    })

    const { data: products, error } = await supabase
      .rpc('search_products_with_rank', {
        search_term: query || null,
        categories: categories.length > 0 ? categories : null
      })

    if (error) {
      console.error('🔍 Search error:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code
      })
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: 500 }
      )
    }

    console.log('🔍 Search successful, found products:', {
      count: products?.length || 0,
      firstFewProducts: products?.slice(0, 3).map((p: ProductWithRank) => ({ id: p.id, name: p.name }))
    })

    // Remove the rank field from the response since it's only used for sorting
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productsWithoutRank = (products as ProductWithRank[] | null)?.map(({ rank: _, ...product }) => product) || []

    return NextResponse.json({ products: productsWithoutRank })
  } catch (error) {
    console.error('🔍 Unexpected error during search:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 