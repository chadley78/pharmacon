'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Cart } from '@/lib/types'

interface OrderSummaryProps {
  cart: Cart
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

      <div className="flow-root">
        <ul role="list" className="-my-6 divide-y divide-gray-200">
          {cart.items.map((item) => (
            <li key={item.id} className="flex py-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                {item.product?.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <Link href={`/products/${item.product?.slug}`}>
                        {item.product?.name}
                      </Link>
                    </h3>
                    <p className="ml-4">€{(item.product?.price || 0) * item.quantity}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>€{cart.total.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>€{cart.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/cart"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Edit Cart
        </Link>
      </div>
    </div>
  )
} 