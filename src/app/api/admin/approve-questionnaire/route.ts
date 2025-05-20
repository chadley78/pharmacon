import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { approvalId, status } = await request.json()
    
    if (!approvalId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request: approvalId and status (approved/rejected) are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('questionnaire_approvals')
      .update({ status })
      .eq('id', approvalId)

    if (error) {
      console.error('Error updating questionnaire approval:', error)
      return NextResponse.json(
        { error: 'Failed to update questionnaire status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error in approve-questionnaire route:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 