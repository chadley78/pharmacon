import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

// Schema for creating a new admin
const createAdminSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'super_admin']).default('admin'),
  can_add_admins: z.boolean().default(false),
  can_delete_admins: z.boolean().default(false)
})

export async function GET() {
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

    // Get all admin users with their email addresses
    const { data: admins, error: fetchError } = await adminClient
      .from('admin_users')
      .select(`
        *,
        user:auth.users (
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching admin users:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch admin users' },
        { status: 500 }
      )
    }

    return NextResponse.json(admins)
  } catch (error) {
    console.error('Error in get admin users endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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

    // Parse and validate request body
    const body = await request.json()
    const result = createAdminSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid admin data', details: result.error.format() },
        { status: 400 }
      )
    }

    // Find the user by email
    const { data: { users }, error: userError } = await adminClient.auth.admin.listUsers()

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to search for user' },
        { status: 500 }
      )
    }

    const targetUser = users.find(u => u.email === result.data.email)
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found. Please ensure the user has signed up first.' },
        { status: 404 }
      )
    }

    // Check if user has verified their email
    if (!targetUser.email_confirmed_at) {
      return NextResponse.json(
        { error: 'User has not verified their email address yet. Please ask them to verify their email before adding them as an admin.' },
        { status: 400 }
      )
    }

    // Check if user is already an admin
    const { data: existingAdmin } = await adminClient
      .from('admin_users')
      .select('id')
      .eq('user_id', targetUser.id)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'User is already an admin' },
        { status: 400 }
      )
    }

    // Create the admin user
    const { data: newAdmin, error: createError } = await adminClient
      .from('admin_users')
      .insert([{
        user_id: targetUser.id,
        role: result.data.role,
        can_add_admins: result.data.can_add_admins,
        can_delete_admins: result.data.can_delete_admins
      }])
      .select('*')
      .single()

    if (createError) {
      console.error('Error creating admin user:', createError)
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      )
    }

    // Return the admin user with email
    return NextResponse.json({
      ...newAdmin,
      user: {
        email: targetUser.email
      }
    })
  } catch (error) {
    console.error('Error in create admin user endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 