import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const searchParams = new URL(request.url).searchParams
    const guestEmail = searchParams.get('guest_email')

    // Use service role client to fetch order
    const supabase = createServiceRoleClient()
    
    // Fetch order with items
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }

    // Verify the order matches the guest email
    if (order.guest_email !== guestEmail) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error in order fetch API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 