import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST() {
  try {
    // Basic security check - verify the request is coming from localhost
    const headersList = headers()
    const host = headersList.get('host')
    if (!host?.includes('localhost')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const adminClient = createAdminClient()
    
    // Delete all questionnaire approvals
    const { error } = await adminClient
      .from('questionnaire_approvals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // This ensures we delete all records

    if (error) {
      console.error('Error deleting questionnaire approvals:', error)
      return NextResponse.json(
        { error: 'Failed to delete questionnaire approvals' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'All questionnaire approvals have been deleted successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 