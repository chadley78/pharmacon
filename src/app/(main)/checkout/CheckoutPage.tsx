'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cartStore'
import PaymentForm from '@/components/checkout/PaymentForm'
import CartSummary from '@/components/cart/CartSummary'
import Toast from '@/components/ui/Toast'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({
    message: '',
    type: 'success',
    show: false
  })

  const router = useRouter()
  const { items = [], total = 0, clearCart } = useCartStore()

  useEffect(() => {
    if (!items || items.length === 0) {
      router.push('/cart')
      return
    }
  }, [items, router])

  const handlePaymentSuccess = async () => {
    setLoading(true)
    try {
      clearCart()
      setToast({
        message: 'Payment successful! Thank you for your order.',
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

  // Don't render anything if cart is empty (will redirect in useEffect)
  if (items.length === 0) {
    return null
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
              <CartSummary items={items} total={total} />
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