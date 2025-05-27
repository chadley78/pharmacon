import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import OrdersList from '@/components/admin/OrdersList'
import { Order } from '@/lib/types'

export default async function OrdersPage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Check if user is an admin
  const { data: adminData, error: adminError } = await adminClient
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (adminError || !adminData) {
    redirect('/')
  }

  // Fetch orders
  const { data: orders, error: ordersError } = await adminClient
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (ordersError) {
    console.error('Error fetching orders:', ordersError)
    throw new Error('Failed to fetch orders')
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <OrdersList orders={orders as Order[]} />
        </div>
      </div>
    </div>
  )
} 