import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use service role client to fetch order
    const supabase = createServiceRoleClient()

    // Fetch the complete order with items
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (fetchError) {
      console.error('Error fetching order:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: 500 }
      )
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Send the confirmation email
    try {
      await sendOrderConfirmationEmail(order)
      return NextResponse.json({
        message: 'Order confirmation email sent successfully'
      })
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send order confirmation email' },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error('Unexpected error in resend-email:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to resend email' },
      { status: 500 }
    )
  }
} 