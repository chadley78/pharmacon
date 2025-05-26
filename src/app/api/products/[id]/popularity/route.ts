import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new ratelimiter that allows 1 request per minute per IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, '1 m'),
  analytics: true,
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the IP address from the request
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Rate limit the request
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `popularity_${ip}_${params.id}`
    )

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      )
    }

    const supabase = await createClient()

    // Update the product's popularity
    const { error } = await supabase
      .from('products')
      .update({ 
        popularity: supabase.rpc('increment_popularity', { 
          product_id: params.id,
          decay_factor: 0.95 // 5% decay per update
        })
      })
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product popularity:', error)
    return NextResponse.json(
      { error: 'Failed to update product popularity' },
      { status: 500 }
    )
  }
} 