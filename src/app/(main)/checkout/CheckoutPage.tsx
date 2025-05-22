'use client'

import { useState } from 'react'
import { useCart } from '@/lib/context/CartContext'
import { useRouter } from 'next/navigation'
import { Address } from '@/lib/types'
import ShippingForm from './ShippingForm'
import BillingForm from './BillingForm'
import PaymentForm from './PaymentForm'
import OrderSummary from './OrderSummary'

type CheckoutStep = 'shipping' | 'billing' | 'payment'

export function CheckoutPage() {
  const router = useRouter()
  const { cart, loading } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [billingAddress, setBillingAddress] = useState<Address | null>(null)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleShippingSubmit = (address: Address) => {
    setShippingAddress(address)
    setCurrentStep('billing')
  }

  const handleBillingSubmit = (address: Address) => {
    setBillingAddress(address)
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async () => {
    // TODO: Implement payment processing
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          {/* Progress Steps */}
          <nav aria-label="Progress" className="mb-8">
            <ol role="list" className="flex items-center">
              <li className={`relative ${currentStep === 'shipping' ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="flex items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-current">
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                  </span>
                  <span className="ml-3 text-sm font-medium">Shipping</span>
                </span>
              </li>
              <li className={`relative ml-8 ${currentStep === 'billing' ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="flex items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-current">
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                  </span>
                  <span className="ml-3 text-sm font-medium">Billing</span>
                </span>
              </li>
              <li className={`relative ml-8 ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
                <span className="flex items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-current">
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                  </span>
                  <span className="ml-3 text-sm font-medium">Payment</span>
                </span>
              </li>
            </ol>
          </nav>

          {/* Form Steps */}
          <div className="mt-8">
            {currentStep === 'shipping' && (
              <ShippingForm
                initialData={shippingAddress}
                onSubmit={handleShippingSubmit}
              />
            )}
            {currentStep === 'billing' && (
              <BillingForm
                initialData={billingAddress}
                shippingAddress={shippingAddress}
                onSubmit={handleBillingSubmit}
                onBack={() => setCurrentStep('shipping')}
              />
            )}
            {currentStep === 'payment' && (
              <PaymentForm
                onBack={() => setCurrentStep('billing')}
                shippingAddress={shippingAddress!}
                billingAddress={billingAddress!}
              />
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0 lg:col-span-5">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  )
} 