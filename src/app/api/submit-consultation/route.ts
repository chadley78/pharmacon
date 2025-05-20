import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Test admin client with a simple select
    const { data: testData, error: testError } = await adminClient
      .from('consultation_requests')
      .select('id')
      .limit(1)
    
    console.log('Admin client test:', { testData, testError })

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Auth error:', userError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the request body
    const body = await request.json()
    console.log('Request body:', body)
    const { productId, customerDetails } = body

    if (!productId || !customerDetails) {
      console.error('Missing required fields:', { productId, customerDetails })
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

    if (productError) {
      console.error('Product lookup error:', productError)
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
      )
    }

    if (!product) {
      console.error('Product not found:', { productId })
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Log the data we're about to insert
    const insertData = {
      user_id: user.id,
      product_id: productId,
      customer_details: customerDetails,
      status: 'submitted'
    }
    console.log('Attempting to insert consultation request:', insertData)

    // Try insert with regular client first
    console.log('Attempting insert with regular client...')
    const { data: regularInsert, error: regularError } = await supabase
      .from('consultation_requests')
      .insert(insertData)
      .select()

    if (regularError) {
      console.log('Regular client insert error:', regularError)
    } else {
      console.log('Regular client insert success:', regularInsert)
      return NextResponse.json({
        message: 'Consultation request submitted successfully',
        consultationRequest: regularInsert?.[0]
      })
    }

    // If regular client fails, try with admin client
    console.log('Attempting insert with admin client...')
    const { data: adminInsert, error: adminError } = await adminClient
      .from('consultation_requests')
      .insert(insertData)
      .select()

    if (adminError) {
      console.error('Admin client insert error:', {
        error: adminError,
        errorMessage: adminError.message,
        errorDetails: adminError.details,
        errorHint: adminError.hint,
        errorCode: adminError.code,
        details: insertData
      })
      return NextResponse.json(
        { error: 'Failed to submit consultation request', details: adminError.message },
        { status: 500 }
      )
    }

    // MVP Stub: Log that we would send to 3rd party doctor service
    console.log('Would send to 3rd party doctor service:', {
      consultationRequestId: adminInsert?.[0]?.id,
      customerDetails,
      productId
    })

    return NextResponse.json({
      message: 'Consultation request submitted successfully',
      consultationRequest: adminInsert?.[0]
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 