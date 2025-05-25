'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/stores/cartStore'
import { Address } from '@/lib/types'
import ShippingForm from '@/app/(main)/checkout/ShippingForm'
import BillingForm from '@/app/(main)/checkout/BillingForm'
import { PaymentIntent, Stripe } from '@stripe/stripe-js'

interface PaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  loading: boolean
}

function PaymentFormSteps({ 
  onSuccess, 
  onError, 
  loading, 
  setClientSecret,
  clientSecret,
  stripePromise
}: PaymentFormProps & { 
  setClientSecret: (secret: string | null) => void,
  clientSecret: string | null,
  stripePromise: Promise<Stripe | null>
}) {
  const [step, setStep] = useState<'shipping' | 'billing' | 'payment'>('shipping')
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [billingAddress, setBillingAddress] = useState<Address | null>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [isGuest, setIsGuest] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const { items } = useCartStore()

  const handleShippingSubmit = async (address: Address) => {
    setShippingAddress(address)
    setStep('billing')
  }

  const handleBillingSubmit = async (address: Address) => {
    setBillingAddress(address)
    setStep('payment')

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          guestEmail: !user ? guestEmail : undefined,
          shippingAddress: address,
          billingAddress: address,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment intent')
      }

      const { clientSecret: secret } = await response.json()
      setClientSecret(secret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment'
      setError(errorMessage)
      onError(errorMessage)
      setStep('shipping')
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setStep('shipping')
          }}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (step === 'shipping') {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Checkout as</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                id="guest"
                name="checkout-type"
                type="radio"
                checked={isGuest}
                onChange={() => setIsGuest(true)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="guest" className="ml-3 block text-sm font-medium text-gray-700">
                Guest Checkout
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="account"
                name="checkout-type"
                type="radio"
                checked={!isGuest}
                onChange={() => setIsGuest(false)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="account" className="ml-3 block text-sm font-medium text-gray-700">
                Account Checkout
              </label>
            </div>
          </div>
        </div>

        {isGuest && (
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        <ShippingForm
          initialData={shippingAddress}
          onSubmit={handleShippingSubmit}
        />
      </div>
    )
  }

  if (step === 'billing') {
    return (
      <BillingForm
        initialData={billingAddress}
        shippingAddress={shippingAddress}
        onSubmit={handleBillingSubmit}
        onBack={() => setStep('shipping')}
      />
    )
  }

  if (step === 'payment' && !clientSecret) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading payment form...</p>
      </div>
    )
  }

  // When we have a clientSecret, render the Stripe payment form
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: clientSecret! }}>
      <StripePaymentForm
        onSuccess={onSuccess}
        loading={loading}
        onBack={() => setStep('billing')}
        isGuest={isGuest}
        guestEmail={guestEmail}
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
      />
    </Elements>
  )
}

function StripePaymentForm({ 
  onSuccess, 
  loading,
  onBack,
  isGuest,
  guestEmail,
  shippingAddress,
  billingAddress
}: Omit<PaymentFormProps, 'onError'> & { 
  onBack: () => void,
  isGuest: boolean,
  guestEmail: string,
  shippingAddress: Address | null,
  billingAddress: Address | null
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { items } = useCartStore()
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const supabase = createClient()

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.error('Stripe or Elements not initialized')
      return
    }

    setOrderError(null)
    setIsProcessing(true)

    try {
      // Get the current user state
      const { data: { user } } = await supabase.auth.getUser()

      console.log('Starting payment confirmation...')
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      })

      if (submitError) {
        console.error('Payment confirmation error:', submitError)
        throw submitError
      }

      if (paymentIntent && 'status' in paymentIntent && paymentIntent.status === 'succeeded') {
        const typedPaymentIntent = paymentIntent as PaymentIntent
        console.log('Payment successful, payment intent:', typedPaymentIntent.id)
        console.log('Payment status:', typedPaymentIntent.status)
        setPaymentIntentId(typedPaymentIntent.id)
        
        // Create order
        console.log('Attempting to create order...')
        const orderData = {
          paymentIntentId: typedPaymentIntent.id,
          guestEmail: !user ? guestEmail : undefined,
          shippingAddress,
          billingAddress,
          items,
        }
        console.log('Order data:', JSON.stringify(orderData, null, 2))

        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        const responseData = await response.json()
        console.log('Order creation response:', responseData)

        if (!response.ok) {
          console.error('Order creation failed:', responseData)
          setOrderError(responseData.error || 'Failed to create order')
          return
        }

        console.log('Order created successfully')
        setOrderId(responseData.orderId)
        
        // Call onSuccess to trigger parent component handling (clear cart, show toast)
        onSuccess()
        
        // Wait a moment to show the success state before redirecting
        setTimeout(() => {
          const params = new URLSearchParams({
            orderId: responseData.orderId
          })
          if (isGuest && guestEmail) {
            params.append('guest_email', guestEmail)
          }
          router.push(`/checkout/success?${params.toString()}`)
        }, 1000)
      } else {
        console.error('Payment not successful:', paymentIntent?.status)
        setOrderError('Payment confirmation failed')
      }
    } catch (err) {
      console.error('Payment or order creation error:', err)
      setOrderError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // Show success message if order was created
  if (orderId) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Order Successful!</h2>
        <p className="text-gray-600 mb-4">
          Your order has been placed successfully. Redirecting to order details...
        </p>
        <p className="text-sm text-gray-500">
          Order ID: {orderId}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Complete your payment using the form below.
        </p>
      </div>

      {orderError && (
        <div className="text-red-500 text-center border border-red-200 bg-red-50 rounded p-3 mb-2">
          <p className="font-semibold">Error Processing Order</p>
          <p>{orderError}</p>
          {paymentIntentId && (
            <p className="text-sm mt-2">
              Your payment was successful (ID: {paymentIntentId}), but we encountered an issue creating your order. 
              Please contact support with this payment ID for assistance.
            </p>
          )}
        </div>
      )}

      <PaymentElement />

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Back to Billing
        </button>
        <button
          type="submit"
          disabled={!stripe || loading || isProcessing}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : loading ? 'Loading...' : 'Complete Payment'}
        </button>
      </div>
    </form>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error] = useState<string | null>(null)

  const loadStripe = useCallback(async () => {
    const { getStripe } = await import('@/lib/stripe')
    setStripePromise(getStripe())
  }, [setStripePromise])

  // Initialize Stripe
  useEffect(() => {
    loadStripe()
  }, [loadStripe])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading payment system...</p>
      </div>
    )
  }

  return (
    <PaymentFormSteps
      {...props}
      setClientSecret={setClientSecret}
      clientSecret={clientSecret}
      stripePromise={stripePromise}
    />
  )
} 