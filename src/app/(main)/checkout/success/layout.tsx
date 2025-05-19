'use client'

import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const stripePromise = getStripe()

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
} 