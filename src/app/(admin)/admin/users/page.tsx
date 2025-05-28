import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import type { AdminUser } from '@/types/admin'

// Dynamically import the component with proper typing
const AdminUsersList = dynamic<{ admins: AdminUser[] }>(
  () => import('@/components/admin/AdminUsersList').then(mod => mod.AdminUsersList),
  { ssr: false }
)

interface AdminUserFromDB {
  id: string
  user_id: string
  role: 'admin' | 'super_admin'
  created_at: string
  can_add_admins: boolean
  can_delete_admins: boolean
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?redirect=/admin/users')
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

  // Fetch all admin users
  const { data: admins, error: fetchError } = await adminClient
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (fetchError) {
    console.error('Error fetching admin users:', fetchError)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">Could not load admin users. Please try again later.</p>
        </div>
      </div>
    )
  }

  // Get all users from auth.users
  const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers()
  
  if (usersError) {
    console.error('Error fetching users:', usersError)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">Could not load user information. Please try again later.</p>
        </div>
      </div>
    )
  }

  // Create a map of user IDs to emails for quick lookup
  const userEmailMap = new Map(users.map(user => [user.id, user.email]))

  // Transform the data to match the expected interface
  const transformedAdmins: AdminUser[] = (admins as AdminUserFromDB[]).map(admin => ({
    id: admin.id,
    user_id: admin.user_id,
    role: admin.role || 'admin',
    created_at: admin.created_at,
    can_add_admins: admin.can_add_admins || false,
    can_delete_admins: admin.can_delete_admins || false,
    user: {
      email: userEmailMap.get(admin.user_id) || 'Unknown'
    }
  }))

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Users</h1>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Admin
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <AdminUsersList admins={transformedAdmins} />
        </div>
      </div>
    </div>
  )
} 