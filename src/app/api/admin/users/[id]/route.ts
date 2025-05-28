import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

// Schema for updating an admin
const updateAdminSchema = z.object({
  role: z.enum(['admin', 'super_admin']),
  can_add_admins: z.boolean(),
  can_delete_admins: z.boolean()
})

export async function GET(
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

    // Get the admin user
    const { data: admin, error: fetchError } = await adminClient
      .from('admin_users')
      .select(`
        *,
        user:auth.users (
          email
        )
      `)
      .eq('id', params.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Admin user not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching admin user:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch admin user' },
        { status: 500 }
      )
    }

    return NextResponse.json(admin)
  } catch (error) {
    console.error('Error in get admin user endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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

    // Parse and validate request body
    const body = await request.json()
    const result = updateAdminSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid admin data', details: result.error.format() },
        { status: 400 }
      )
    }

    // Update the admin user
    const { data: updatedAdmin, error: updateError } = await adminClient
      .from('admin_users')
      .update({
        role: result.data.role,
        can_add_admins: result.data.can_add_admins,
        can_delete_admins: result.data.can_delete_admins
      })
      .eq('id', params.id)
      .select(`
        *,
        user:auth.users (
          email
        )
      `)
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Admin user not found' },
          { status: 404 }
        )
      }
      console.error('Error updating admin user:', updateError)
      return NextResponse.json(
        { error: 'Failed to update admin user' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedAdmin)
  } catch (error) {
    console.error('Error in update admin user endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Delete request received for admin:', params.id)
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log('Authentication failed:', authError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    console.log('User authenticated:', user.email)

    // Check if user is an admin
    const { data: adminData, error: adminError } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminData) {
      console.log('User is not an admin:', adminError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    console.log('User is admin:', adminData)

    // Check if user has permission to delete admins
    if (!adminData.can_delete_admins) {
      console.log('User does not have delete permission')
      return NextResponse.json(
        { error: 'You do not have permission to delete admin users' },
        { status: 403 }
      )
    }
    console.log('User has delete permission')

    // Prevent deleting yourself
    if (params.id === adminData.id) {
      console.log('Attempted to delete own account')
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      )
    }

    // Delete the admin user
    console.log('Attempting to delete admin user:', params.id)
    const { error: deleteError } = await adminClient
      .from('admin_users')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting admin user:', deleteError)
      if (deleteError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Admin user not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to delete admin user' },
        { status: 500 }
      )
    }

    console.log('Admin user deleted successfully')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Unexpected error in delete admin user endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 