import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem as DBCartItem, Product } from '@/lib/types'

// Type for cart items in local storage (omits user_id)
export type LocalCartItem = Omit<DBCartItem, 'user_id'>

interface CartStore {
  // State
  items: LocalCartItem[]
  total: number
  
  // Actions
  addItem: (product: Product, quantity?: number, questionnaireApprovalId?: string, dosage?: number, tablet_count?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  mergeGuestCartWithUserCart: (userId: string) => void
}

// Helper to calculate cart total
const calculateTotal = (items: LocalCartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      total: 0,

      // Actions
      addItem: (product, quantity = 1, questionnaireApprovalId, dosage, tablet_count) => {
        const currentItems = get().items
        const existingItemIndex = currentItems.findIndex(
          item => 
            item.product_id === product.id && 
            item.dosage === dosage && 
            item.tablet_count === tablet_count
        )

        let newItems: LocalCartItem[]
        if (existingItemIndex > -1) {
          // Update existing item quantity
          newItems = currentItems.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity, updated_at: new Date().toISOString() }
              : item
          )
        } else {
          // Add new item
          const newItem: LocalCartItem = {
            id: crypto.randomUUID(), // Generate a temporary ID for local storage
            product_id: product.id,
            product: product,
            quantity,
            questionnaire_approval_id: questionnaireApprovalId,
            dosage,
            tablet_count,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          newItems = [...currentItems, newItem]
        }

        set({ 
          items: newItems,
          total: calculateTotal(newItems)
        })
      },

      removeItem: (productId) => {
        const newItems = get().items.filter(item => item.product_id !== productId)
        set({ 
          items: newItems,
          total: calculateTotal(newItems)
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const newItems = get().items.map(item =>
          item.product_id === productId
            ? { ...item, quantity, updated_at: new Date().toISOString() }
            : item
        )
        set({ 
          items: newItems,
          total: calculateTotal(newItems)
        })
      },

      clearCart: () => {
        set({ items: [], total: 0 })
      },

      // Placeholder for future implementation
      mergeGuestCartWithUserCart: (userId: string) => {
        console.log('Would merge guest cart with user cart for user:', userId)
        // For now, just clear the cart after logging
        get().clearCart()
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      // Persist full cart data including product information
      partialize: (state) => ({
        items: state.items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product: item.product, // Include full product information
          quantity: item.quantity,
          questionnaire_approval_id: item.questionnaire_approval_id,
          dosage: item.dosage,
          tablet_count: item.tablet_count,
          created_at: item.created_at,
          updated_at: item.updated_at
        })),
        total: state.total
      })
    }
  )
) 