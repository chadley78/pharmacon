'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { getSignedUrl } from '@/lib/supabase/storage'

// A simple gray placeholder image as a data URL
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBsb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg=='

export default function HeroBanner() {
  const [scrollY, setScrollY] = useState(0)
  const [imageUrl, setImageUrl] = useState<string>(PLACEHOLDER_IMAGE)
  const [loading, setLoading] = useState(true)

  const loadImageUrl = useCallback(async () => {
    try {
      const url = await getSignedUrl('coupleimage 1.png')
      setImageUrl(url)
    } catch (error) {
      console.error('Error loading hero image URL:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadImageUrl()
  }, [loadImageUrl])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-screen">
      {/* Content container */}
      <div className="container mx-auto px-4 h-full relative">
        <div className="flex flex-col md:grid md:grid-cols-2 h-full">
          {/* Headline - Above image on mobile, left side on desktop */}
          <div className="md:pt-24 pt-16 order-1 md:order-1">
            <h1 className="text-6xl sm:text-7xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-text-dark leading-[1.1]">
              Your Health.
              <br />
              Your Way.
            </h1>
          </div>

          {/* Image - Below headline on mobile, right side on desktop */}
          <div className="relative flex-1 md:flex-none h-[70vh] md:h-full order-2 md:order-2 flex items-end">
            {loading ? (
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            ) : (
              <div 
                className="relative w-full h-full"
                style={{
                  transform: `translateY(${scrollY * 0.5}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <Image
                  src={imageUrl}
                  alt="Hero"
                  fill
                  priority
                  className="object-contain object-bottom md:object-right-bottom"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 