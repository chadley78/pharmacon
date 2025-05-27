import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a rate limiter only if Redis is configured
let ratelimit: Ratelimit | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(1, '1 m'),
      analytics: true,
    })
  } else {
    console.warn('Redis rate limiting disabled: UPSTASH_REDIS_REST_URL and/or UPSTASH_REDIS_REST_TOKEN not configured')
  }
} catch (error) {
  console.error('Failed to initialize Redis rate limiter:', error)
  ratelimit = null
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the IP address from the request
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Apply rate limiting only if Redis is configured
    if (ratelimit) {
      try {
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
      } catch (rateLimitError) {
        // Log the error but continue with the popularity update
        console.error('Rate limiting failed:', rateLimitError)
      }
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