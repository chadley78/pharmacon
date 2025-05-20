import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type OrderItem = {
  id: string
  quantity: number
  price_at_time: number
  product: {
    name: string
  }
}

type Order = {
  id: string
  created_at: string
  total: number
  status: 'pending_payment' | 'paid' | 'failed'
  order_items: OrderItem[]
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

    if (!orders || orders.length === 0) {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-6">Order History</h1>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
            You haven&apos;t placed any orders yet.
          </div>
        </div>
      )
    }

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">€{order.total.toFixed(2)}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending_payment'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Items</h3>
                  <ul className="space-y-2">
                    {order.order_items.map((item: OrderItem) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span>{item.product?.name || 'Unknown Product'} × {item.quantity}</span>
                        <span>€{(item.price_at_time * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
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