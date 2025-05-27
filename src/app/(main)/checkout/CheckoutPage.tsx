'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cartStore'
import PaymentForm from '@/components/checkout/PaymentForm'
import CartSummary from '@/components/cart/CartSummary'
import Toast from '@/components/ui/Toast'
import Link from 'next/link'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({
    message: '',
    type: 'success',
    show: false
  })

  const { items = [], total = 0 } = useCartStore()
  const subtotal = total // Since we don't have separate subtotal in cart store, using total as subtotal
  const shipping = 0 // Free shipping for now

  const handlePaymentSuccess = async () => {
    setLoading(true)
    try {
      setToast({
        message: 'Payment accepted, processing your order...',
        type: 'success',
        show: true
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment'
      setToast({
        message: errorMessage,
        type: 'error',
        show: true
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (error: string) => {
    setToast({
      message: error,
      type: 'error',
      show: true
    })
  }

  // Show loading state while checking cart
  if (!items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  // Show empty cart message instead of redirecting
  if (items.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>
            
            <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Please add some items to your cart before proceeding to checkout.</p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-base px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Checkout</h1>

          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <div className="lg:col-span-7">
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                loading={loading}
              />
            </div>

            <div className="mt-16 lg:col-span-5 lg:mt-0">
              <CartSummary items={items} total={total} subtotal={subtotal} shipping={shipping} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  )
} 