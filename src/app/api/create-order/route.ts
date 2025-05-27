import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripeServer } from '@/lib/stripe'
import { OrderStatus, CartItem } from '@/lib/types'
import { Address } from '@/lib/types'
import { sendOrderConfirmationEmail } from '@/lib/email'

interface RequestBody {
  paymentIntentId: string
  guestEmail?: string
  shippingAddress?: Address
  billingAddress?: Address
  items: CartItem[]
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody
    console.log('Received request body:', body)

    const { paymentIntentId, guestEmail, shippingAddress, billingAddress, items } = body

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

    // Use admin client for guest orders, regular client for authenticated users
    const supabase = guestEmail ? createAdminClient() : await createClient()
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

    // For guest checkout, require email
    if (!user && !guestEmail) {
      console.error('Missing guest email')
      return NextResponse.json(
        { error: 'Guest email is required for guest checkout' },
        { status: 400 }
      )
    }

    console.log('User/guest info:', { userId: user?.id, guestEmail })

    // Verify the payment intent
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      console.log('Payment intent status:', paymentIntent.status)
      
      if (paymentIntent.status !== 'succeeded') {
        console.error('Payment not successful:', paymentIntent.status)
        return NextResponse.json(
          { error: 'Payment not successful' },
          { status: 400 }
        )
      }

      // Verify the payment intent belongs to this user/guest
      if (user && paymentIntent.metadata.userId !== user.id) {
        console.error('Payment intent does not belong to user')
        return NextResponse.json(
          { error: 'Invalid payment intent' },
          { status: 400 }
        )
      }
      if (!user && (paymentIntent.metadata.guestEmail || '') !== (guestEmail || '')) {
        console.error('Payment intent does not belong to guest', {
          paymentIntentGuestEmail: paymentIntent.metadata.guestEmail,
          providedGuestEmail: guestEmail
        })
        return NextResponse.json(
          { error: 'Invalid payment intent' },
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

    // Calculate order total and subtotal
    const subtotal = items.reduce((sum: number, item: CartItem) => {
      return sum + (item.product!.price * item.quantity)
    }, 0)
    const shippingCost = 0 // Free shipping for now
    const total = subtotal + shippingCost

    console.log('Calculated amounts:', { subtotal, shippingCost, total })

    // Create the order
    const orderData = {
      user_id: user?.id || null,
      guest_email: !user ? guestEmail : null,
      status: OrderStatus.PROCESSING,
      subtotal,
      shipping_cost: shippingCost,
      total,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      stripe_payment_intent_id: paymentIntentId,
      stripe_customer_id: paymentIntent.customer as string,
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
    const orderItems = items.map((item: CartItem) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.product!.price,
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

    // Clear the cart for logged-in users
    if (user) {
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (clearCartError) {
        console.error('Error clearing cart:', clearCartError)
        // Don't return error here as the order was created successfully
      }

      console.log('Cart cleared successfully')
    }

    // Fetch the complete order with items for the email
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', order.id)
      .single()

    if (fetchError) {
      console.error('Error fetching complete order for email:', fetchError)
      // Don't return error here as the order was created successfully
    } else {
      try {
        await sendOrderConfirmationEmail(completeOrder)
        console.log('Order confirmation email sent successfully')
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError)
        // Don't return error here as the order was created successfully
      }
    }

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