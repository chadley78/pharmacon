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
  const supabase = createRouteHandlerClient({ cookies })
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const categories = searchParams.getAll('category') as ProductCategory[]

  // If no query and no categories, return empty results
  if ((!query || query.trim() === '') && categories.length === 0) {
    return NextResponse.json({ products: [] })
  }

  try {
    const { data: products, error } = await supabase
      .rpc('search_products_with_rank', {
        search_term: query || null,
        categories: categories.length > 0 ? categories : null
      })

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: 500 }
      )
    }

    // Remove the rank field from the response since it's only used for sorting
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productsWithoutRank = (products as ProductWithRank[] | null)?.map(({ rank: _, ...product }) => product) || []

    return NextResponse.json({ products: productsWithoutRank })
  } catch (error) {
    console.error('Unexpected error during search:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 