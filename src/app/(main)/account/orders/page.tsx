import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { OrdersList } from '@/components/OrdersList'

type Order = {
  id: string
  created_at: string
  total: number
  status: 'pending_payment' | 'paid' | 'failed'
  order_items: {
    id: string
    quantity: number
    price_at_time: number
    product: {
      name: string
    }
  }[]
}

export default async function OrdersPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?redirect=/account/orders')
  }

  try {
    // First, let's check if we can fetch orders at all
    const { data: ordersData, error: ordersError, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    console.log('Orders count:', count)
    console.log('Orders data sample:', ordersData?.[0])
    console.log('Orders error:', ordersError)

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      throw ordersError
    }

    // Now fetch the full order details
    const { data: orders, error: detailedOrdersError } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total,
        status,
        order_items (
          id,
          quantity,
          price_at_time,
          product:products (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .returns<Order[]>()

    console.log('Detailed orders error:', detailedOrdersError)
    console.log('First order sample:', orders?.[0])

    if (detailedOrdersError) {
      console.error('Error fetching detailed orders:', detailedOrdersError)
      throw detailedOrdersError
    }

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        <Suspense fallback={
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }>
          <OrdersList orders={orders || []} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Detailed error in OrdersPage:', error)
    return (
      <div className="text-red-600">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="font-medium">Error loading orders</p>
          <p className="text-sm mt-2">There was a problem loading your orders. Please try again later.</p>
          {error instanceof Error && (
            <p className="text-xs mt-2 text-red-500">{error.message}</p>
          )}
        </div>
      </div>
    )
  }
} 