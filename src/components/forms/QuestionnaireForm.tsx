'use client'

import { useState } from 'react'

interface QuestionnaireFormProps {
  productId: string;
  onSubmit: (data: QuestionnaireData) => Promise<void>;
}

interface QuestionnaireData {
  answers: {
    over18: boolean;
    noHeartProblems: boolean;
    noNitrates: boolean;
    noLiverProblems: boolean;
    noRecentStroke: boolean;
  };
  productId: string;
}

export default function QuestionnaireForm({ productId, onSubmit }: QuestionnaireFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<QuestionnaireData['answers']>({
    over18: false,
    noHeartProblems: false,
    noNitrates: false,
    noLiverProblems: false,
    noRecentStroke: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSubmit({
        answers: formData,
        productId
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit questionnaire')
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

      {/* Age Verification */}
      <div className="space-y-2">
        <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.over18}
            onChange={(e) => setFormData(prev => ({ ...prev, over18: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              required
            />
          <span className="text-sm text-gray-700">
              I confirm that I am over 18 years of age
          </span>
            </label>
        </div>

      {/* Heart Problems */}
      <div className="space-y-2">
        <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.noHeartProblems}
            onChange={(e) => setFormData(prev => ({ ...prev, noHeartProblems: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              required
            />
          <span className="text-sm text-gray-700">
            I confirm that I do not have any heart problems
          </span>
            </label>
        </div>

      {/* Nitrate Medications */}
      <div className="space-y-2">
        <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.noNitrates}
            onChange={(e) => setFormData(prev => ({ ...prev, noNitrates: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              required
            />
          <span className="text-sm text-gray-700">
            I confirm that I am not taking any nitrate medications
          </span>
            </label>
        </div>

      {/* Liver Problems */}
      <div className="space-y-2">
        <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.noLiverProblems}
            onChange={(e) => setFormData(prev => ({ ...prev, noLiverProblems: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              required
            />
          <span className="text-sm text-gray-700">
            I confirm that I do not have any liver problems
          </span>
            </label>
        </div>

      {/* Recent Stroke/Heart Attack */}
      <div className="space-y-2">
        <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.noRecentStroke}
            onChange={(e) => setFormData(prev => ({ ...prev, noRecentStroke: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              required
            />
          <span className="text-sm text-gray-700">
            I confirm that I have not had a stroke or heart attack in the last 6 months
          </span>
            </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black px-6 py-3 rounded-full text-base font-bold shadow-md hover:bg-yellow-300 hover:shadow-xl active:bg-yellow-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Submitting...' : 'Submit Questionnaire'}
        </button>
      </div>
    </form>
  )
} 