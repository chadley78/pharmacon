import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripeServer } from '@/lib/stripe'
import { OrderStatus } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)

    const { paymentIntentId, shippingAddress, billingAddress } = body

    if (!paymentIntentId) {
      console.error('Missing payment intent ID')
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !billingAddress) {
      console.error('Missing address information:', { shippingAddress, billingAddress })
      return NextResponse.json(
        { error: 'Shipping and billing addresses are required' },
        { status: 400 }
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

    console.log('User authenticated:', user.id)

    // Verify the payment intent
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      console.log('Payment intent status:', paymentIntent.status)
      
      if (paymentIntent.status !== 'succeeded') {
        console.error('Payment not successful:', paymentIntent.status)
        return NextResponse.json(
          { error: 'Payment not successful' },
          { status: 400 }
        )
      }
    } catch (stripeError) {
      console.error('Stripe error:', stripeError)
      return NextResponse.json(
        { error: 'Error verifying payment' },
        { status: 400 }
      )
    }

    // Get cart items
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

    console.log('Cart items found:', cartItems.length)

    // Calculate order total and subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
    const shippingCost = 0 // Free shipping for now
    const total = subtotal + shippingCost

    console.log('Calculated amounts:', { subtotal, shippingCost, total })

    // Create the order
    const orderData = {
      user_id: user.id,
      status: OrderStatus.PROCESSING,
      subtotal,
      shipping_cost: shippingCost,
      total,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      stripe_payment_intent_id: paymentIntentId,
    }

    console.log('Creating order with data:', orderData)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: `Failed to create order: ${orderError.message}` },
        { status: 500 }
      )
    }

    console.log('Order created:', order.id)

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.product.price,
    }))

    console.log('Creating order items:', orderItems.length)

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError)
      // Attempt to delete the order if order items creation fails
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: `Failed to create order items: ${orderItemsError.message}` },
        { status: 500 }
      )
    }

    console.log('Order items created successfully')

    // Clear the cart
    const { error: clearCartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (clearCartError) {
      console.error('Error clearing cart:', clearCartError)
      // Don't return error here as the order was created successfully
    }

    console.log('Cart cleared successfully')

    return NextResponse.json({
      orderId: order.id,
      message: 'Order created successfully',
    })
  } catch (err) {
    console.error('Unexpected error in create-order:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create order' },
      { status: 500 }
    )
  }
} 