'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'

interface QuestionnaireFormProps {
  product: Product
}

interface FormData {
  over18: boolean
  noHeartProblems: boolean
  noNitrates: boolean
  noLiverProblems: boolean
  noRecentStroke: boolean
}

export default function QuestionnaireForm({ product }: QuestionnaireFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    over18: false,
    noHeartProblems: false,
    noNitrates: false,
    noLiverProblems: false,
    noRecentStroke: false
  })

  const handleCheckboxChange = (field: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          answers: formData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit questionnaire')
      }

      // Redirect to account page after successful submission
      router.push('/account/questionnaires')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit questionnaire'
      setError(errorMessage)
      
      // If the error is about authentication, redirect to login
      if (errorMessage.includes('Unauthorized')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="over18"
              checked={formData.over18}
              onChange={() => handleCheckboxChange('over18')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
          </div>
          <div className="ml-3">
            <label htmlFor="over18" className="text-sm font-medium text-gray-700">
              I confirm that I am over 18 years of age
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="noHeartProblems"
              checked={formData.noHeartProblems}
              onChange={() => handleCheckboxChange('noHeartProblems')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
          </div>
          <div className="ml-3">
            <label htmlFor="noHeartProblems" className="text-sm font-medium text-gray-700">
              I do not have any heart problems or chest pain
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="noNitrates"
              checked={formData.noNitrates}
              onChange={() => handleCheckboxChange('noNitrates')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
          </div>
          <div className="ml-3">
            <label htmlFor="noNitrates" className="text-sm font-medium text-gray-700">
              I am not taking any nitrate medications
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="noLiverProblems"
              checked={formData.noLiverProblems}
              onChange={() => handleCheckboxChange('noLiverProblems')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
          </div>
          <div className="ml-3">
            <label htmlFor="noLiverProblems" className="text-sm font-medium text-gray-700">
              I do not have any liver problems
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="noRecentStroke"
              checked={formData.noRecentStroke}
              onChange={() => handleCheckboxChange('noRecentStroke')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
          </div>
          <div className="ml-3">
            <label htmlFor="noRecentStroke" className="text-sm font-medium text-gray-700">
              I have not had a stroke or heart attack in the last 6 months
            </label>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Questionnaire'}
        </button>
      </div>
    </form>
  )
} 