import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetails from './ProductDetails'
import { Product } from '@/lib/types'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  return {
    title: `Product - ${params.slug}`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product as Product} />
} 