'use client'

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from './input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  placeholder?: string
  debounceMs?: number
  onSubmit?: (query: string) => void
}

export function SearchBar({
  className,
  placeholder = 'Search products...',
  debounceMs = 300,
  onSubmit,
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [isLoading, setIsLoading] = useState(false)

  // Sync with URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    console.log('🔍 SearchBar - URL sync effect:', { urlQuery, currentInput: inputValue })
    
    // Only update if the URL query is different from current input AND we're not in the middle of typing
    if (urlQuery !== inputValue && !isLoading) {
      console.log('🔍 SearchBar - Updating input from URL:', urlQuery)
      setInputValue(urlQuery)
    }
  }, [searchParams, inputValue, isLoading]) // Include all dependencies

  // Prevent sync loops by using a ref to track if the update came from URL
  const isUrlUpdate = useRef(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isUrlUpdate.current) {
        isUrlUpdate.current = false
        return
      }
      // Only update URL if the change came from user input
      if (inputValue && !isLoading) {
        isUrlUpdate.current = true
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', inputValue)
        if (onSubmit) {
          onSubmit(inputValue)
        } else {
          router.push(`/search?${params.toString()}`)
        }
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, isLoading, searchParams, router, onSubmit, debounceMs])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('🔍 SearchBar - handleChange called with value:', e.target.value)
    const value = e.target.value
    setInputValue(value)
    setIsLoading(true)
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleSubmit = (e: FormEvent) => {
    console.log('🔍 SearchBar - handleSubmit called')
    e.preventDefault()
    if (inputValue.trim()) {
      console.log('🔍 SearchBar - Submitting search:', inputValue.trim())
      if (onSubmit) {
        onSubmit(inputValue.trim())
      } else {
        const params = new URLSearchParams(searchParams.toString())
        params.set('q', inputValue.trim())
        router.push(`/search?${params.toString()}`)
      }
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn('relative w-full max-w-sm', className)}
      onClick={() => console.log('🔍 SearchBar - Form clicked')}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onClick={() => console.log('🔍 SearchBar - Input clicked')}
          onFocus={() => console.log('🔍 SearchBar - Input focused')}
          className="pl-9 pr-4"
          aria-label="Search products"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </form>
  )
} 