import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminNav } from '@/components/admin/AdminNav'
import Navbar from '@/components/layout/Navbar'
import { Suspense } from 'react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?redirect=/admin')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="h-16 bg-white shadow-sm animate-pulse" />
      }>
        <Navbar />
      </Suspense>
      <div className="flex pt-16">
        <Suspense fallback={
          <div className="w-64 bg-white border-r border-gray-200 min-h-screen animate-pulse" />
        }>
          <AdminNav />
        </Suspense>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 