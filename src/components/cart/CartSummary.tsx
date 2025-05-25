'use client'

import { LocalCartItem } from '@/stores/cartStore'

interface CartSummaryProps {
  items: LocalCartItem[]
  total: number
}

export default function CartSummary({ items = [], total }: CartSummaryProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <div className="mt-6">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    )
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      </div>

      <div className="px-6 py-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {item.product?.image_url && (
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product?.name || 'Product not available'}</p>
                <div className="mt-1 flex flex-col space-y-1">
                  {item.dosage && (
                    <p className="text-xs text-gray-500">Dosage: {item.dosage}mg</p>
                  )}
                  {item.tablet_count && (
                    <p className="text-xs text-gray-500">Tablets: {item.tablet_count}</p>
                  )}
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">
              €{((item.product?.price || 0) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-6 py-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">Subtotal ({itemCount} items)</p>
          <p className="font-medium text-gray-900">€{total.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium text-gray-900">Free</p>
        </div>

        <div className="flex items-center justify-between text-base font-medium text-gray-900 pt-4 border-t border-gray-200">
          <p>Total</p>
          <p>€{total.toFixed(2)}</p>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Shipping and taxes calculated at checkout.
        </p>
      </div>
    </div>
  )
} 