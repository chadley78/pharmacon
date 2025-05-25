import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const fetchCache = 'force-no-store'
export const runtime = 'edge'

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
    const authClient = await createClient()
    
    // Get the current user
    const { data: { user } } = await authClient.auth.getUser()
    
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
      return NextResponse.json(
        { error: 'Failed to fetch order' }, 
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      )
    }

    // If user is logged in, verify they own the order
    if (user) {
      if (order.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Order not found' }, 
          { 
            status: 404,
            headers: {
              'Cache-Control': 'no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          }
        )
      }
    } 
    // If guest, verify the email matches
    else if (guestEmail) {
      if (order.guest_email !== guestEmail) {
        return NextResponse.json(
          { error: 'Order not found' }, 
          { 
            status: 404,
            headers: {
              'Cache-Control': 'no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          }
        )
      }
    }
    // If neither user nor guest email, deny access
    else {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      )
    }

    return NextResponse.json(order, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error in order fetch API:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    )
  }
} 