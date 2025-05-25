import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripeServer } from '@/lib/stripe'
import { CartItem } from '@/lib/types'
import { Address } from '@/lib/types'
import Stripe from 'stripe'

interface RequestBody {
  items: (CartItem & { product: { price: number } })[]
  guestEmail?: string
  shippingAddress?: Address
  billingAddress?: Address
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody
    console.log('Received request body:', body)

    const { items, guestEmail, shippingAddress, billingAddress } = body

    if (!items || items.length === 0) {
      console.error('No items provided')
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const stripe = getStripeServer()

    // Get the current user (optional for guest checkout)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Only return auth error if we're not doing a guest checkout
    if (userError && !guestEmail) {
      console.error('Auth error:', userError)
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      )
    }

    // For guest checkout, require email and addresses
    if (!user && (!guestEmail || !shippingAddress || !billingAddress)) {
      console.error('Missing guest information:', { guestEmail, shippingAddress, billingAddress })
      return NextResponse.json(
        { error: 'Guest email and addresses are required for guest checkout' },
        { status: 400 }
      )
    }

    console.log('User/guest info:', { userId: user?.id, guestEmail })

    // Calculate order total
    const subtotal = items.reduce((sum: number, item: CartItem & { product: { price: number } }) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    const shippingCost = 0 // Free shipping for now
    const total = subtotal + shippingCost

    console.log('Calculated amounts:', { subtotal, shippingCost, total })

    // Create a customer in Stripe
    let customerId: string | null = null
    if (user) {
      // For logged-in users, get or create a customer
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id
      } else if (user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.user_metadata?.full_name || undefined,
          metadata: {
            userId: user.id
          }
        })
        customerId = customer.id

        // Save the customer ID to the profile
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)
      }
    } else if (guestEmail && billingAddress) {
      // For guests, create a customer with their email
      const customer = await stripe.customers.create({
        email: guestEmail,
        name: billingAddress.full_name,
        metadata: {
          guestEmail
        }
      })
      customerId = customer.id
    }

    if (!customerId) {
      throw new Error('Failed to create or retrieve customer')
    }

    // Create the payment intent
    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(total * 100), // Convert to cents
      currency: 'eur',
      customer: customerId,
      metadata: {
        userId: user?.id || '',
        guestEmail: !user ? guestEmail || '' : ''
      },
      receipt_email: user?.email || guestEmail || undefined
    }

    // Add shipping info for guest orders
    if (!user && shippingAddress) {
      paymentIntentData.shipping = {
        name: shippingAddress.full_name,
        address: {
          line1: shippingAddress.address_line1,
          line2: shippingAddress.address_line2 || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        }
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData)

    console.log('Created payment intent:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId
    })
  } catch (err) {
    console.error('Unexpected error in create-payment-intent:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create payment intent' },
      { status: 500 }
    )
  }
} 