import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { approvalId, action } = await request.json()
    const supabase = await createAdminClient()
    
    if (!approvalId || !action || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from('questionnaire_approvals')
      .update({ status: action })
      .eq('id', approvalId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating questionnaire approval:', error)
    return NextResponse.json(
      { error: 'Failed to update questionnaire approval' },
      { status: 500 }
    )
  }
} 