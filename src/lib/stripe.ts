import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Make sure to use the publishable key for client-side
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Server-side Stripe instance
let stripeServer: Stripe | null = null

export const getStripeServer = () => {
  if (!stripeServer) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured')
    }
    stripeServer = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
    })
  }
  return stripeServer
}

// Client-side Stripe instance
export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key is not configured')
  }
  return stripePromise
}

// Helper function to format amount for Stripe
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}

// Helper function to format amount for display (convert from cents)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100
} 