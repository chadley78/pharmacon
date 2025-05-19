import { NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe'
import { formatAmountForStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { CartItem } from '@/lib/types'

export async function POST() {
  try {
    // Check if Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key is not configured')
      return NextResponse.json(
        { error: 'Payment system is not properly configured' },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    const stripe = getStripeServer()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Auth error:', userError)
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      )
    }
    if (!user) {
      console.error('No user found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Get the cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)

    if (cartError) {
      console.error('Cart error:', cartError)
      return NextResponse.json(
        { error: 'Error fetching cart items' },
        { status: 500 }
      )
    }

    if (!cartItems || cartItems.length === 0) {
      console.error('Cart is empty')
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate the total amount
    const amount = cartItems.reduce((total: number, item: CartItem & { product: { price: number } }) => {
      return total + (item.product.price * item.quantity)
    }, 0)

    console.log('Creating payment intent for amount:', amount)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.id,
      },
    })

    console.log('Payment intent created:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err) {
    console.error('Detailed payment intent error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error creating payment intent' },
      { status: 500 }
    )
  }
} 