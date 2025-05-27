import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Suspense } from 'react'
import ProductsList from '@/components/admin/ProductsList'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Product } from '@/lib/types'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect('/login')
  }

  // Use admin client to check if user is an admin
  const adminClient = createAdminClient()
  const { data: adminData, error: adminError } = await adminClient
    .from('admin_users')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (adminError || !adminData) {
    redirect('/')
  }

  // Fetch all products
  const { data: products, error: productsError } = await adminClient
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('Error fetching products:', productsError)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-red-600">Error loading products. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your store&apos;s products and inventory.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductsList products={products as Product[]} />
        </Suspense>
      </div>
    </div>
  )
} 