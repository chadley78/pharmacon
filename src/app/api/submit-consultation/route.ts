import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the request body
    const { productId, customerDetails } = await request.json()

    if (!productId || !customerDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the product exists and is a doctor consultation
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, category')
      .eq('id', productId)
      .eq('category', 'doctor_consultation')
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
      )
    }

    // Insert the consultation request
    const { data: consultationRequest, error: insertError } = await supabase
      .from('consultation_requests')
      .insert({
        user_id: user.id,
        product_id: productId,
        customer_details: customerDetails,
        status: 'submitted'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting consultation request:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit consultation request' },
        { status: 500 }
      )
    }

    // MVP Stub: Log that we would send to 3rd party doctor service
    console.log('Would send to 3rd party doctor service:', {
      consultationRequestId: consultationRequest.id,
      customerDetails,
      productId
    })

    return NextResponse.json({
      message: 'Consultation request submitted successfully',
      consultationRequest
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 