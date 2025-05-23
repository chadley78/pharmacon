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

  /**
   * URL Sync Effect
   * 
   * This effect syncs the input value with the URL query parameter.
   * It ONLY runs when the URL changes (e.g., through navigation or browser back/forward).
   * 
   * IMPORTANT: Do NOT add inputValue to the dependencies array.
   * Adding inputValue would create a feedback loop:
   * 1. User types → handleChange updates inputValue
   * 2. inputValue change triggers URL sync effect
   * 3. URL sync effect sees empty URL and resets inputValue
   * 4. Repeat for every keystroke
   * 
   * The effect should only depend on searchParams to ensure it only runs
   * when the URL actually changes, not during typing.
   * 
   * ESLint warning about missing dependencies is intentionally ignored here
   * because including inputValue would create a feedback loop.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    console.log('🔍 SearchBar - URL sync effect:', { urlQuery, currentInput: inputValue })
    // Only update if the URL query is different from current input AND we're not in the middle of typing
    if (urlQuery !== inputValue && !isLoading) {
      console.log('🔍 SearchBar - Updating input from URL:', urlQuery)
      setInputValue(urlQuery)
    }
  }, [searchParams]) // Remove inputValue from dependencies to prevent the sync loop

  /**
   * Debounced URL Update Effect
   * 
   * This effect updates the URL after the user stops typing.
   * It runs whenever inputValue changes, but uses a debounce timer
   * to prevent too many URL updates while typing.
   * 
   * The effect is separate from the URL sync effect to maintain
   * a clear separation of concerns:
   * - URL sync effect: Syncs input with URL (URL → input)
   * - Debounce effect: Updates URL from input (input → URL)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        console.log('🔍 SearchBar - Updating URL with value:', inputValue)
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