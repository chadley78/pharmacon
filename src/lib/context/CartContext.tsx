'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Cart, CartItem, Product } from '@/lib/types'

interface CartContextType {
  cart: Cart
  loading: boolean
  addToCart: (product: Product, quantity?: number, questionnaireApprovalId?: string, dosage?: number, tablet_count?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Fetch cart items on mount and when auth state changes
  useEffect(() => {
    fetchCart()
  }, [])

  async function fetchCart() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setCart({ items: [], total: 0 })
        setLoading(false)
        return
      }

      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const items = cartItems as CartItem[]
      const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
      setCart({ items, total })
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addToCart(product: Product, quantity = 1, questionnaireApprovalId?: string, dosage?: number, tablet_count?: number) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please sign in to add items to your cart')
      }

      // Validate product
      if (!product.id) {
        throw new Error('Invalid product')
      }

      // For questionnaire products, require an approval ID
      if (product.category === 'questionnaire_prescription' && !questionnaireApprovalId) {
        throw new Error('Questionnaire approval is required for this product')
      }

      // Verify the questionnaire approval if provided
      if (questionnaireApprovalId) {
        const { data: approval, error: approvalError } = await supabase
          .from('questionnaire_approvals')
          .select('status')
          .eq('id', questionnaireApprovalId)
          .eq('user_id', session.user.id)
          .eq('product_id', product.id)
          .single()

        if (approvalError) {
          console.error('Approval verification error:', approvalError)
          throw new Error(`Failed to verify questionnaire approval: ${approvalError.message}`)
        }

        if (!approval || approval.status !== 'approved') {
          throw new Error('Invalid or unapproved questionnaire')
        }
      }

      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', product.id)
        .eq('dosage', dosage ?? null)
        .eq('tablet_count', tablet_count ?? null)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Fetch existing item error:', fetchError)
        throw new Error(`Failed to check existing cart item: ${fetchError.message}`)
      }

      if (existingItem) {
        await updateQuantity(product.id, existingItem.quantity + quantity)
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            product_id: product.id,
            quantity,
            user_id: session.user.id,
            questionnaire_approval_id: questionnaireApprovalId,
            dosage,
            tablet_count
          })

        if (insertError) {
          console.error('Insert cart item error:', insertError)
          throw new Error(`Failed to add item to cart: ${insertError.message}`)
        }
      }

      await fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Re-throw the error with more context
      if (error instanceof Error) {
        throw error
      } else if (typeof error === 'object' && error !== null) {
        throw new Error(`Database error: ${JSON.stringify(error)}`)
      } else {
        throw new Error('Failed to add item to cart')
      }
    }
  }

  async function removeFromCart(productId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('product_id', productId)

      if (error) throw error
      await fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  async function updateQuantity(productId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId)
        return
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('product_id', productId)

      if (error) throw error
      await fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  async function clearCart() {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .neq('id', '') // Delete all items

      if (error) throw error
      setCart({ items: [], total: 0 })
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 