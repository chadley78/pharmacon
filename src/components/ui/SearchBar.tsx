'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
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

  // Update URL with debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
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
  }, [inputValue, debounceMs, router, searchParams, onSubmit])

  // Sync with URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    if (urlQuery !== inputValue) {
      setInputValue(urlQuery)
    }
  }, [searchParams, inputValue])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setIsLoading(true)
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
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
    <form onSubmit={handleSubmit} className={cn('relative w-full max-w-sm', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
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