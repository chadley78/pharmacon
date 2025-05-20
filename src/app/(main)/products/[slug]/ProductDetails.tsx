'use client'

import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/context/CartContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

interface ProductDetailsProps {
  product: Product
}

interface QuestionnaireApproval {
  id: string
  status: 'pending_approval' | 'approved' | 'rejected'
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionnaireApproval, setQuestionnaireApproval] = useState<QuestionnaireApproval | null>(null)
  const { addToCart } = useCart()
  const router = useRouter()
  const supabase = createClient()
  const [selectedDosage, setSelectedDosage] = useState(50)
  const [selectedTablets, setSelectedTablets] = useState(8)
  const dosageOptions = [25, 50, 100]
  const tabletOptions = [4, 8, 12]
  const [quantity, setQuantity] = useState(1)

  const getGradientClass = (category: string) => {
    switch (category) {
      case 'direct_purchase':
        return 'from-yellow-400 to-yellow-100'
      case 'questionnaire_prescription':
        return 'from-fuchsia-700 to-pink-400'
      case 'doctor_consultation':
        return 'from-fuchsia-700 to-pink-400'
      default:
        return 'from-gray-100 to-gray-200'
    }
  }

  useEffect(() => {
    if (product.category === 'questionnaire_prescription') {
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

  const handleAddToCart = async () => {
    setLoading(true)
    setError(null)
    try {
      if (product.category === 'questionnaire_prescription' && questionnaireApproval?.status === 'approved') {
        await addToCart(product, quantity, questionnaireApproval.id, selectedDosage, selectedTablets)
      } else {
        await addToCart(product, quantity, undefined, selectedDosage, selectedTablets)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart'
      setError(errorMessage)
      if (errorMessage.includes('sign in')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRequestConsultation = () => {
    router.push(`/consultations/${product.id}`)
  }

  const handleStartQuestionnaire = () => {
    router.push(`/questionnaire/${product.id}`)
  }

  const getButtonText = () => {
    if (product.category === 'doctor_consultation') {
      return 'Request Consultation'
    }
    if (product.category === 'questionnaire_prescription') {
      if (questionnaireApproval?.status === 'approved') {
        return 'Add to Cart'
      }
      if (questionnaireApproval?.status === 'pending_approval') {
        return 'Questionnaire Pending Approval'
      }
      if (questionnaireApproval?.status === 'rejected') {
        return 'Questionnaire Rejected'
      }
      return 'Answer Questions'
    }
    return 'Add to Cart'
  }

  const isButtonDisabled = () => {
    if (loading) return true
    if (product.category === 'questionnaire_prescription') {
      if (questionnaireApproval?.status === 'pending_approval') return true
      if (questionnaireApproval?.status === 'rejected') return true
    }
    return false
  }

  const handleButtonClick = () => {
    if (product.category === 'doctor_consultation') {
      handleRequestConsultation()
    } else if (product.category === 'questionnaire_prescription') {
      if (questionnaireApproval?.status === 'approved') {
        handleAddToCart()
      } else if (!questionnaireApproval || questionnaireApproval.status === 'rejected') {
        handleStartQuestionnaire()
      }
    } else {
      handleAddToCart()
    }
  }

  return (
    <div className="w-full min-h-screen bg-white relative overflow-visible">
      {/* Gradient/Image Section */}
      <div className={`w-full bg-gradient-to-br ${getGradientClass(product.category)} flex flex-col items-center justify-center`} style={{ minHeight: '500px' }}>
        <div className="relative z-10 flex justify-center w-full" style={{ paddingBottom: '100px' }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={320}
              height={320}
              className="object-contain h-[40vh] max-h-80 w-auto mx-auto filter drop-shadow-2xl"
              priority
            />
          ) : (
            <div className="h-[40vh] max-h-80 w-60 flex items-center justify-center bg-gray-100 rounded-2xl filter drop-shadow-2xl">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      </div>
      {/* Details Section */}
      <div className="w-full bg-white rounded-t-3xl md:rounded-t-[48px] rounded-b-none -mt-24 pb-12 px-6 sm:px-8 lg:px-0 shadow-2xl">
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
            {(product.category === 'direct_purchase' || (product.category === 'questionnaire_prescription' && questionnaireApproval?.status === 'approved')) && (
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
            )}
          </div>
          {/* Quantity Selector */}
          {(product.category === 'direct_purchase' || (product.category === 'questionnaire_prescription' && questionnaireApproval?.status === 'approved')) && (
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
          )}
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
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base md:text-lg text-gray-700">
              {product.description}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Mauris consequat, velit at volutpat gravida, orci velit dictum erat, at cursus enim erat eu urna.</p>
              <p>Phasellus euismod, justo at facilisis cursus, urna erat laoreet erat, nec dictum erat urna eu urna. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.</p>
              <p>Aliquam erat volutpat. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.</p>
              <p>Morbi non urna nec sapien dictum ultricies. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.</p>
            </div>
          </div>
          {questionnaireApproval?.status === 'rejected' && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
              Your questionnaire was rejected. Please try again or contact support for more information.
            </div>
          )}
          {questionnaireApproval?.status === 'pending_approval' && (
            <div className="mt-4 p-4 text-sm text-yellow-700 bg-yellow-100 rounded-md">
              Your questionnaire is pending approval. We will notify you once it has been reviewed.
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 