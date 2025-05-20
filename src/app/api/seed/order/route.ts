import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const adminClient = createAdminClient()

    // Get the current user from the request
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('Creating order for user:', userId)

    // Create a sample order
    const orderData = {
      user_id: userId,
      status: 'paid',
      shipping_address: {
        name: 'John Doe',
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'Dublin',
        state: 'Dublin',
        postal_code: 'D01 X4X0',
        country: 'Ireland'
      },
      billing_address: {
        name: 'John Doe',
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'Dublin',
        state: 'Dublin',
        postal_code: 'D01 X4X0',
        country: 'Ireland'
      },
      subtotal: 23.97, // Sum of products
      shipping_cost: 0,
      total: 23.97
    }

    console.log('Inserting order with data:', orderData)

    // Insert the order
    const { data: order, error: orderError } = await adminClient
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

    console.log('Order created successfully:', order)

    // Create order items
    const orderItems = [
      {
        order_id: order.id,
        product_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', // Ibuprofen 200mg
        quantity: 2,
        price_at_time: 5.99
      },
      {
        order_id: order.id,
        product_id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', // Paracetamol 500mg
        quantity: 1,
        price_at_time: 4.99
      },
      {
        order_id: order.id,
        product_id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', // Vitamin D3 1000IU
        quantity: 1,
        price_at_time: 12.99
      }
    ]

    console.log('Inserting order items:', orderItems)

    // First, verify the products exist
    const { data: products, error: productsError } = await adminClient
      .from('products')
      .select('id, name')
      .in('id', orderItems.map(item => item.product_id))

    if (productsError) {
      console.error('Error checking products:', productsError)
      await adminClient.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: `Failed to verify products: ${productsError.message}` },
        { status: 500 }
      )
    }

    console.log('Found products:', products)

    if (!products || products.length !== orderItems.length) {
      console.error('Some products not found:', { 
        requested: orderItems.map(item => item.product_id),
        found: products?.map(p => p.id) || []
      })
      await adminClient.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: 'Some products not found' },
        { status: 500 }
      )
    }

    const { error: itemsError } = await adminClient
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Attempt to delete the order if order items creation fails
      await adminClient.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: `Failed to create order items: ${itemsError.message}` },
        { status: 500 }
      )
    }

    console.log('Order items created successfully')

    return NextResponse.json({
      message: 'Sample order created successfully',
      order
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 