import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { OrderStatus } from '@/lib/types'

interface UpdateData {
  status: OrderStatus
  out_for_delivery_at?: string
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { status } = await request.json()

    // Validate status
    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get current order to check status
    const { data: currentOrder, error: fetchError } = await adminClient
      .from('orders')
      .select('status, out_for_delivery_at')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      console.error('Error fetching current order:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch current order status' },
        { status: 500 }
      )
    }

    console.log('Current order status:', currentOrder.status)
    console.log('Current out_for_delivery_at:', currentOrder.out_for_delivery_at)
    console.log('New status:', status)

    // Prepare update data
    const updateData: UpdateData = { status }
    
    // If transitioning to out_for_delivery, set the timestamp
    if (status === OrderStatus.OUT_FOR_DELIVERY && currentOrder.status !== OrderStatus.OUT_FOR_DELIVERY) {
      updateData.out_for_delivery_at = new Date().toISOString()
    }

    console.log('Update data:', updateData)

    // Update order status
    const { data: order, error: updateError } = await adminClient
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating order status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }

    console.log('Updated order:', order)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error in update order status endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 