import { createAdminClient } from '../src/lib/supabase/admin'

async function checkAdminStatus(email: string) {
  const adminClient = createAdminClient()

  // First, find the user by email
  const { data: { users }, error: userError } = await adminClient.auth.admin.listUsers()
  
  if (userError) {
    console.error('Error finding user:', userError)
    return
  }

  const user = users.find(u => u.email === email)
  if (!user) {
    console.log(`No user found with email: ${email}`)
    return
  }

  console.log('Found user:', {
    id: user.id,
    email: user.email,
    created_at: user.created_at
  })

  // Check if user is an admin
  const { data: adminData, error: adminError } = await adminClient
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (adminError) {
    console.log('Admin check error:', adminError)
    return
  }

  if (!adminData) {
    console.log('User is not an admin')
    return
  }

  console.log('Admin status:', {
    id: adminData.id,
    role: adminData.role,
    created_at: adminData.created_at
  })
}

// Check the specific email
checkAdminStatus('chadley78@gmail.com')
  .catch(console.error)
  .finally(() => process.exit()) 