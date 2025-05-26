'use client'

import { useCartStore } from '@/stores/cartStore'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCartStore()
  const router = useRouter()

  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Shopping Cart</h1>
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            {/* Cart items */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Items ({items.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>
                </div>
                
                <ul role="list" className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.product_id)}
                      onUpdateQuantity={(quantity) => updateQuantity(item.product_id, quantity)}
                    />
                  ))}
                </ul>

                <div className="px-4 py-6 sm:px-6 border-t border-gray-200">
                  <Link
                    href="/products"
                    className="text-sm font-medium text-primary-base hover:text-primary-dark"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-8 lg:col-span-5 lg:mt-0">
              <CartSummary 
                items={items} 
                subtotal={total}
                shipping={0}
                total={total} 
              />
              
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary-base px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 