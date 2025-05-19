'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Cart, CartItem, Product } from '@/lib/types'

interface CartContextType {
  cart: Cart
  loading: boolean
  addToCart: (product: Product, quantity?: number) => Promise<void>
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

  async function addToCart(product: Product, quantity = 1) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please sign in to add items to your cart')
      }

      // Validate product
      if (!product.id) {
        throw new Error('Invalid product')
      }

      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', product.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError
      }

      if (existingItem) {
        await updateQuantity(product.id, existingItem.quantity + quantity)
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            product_id: product.id,
            quantity,
            user_id: session.user.id // Explicitly set user_id
          })

        if (insertError) {
          console.error('Database error:', insertError)
          throw new Error('Failed to add item to cart')
        }
      }

      await fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Re-throw the error so the component can handle it
      throw error instanceof Error ? error : new Error('Failed to add item to cart')
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