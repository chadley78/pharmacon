import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  try {
    const supabase = createAdminClient()

    // Check if the product already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', 'online-doctor-consultation')
      .single()

    if (existingProduct) {
      return NextResponse.json(
        { message: 'Doctor consultation product already exists' },
        { status: 200 }
      )
    }

    // Insert the doctor consultation product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: 'Online Doctor Consultation',
        slug: 'online-doctor-consultation',
        description: 'Book a private online consultation with one of our registered doctors. Discuss your health concerns and get professional medical advice from the comfort of your home. Our doctors can provide prescriptions for eligible medications and offer guidance on treatment options.',
        price: 49.99,
        category: 'doctor_consultation',
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting doctor consultation product:', error)
      return NextResponse.json(
        { error: 'Failed to insert doctor consultation product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Doctor consultation product created successfully',
      product,
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 