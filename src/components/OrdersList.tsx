'use client'

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

export function OrdersList({ orders }: { orders: Order[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        You haven&apos;t placed any orders yet.
      </div>
    )
  }

  return (
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
  )
} 