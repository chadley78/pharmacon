import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface EditAdminUserPageProps {
  params: {
    id: string
  }
}

export default async function EditAdminUserPage({ params }: EditAdminUserPageProps) {
  console.log('Edit page accessed with params:', params)
  
  // Basic auth check
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    console.log('Auth check failed')
    redirect('/login?redirect=/admin/users')
  }

  // Get admin data
  const adminClient = createAdminClient()
  const { data: admin, error: fetchError } = await adminClient
    .from('admin_users')
    .select('id, user_id, role, created_at, can_add_admins, can_delete_admins')
    .eq('id', params.id)
    .single()

  if (fetchError || !admin) {
    console.log('Admin not found:', fetchError)
    notFound()
  }

  // Get user email
  const { data: userData } = await adminClient
    .from('users')
    .select('email')
    .eq('id', admin.user_id)
    .single()

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Admin User</h1>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Admin User Details</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData?.email}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {admin.role}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Permissions</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="space-y-2">
                    <li>Can Add Admins: {admin.can_add_admins ? 'Yes' : 'No'}</li>
                    <li>Can Delete Admins: {admin.can_delete_admins ? 'Yes' : 'No'}</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 