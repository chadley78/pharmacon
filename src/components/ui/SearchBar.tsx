'use client'

import { useState, useEffect, useCallback, ChangeEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from './input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  className,
  placeholder = 'Search products...',
  debounceMs = 300,
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [isLoading, setIsLoading] = useState(false)

  // Update URL with debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (inputValue) {
        params.set('q', inputValue)
      } else {
        params.delete('q')
      }
      router.push(`/products?${params.toString()}`)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, debounceMs, router, searchParams])

  // Sync with URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    if (urlQuery !== inputValue) {
      setInputValue(urlQuery)
    }
  }, [searchParams])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setIsLoading(true)
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          className="pl-9 pr-4"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  )
} 