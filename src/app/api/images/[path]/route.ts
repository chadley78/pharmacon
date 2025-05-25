import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function GET(
  request: Request,
  { params }: { params: { path: string } }
) {
  try {
    const path = decodeURIComponent(params.path)
    const supabase = createServiceRoleClient()
    
    const { data, error } = await supabase.storage
      .from('imagery')
      .createSignedUrl(path, 60 * 60 * 24 * 30) // 30 days expiry

    if (error) {
      console.error('Error generating signed URL:', error)
      return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 })
    }

    if (!data?.signedUrl) {
      return NextResponse.json({ error: 'No signed URL generated' }, { status: 404 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    console.error('Error in image URL generation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 