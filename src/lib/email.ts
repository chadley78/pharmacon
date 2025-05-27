import { Resend } from 'resend'
import { Order, OrderItem as BaseOrderItem } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'
import { getStripeServer } from '@/lib/stripe'

// Extend the base OrderItem type to include price_at_time
interface OrderItem extends BaseOrderItem {
  price_at_time: number
}

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not configured')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(order: Order) {
  const { order_items, shipping_address, total, id, created_at, guest_email, user_id } = order
  
  // Get customer email - use guest_email for guest orders, fetch from user account for logged-in users
  let customerEmail: string | null = guest_email
  if (!customerEmail && user_id) {
    try {
      const supabase = await createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user email:', error)
        throw new Error('Failed to fetch user email')
      }
      customerEmail = user?.email || null
    } catch (error) {
      console.error('Error in user email fetch:', error)
      // If we can't get the user's email, try to get it from the order's metadata
      const supabase = await createClient()
      const { data: orderData } = await supabase
        .from('orders')
        .select('stripe_payment_intent_id')
        .eq('id', id)
        .single()
      
      if (orderData?.stripe_payment_intent_id) {
        const stripe = getStripeServer()
        const paymentIntent = await stripe.paymentIntents.retrieve(orderData.stripe_payment_intent_id)
        customerEmail = paymentIntent.receipt_email || null
      }
    }
  }

  if (!customerEmail) {
    throw new Error('No customer email available for order confirmation')
  }

  const orderDate = new Date(created_at).toLocaleDateString('en-IE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (!order_items) {
    throw new Error('Order items are missing from the order')
  }

  const itemsList = (order_items as OrderItem[]).map((item: OrderItem) => {
    if (!item.product) {
      throw new Error('Product information is missing from order item')
    }
    return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">€${(item.price_at_time * item.quantity).toFixed(2)}</td>
    </tr>
  `}).join('')

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Order Number:</strong> ${id}</p>
          <p><strong>Order Date:</strong> ${orderDate}</p>
        </div>

        <h2 style="color: #1f2937; margin-top: 30px;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: center;">Quantity</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right;"><strong>Total</strong></td>
              <td style="padding: 12px; text-align: right;"><strong>€${total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 30px;">
          <h2 style="color: #1f2937;">Shipping Address</h2>
          <p>
            ${shipping_address.full_name}<br>
            ${shipping_address.address_line1}<br>
            ${shipping_address.address_line2 ? shipping_address.address_line2 + '<br>' : ''}
            ${shipping_address.city}<br>
            ${shipping_address.state ? shipping_address.state + '<br>' : ''}
            ${shipping_address.postal_code}<br>
            ${shipping_address.country}
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #6b7280;">
          <p>If you have any questions about your order, please contact our support team.</p>
          <p>Thank you for choosing Pharmacon!</p>
        </div>
      </body>
    </html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: 'Pharmacon <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Order Confirmation - Order #${id}`,
      html: emailHtml,
    })

    if (error) {
      console.error('Error sending order confirmation email:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    throw error
  }
} 