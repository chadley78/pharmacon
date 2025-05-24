import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SearchBar } from '../SearchBar'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe('SearchBar', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  it('initializes with URL query parameter', () => {
    const searchParams = new URLSearchParams('?q=test')
    ;(useSearchParams as jest.Mock).mockReturnValue(searchParams)

    render(<SearchBar />)
    const input = screen.getByRole('searchbox')
    expect(input).toHaveValue('test')
  })

  it('updates URL after debounce when typing', async () => {
    jest.useFakeTimers()
    render(<SearchBar debounceMs={300} />)
    
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'new search' } })
    
    // URL should not update immediately
    expect(mockRouter.push).not.toHaveBeenCalled()
    
    // Fast-forward past debounce time
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    
    // URL should update after debounce
    expect(mockRouter.push).toHaveBeenCalledWith('/search?q=new+search')
    
    jest.useRealTimers()
  })

  it('syncs with URL changes without creating feedback loop', async () => {
    // Start with empty search
    const searchParams = new URLSearchParams()
    ;(useSearchParams as jest.Mock).mockReturnValue(searchParams)
    
    render(<SearchBar />)
    const input = screen.getByRole('searchbox')
    
    // Type something
    fireEvent.change(input, { target: { value: 'typing' } })
    expect(input).toHaveValue('typing')
    
    // Simulate URL change (e.g., from browser back button)
    const newSearchParams = new URLSearchParams('?q=from-url')
    ;(useSearchParams as jest.Mock).mockReturnValue(newSearchParams)
    
    // Force a re-render to trigger the URL sync effect
    await act(async () => {
      // The URL sync effect should update the input
      render(<SearchBar />, { container: document.body })
    })
    
    // Input should update to match URL
    expect(input).toHaveValue('from-url')
    
    // Verify no feedback loop by checking router.push calls
    // It should only be called for the debounced update, not for the URL sync
    expect(mockRouter.push).toHaveBeenCalledTimes(1)
  })

  it('calls onSubmit prop when provided', async () => {
    const onSubmit = jest.fn()
    jest.useFakeTimers()
    
    render(<SearchBar onSubmit={onSubmit} debounceMs={300} />)
    const input = screen.getByRole('searchbox')
    
    fireEvent.change(input, { target: { value: 'test search' } })
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    
    expect(onSubmit).toHaveBeenCalledWith('test search')
    expect(mockRouter.push).not.toHaveBeenCalled()
    
    jest.useRealTimers()
  })

  it('preserves keystrokes while typing', async () => {
    jest.useFakeTimers()
    render(<SearchBar debounceMs={300} />)
    
    const input = screen.getByRole('searchbox')
    
    // Type multiple characters
    fireEvent.change(input, { target: { value: 't' } })
    expect(input).toHaveValue('t')
    
    fireEvent.change(input, { target: { value: 'te' } })
    expect(input).toHaveValue('te')
    
    fireEvent.change(input, { target: { value: 'tes' } })
    expect(input).toHaveValue('tes')
    
    // Fast-forward past debounce time
    await act(async () => {
      jest.advanceTimersByTime(300)
    })
    
    // URL should update after debounce, but input value should remain
    expect(mockRouter.push).toHaveBeenCalledWith('/search?q=tes')
    expect(input).toHaveValue('tes')
    
    jest.useRealTimers()
  })
}) 