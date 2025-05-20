import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { productId, answers } = body

    if (!productId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify product exists and is a questionnaire product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('category')
      .eq('id', productId)
      .single()

    if (productError || !product || product.category !== 'questionnaire_prescription') {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
      )
    }

    // Insert questionnaire approval
    const { data, error } = await supabase
      .from('questionnaire_approvals')
      .insert({
        user_id: user.id,
        product_id: productId,
        questionnaire_answers: answers,
        status: 'pending_approval'
      })
      .select()
      .single()

    if (error) {
      console.error('Error submitting questionnaire:', error)
      return NextResponse.json(
        { error: 'Failed to submit questionnaire' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        status: data.status
      }
    })

  } catch (error) {
    console.error('Error in submit-questionnaire:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 