'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { useCart } from '@/lib/context/CartContext'
import { Address } from '@/lib/types'

interface PaymentFormProps {
  onSubmit: () => Promise<void>
  onBack: () => void
  shippingAddress: Address
  billingAddress: Address
}

function CheckoutForm({ onBack, shippingAddress, billingAddress }: { 
  onBack: () => void
  shippingAddress: Address
  billingAddress: Address
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      console.log('Starting payment process with addresses:', {
        shippingAddress,
        billingAddress
      })

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        setError(error.message ?? 'An error occurred during payment')
        return
      }

      if (!paymentIntent) {
        setError('No payment intent returned')
        return
      }

      console.log('Payment successful, creating order with:', {
        paymentIntentId: paymentIntent.id,
        shippingAddress,
        billingAddress
      })

      // Create the order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          shippingAddress,
          billingAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Order creation failed:', data)
        throw new Error(data.error || 'Failed to create order')
      }

      // Clear the cart
      await clearCart()

      // Redirect to success page
      router.push(`/checkout/success?payment_intent=${paymentIntent.id}`)
    } catch (err) {
      console.error('Payment/order error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Complete your purchase securely with Stripe.
        </p>
      </div>

      <PaymentElement />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Billing
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    </form>
  )
}

export default function PaymentForm({ onSubmit, onBack, shippingAddress, billingAddress }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('PaymentForm mounted with addresses:', {
      shippingAddress,
      billingAddress
    })
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment')
        }

        if (data.error) {
          setError(data.error)
        } else {
          setClientSecret(data.clientSecret)
        }
      } catch (err) {
        console.error('Payment initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize payment')
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [shippingAddress, billingAddress])

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Initializing payment...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Loading payment form...</p>
      </div>
    )
  }

  const stripePromise = getStripe()

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutForm 
        onBack={onBack} 
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
      />
    </Elements>
  )
} 