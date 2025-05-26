'use client'

import { LocalCartItem } from '@/stores/cartStore'
import { ProductImage } from '@/components/common/ProductImage'

interface CartSummaryProps {
  items: LocalCartItem[]
  subtotal: number
  shipping: number
  total: number
}

export default function CartSummary({ items, subtotal = 0, shipping = 0, total = 0 }: CartSummaryProps) {
  if (!items || items.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-gray-500 text-center">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flow-root">
        <ul role="list" className="-my-6 divide-y divide-gray-200">
          {items.map((item) => {
            const itemPrice = item.product?.price || 0
            const itemQuantity = item.quantity || 1
            const itemTotal = itemPrice * itemQuantity

            return (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {item.product ? (
                    <ProductImage 
                      product={item.product}
                      size="sm"
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.product?.name || 'Product not available'}</h3>
                      <p className="ml-4">€{itemTotal.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.dosage || 0}mg - {item.tablet_count || 0} tablets
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {itemQuantity}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>€{Number(subtotal).toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Shipping</p>
          <p>€{Number(shipping).toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Total</p>
          <p>€{Number(total).toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
      </div>
    </div>
  )
} 