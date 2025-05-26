'use client'

import { Product } from '@/lib/types'
import { useCartStore } from '@/stores/cartStore'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/ui/Modal'
import QuestionnaireForm from '@/components/forms/QuestionnaireForm'
import Toast from '@/components/ui/Toast'
import { ProductImage } from '@/components/common/ProductImage'

interface ProductDetailsProps {
  product: Product
}

interface QuestionnaireApproval {
  id: string
  status: 'approved' | 'rejected'
}

interface ToastState {
  message: string
  type: 'success' | 'error'
  show: boolean
}

export interface QuestionnaireAnswers {
  over18: boolean;
  noHeartProblems: boolean;
  noNitrates: boolean;
  noLiverProblems: boolean;
  noRecentStroke: boolean;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionnaireApproval, setQuestionnaireApproval] = useState<QuestionnaireApproval | null>(null)
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false)
  const { addItem } = useCartStore()
  const router = useRouter()
  const supabase = createClient()
  const [selectedDosage, setSelectedDosage] = useState(50)
  const [selectedTablets, setSelectedTablets] = useState(8)
  const dosageOptions = [25, 50, 100]
  const tabletOptions = [4, 8, 12]
  const [quantity, setQuantity] = useState(1)
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', show: false })

  useEffect(() => {
    if (product.category === 'restricted') {
      const checkApproval = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) return

          const { data: approval } = await supabase
            .from('questionnaire_approvals')
            .select('id, status')
            .eq('product_id', product.id)
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (approval) {
            setQuestionnaireApproval(approval)
          }
        } catch (error) {
          console.error('Error checking questionnaire approval:', error)
        }
      }
      checkApproval()
    }
  }, [product.id, product.category, supabase])

  // Add popularity tracking
  useEffect(() => {
    const updatePopularity = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/popularity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          // Don't show error to user, just log it
          console.error('Failed to update product popularity')
        }
      } catch (error) {
        // Don't show error to user, just log it
        console.error('Error updating product popularity:', error)
      }
    }

    updatePopularity()
  }, [product.id])

  const handleAddToCart = async () => {
    setLoading(true)
    setError(null)
    try {
      if (product.category === 'restricted') {
        if (!questionnaireApproval || questionnaireApproval.status !== 'approved') {
          setIsQuestionnaireModalOpen(true)
          setLoading(false)
          return
        }
        addItem(product, quantity, questionnaireApproval.id, selectedDosage, selectedTablets)
      } else {
        addItem(product, quantity, undefined, selectedDosage, selectedTablets)
      }
      setToast({
        message: 'Product added to cart successfully!',
        type: 'success',
        show: true
      })
      router.push('/cart')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart'
      setError(errorMessage)
      setToast({
        message: errorMessage,
        type: 'error',
        show: true
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestConsultation = () => {
    router.push(`/consultations/${product.id}`)
  }

  const handleCloseQuestionnaireModal = () => {
    setIsQuestionnaireModalOpen(false)
  }

  const handleQuestionnaireSubmit = async (data: { answers: QuestionnaireAnswers; productId: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error(result.error || 'Failed to submit questionnaire')
      }

      if (result.status === 'approved') {
        setIsQuestionnaireModalOpen(false)
        addItem(product, quantity, result.approvalId, selectedDosage, selectedTablets)
        setToast({
          message: 'Product added to cart successfully!',
          type: 'success',
          show: true
        })
        router.push('/cart')
      } else {
        setToast({
          message: 'Your questionnaire was rejected. Please try again or contact support.',
          type: 'error',
          show: true
        })
        setIsQuestionnaireModalOpen(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit questionnaire'
      setError(errorMessage)
      setToast({
        message: errorMessage,
        type: 'error',
        show: true
      })
    } finally {
      setLoading(false)
    }
  }

  const getButtonText = () => {
    if (product.category === 'prescription') {
      return 'Get Instant Prescription'
    }
    return 'Add to Cart'
  }

  const isButtonDisabled = () => {
    if (loading) return true
    return false
  }

  const handleButtonClick = () => {
    if (product.category === 'prescription') {
      handleRequestConsultation()
    } else {
      handleAddToCart()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Section */}
      <div className="relative w-full h-[60vh]">
        <div className="absolute inset-0 w-full h-full">
          <ProductImage 
            product={product} 
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
      {/* Details Section */}
      <div className="relative w-full bg-white rounded-t-3xl md:rounded-t-[48px] rounded-b-none -mt-24 pb-12 shadow-2xl">
        <div className="max-w-2xl mx-auto p-6 pt-12 text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              €{product.price.toFixed(2)}
            </p>
          </div>
          <div className="mt-6">
              <div className="mt-6">
                {/* Dosage Option */}
                <div>
                  <div className="text-sm md:text-base font-light mb-2 text-gray-600">Dosage (mg)</div>
                  <div className="flex gap-3">
                    {dosageOptions.map((dose) => (
                      <button
                        key={dose}
                        type="button"
                        onClick={() => setSelectedDosage(dose)}
                        className={`px-4 py-2 rounded-full border transition-all duration-150 shadow-sm text-sm md:text-base font-medium
                          ${selectedDosage === dose
                            ? 'bg-yellow-400 text-black border-yellow-500 shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                        `}
                      >
                        {dose}mg
                      </button>
                    ))}
                  </div>
                </div>
                {/* Tablet Count Option */}
                <div className="mt-4">
                  <div className="text-sm md:text-base font-light mb-2 text-gray-600">Number of Tablets</div>
                  <div className="flex gap-3">
                    {tabletOptions.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSelectedTablets(count)}
                        className={`px-4 py-2 rounded-full border transition-all duration-150 shadow-sm text-sm md:text-base font-medium
                          ${selectedTablets === count
                            ? 'bg-yellow-400 text-black border-yellow-500 shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                        `}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
          </div>
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm text-gray-600">Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 shadow-sm focus:outline-none"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="px-3 text-gray-900 font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 shadow-sm focus:outline-none"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          <div className="mt-8">
            {error && (
              <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isButtonDisabled()}
              className="w-full bg-yellow-400 text-black px-6 py-3 rounded-full text-base font-bold shadow-md hover:bg-yellow-300 hover:shadow-xl active:bg-yellow-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Loading...' : getButtonText()}
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            <div className="space-y-6 text-base text-gray-700">
              {/* Description */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p>{product.description}</p>
              </div>

              {/* Manufacturer */}
              {product.manufacturer && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Manufacturer</h4>
                  <p>{product.manufacturer}</p>
                </div>
              )}

              {/* Dosage Instructions */}
              {product.dosage_instructions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dosage Instructions</h4>
                  <p>{product.dosage_instructions}</p>
                </div>
              )}

              {/* Side Effects */}
              {product.side_effects && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Side Effects</h4>
                  <p>{product.side_effects}</p>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ingredients</h4>
                  <p>{product.ingredients}</p>
                </div>
              )}

              {/* Storage Instructions */}
              {product.storage_instructions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Storage Instructions</h4>
                  <p>{product.storage_instructions}</p>
                </div>
              )}

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Category: {product.category.replace('_', ' ').toUpperCase()}</li>
                  {product.requires_prescription && (
                    <li>This product requires a prescription</li>
                  )}
                  {product.stock_quantity > 0 ? (
                    <li>In Stock: {product.stock_quantity} units available</li>
                  ) : (
                    <li className="text-red-600">Out of Stock</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {questionnaireApproval?.status === 'rejected' && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
              Your questionnaire was rejected. Please try again or contact support for more information.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isQuestionnaireModalOpen} 
        onClose={handleCloseQuestionnaireModal}
      >
        <div className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Questionnaire for {product.name}</h2>
          <QuestionnaireForm 
            productId={product.id}
            onSubmit={handleQuestionnaireSubmit}
          />
        </div>
      </Modal>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  )
} 