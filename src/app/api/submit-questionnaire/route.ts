import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Validate request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { answers, productId, guestEmail } = body

    // Validate required fields
    if (!answers || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields: answers and productId are required' },
        { status: 400 }
      )
    }

    // Handle both nested and flat answer structures
    const questionnaireAnswers = answers?.answers || answers

    // Validate questionnaire answers structure
    if (typeof questionnaireAnswers !== 'object' || questionnaireAnswers === null) {
      return NextResponse.json(
        { error: 'Invalid questionnaire answers format' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const adminClient = await createAdminClient()

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()

    // Create questionnaire approval record
    const { data: approval, error: insertError } = await adminClient
      .from('questionnaire_approvals')
      .insert({
        user_id: user?.id || null,  // null for guest users
        guest_email: !user ? guestEmail : null,  // email for guest users
        product_id: productId,
        questionnaire_answers: questionnaireAnswers,
        status: 'approved' // Always approved for MVP
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating questionnaire approval:', insertError)
      return NextResponse.json(
        { error: 'Failed to create questionnaire approval' },
        { status: 500 }
      )
    }

    if (!approval) {
      return NextResponse.json(
        { error: 'Failed to create questionnaire approval' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      approvalId: approval.id,
      status: 'approved' // Consistent with database field name
    })
  } catch (error) {
    console.error('Error submitting questionnaire:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 