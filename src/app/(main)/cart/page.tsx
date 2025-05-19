'use client'

import { useCart } from '@/lib/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-gray-500 mb-8">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="space-y-8">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center py-6 border-b border-gray-200">
                {/* Product Image */}
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

                {/* Product Details */}
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
                      €{item.product?.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:text-gray-700"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-2 text-gray-600 hover:text-gray-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0 lg:col-span-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">€{cart.total.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">€{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
              >
                Proceed to Checkout
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/products"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 