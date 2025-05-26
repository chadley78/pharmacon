'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const fadeInUpAnimation = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes slideArrow {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(4px);
  }
}

.hover-arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.ghost-button:hover .hover-arrow {
  animation: slideArrow 0.3s ease forwards;
}

.ghost-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.ghost-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.ghost-button:hover::before {
  transform: translateX(0);
}
`

export default function HeroBanner() {
  const [scrollY, setScrollY] = useState(0)
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    // Load the image URL when the component mounts
    const loadImageUrl = async () => {
      try {
        const response = await fetch('/api/images/coupleimage%201.png')
        if (!response.ok) throw new Error('Failed to load image URL')
        const data = await response.json()
        setImageUrl(data.url)
      } catch (error) {
        console.error('Error loading hero image:', error)
      }
    }
    loadImageUrl()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style jsx global>{fadeInUpAnimation}</style>
      <section className="relative h-screen">
        {/* Content container */}
        <div className="container mx-auto px-4 h-full relative flex flex-col">
          <div className="flex flex-col md:grid md:grid-cols-2 flex-1">
            {/* Headline and CTA Buttons - Left side on desktop */}
            <div className="md:pt-24 pt-16 order-1 md:order-1 flex flex-col">
              <h1 className="text-6xl sm:text-7xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-text-dark leading-[1.1]">
                Your Health.
                <br />
                Your Way.
              </h1>
              {/* CTA Buttons - Below headline on desktop, bottom of banner on mobile */}
              <div className="flex flex-row md:flex-col justify-center gap-4 mt-8 md:mt-12 md:items-start">
                <Link
                  href="/products?category=men"
                  className="ghost-button relative w-1/2 md:w-auto max-w-[280px] px-6 py-4 border-2 border-text-dark text-text-dark text-sm md:text-lg font-medium tracking-wide rounded-xl text-center transition-all duration-300 animate-fade-in-up opacity-0 hover:bg-text-dark hover:text-white group"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    For Men
                    <svg 
                      className="hover-arrow w-5 h-5 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/products?category=women"
                  className="ghost-button relative w-1/2 md:w-auto max-w-[280px] px-6 py-4 border-2 border-text-dark text-text-dark text-sm md:text-lg font-medium tracking-wide rounded-xl text-center transition-all duration-300 animate-fade-in-up opacity-0 hover:bg-text-dark hover:text-white group"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    For Women
                    <svg 
                      className="hover-arrow w-5 h-5 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Image - Right side on desktop */}
            <div className="relative flex-1 md:flex-none h-[70vh] md:h-full order-2 md:order-2 flex items-end">
              <div 
                className="relative w-full h-full"
                style={{
                  transform: `translateY(${scrollY * 0.5}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Hero"
                    fill
                    priority
                    quality={90}
                    className="object-contain object-bottom md:object-right-bottom"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 