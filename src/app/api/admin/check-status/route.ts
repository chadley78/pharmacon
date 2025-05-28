import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  try {
    console.log('Admin status check started')
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    console.log('Checking admin status for email:', email)

    if (!email) {
      console.log('No email provided')
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log('Creating Supabase clients...')
    const supabase = await createClient()
    const adminClient = createAdminClient()
    console.log('Supabase clients created')

    // First check if the user is authenticated
    console.log('Checking user authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication error', details: authError },
        { status: 401 }
      )
    }
    if (!user) {
      console.log('No authenticated user found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    console.log('User authenticated:', user.email)

    // Only allow users to check their own status
    if (user.email !== email) {
      console.log('Email mismatch:', { userEmail: user.email, requestedEmail: email })
      return NextResponse.json(
        { error: 'Unauthorized to check other users' },
        { status: 403 }
      )
    }

    // Check if user is an admin
    console.log('Checking admin status in database...')
    const { data: adminData, error: adminError } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (adminError) {
      console.error('Admin check database error:', adminError)
      return NextResponse.json(
        { error: 'Failed to check admin status', details: adminError },
        { status: 500 }
      )
    }

    console.log('Admin check complete:', { isAdmin: !!adminData, adminData })
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      isAdmin: !!adminData,
      adminData: adminData || null
    })
  } catch (error) {
    console.error('Unexpected error in check admin status endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 