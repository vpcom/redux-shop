import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type CartItem = {
  productId: string
  price: number
  title: string
  qty: number
}

type CartState = {
  items: Record<string, CartItem> // keyed by productId
  coupon?: { code: string; pct: number }
}

const initialState: CartState = { items: {} }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ productId: string; price: number; title: string; qty?: number }>
    ) => {
      const { productId, price, title, qty = 1 } = action.payload
      const existing = state.items[productId]
      state.items[productId] = existing
        ? { ...existing, qty: existing.qty + qty }
        : { productId, price, title, qty }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      delete state.items[action.payload.productId]
    },
    setQty: (state, action: PayloadAction<{ productId: string; qty: number }>) => {
      const it = state.items[action.payload.productId]
      if (it) it.qty = Math.max(1, action.payload.qty)
    },
    applyCoupon: (state, action: PayloadAction<{ code: string; pct: number }>) => {
      state.coupon = action.payload
    },
    clearCart: () => initialState,
  },
})

export const { addToCart, removeFromCart, setQty, applyCoupon, clearCart } = cartSlice.actions
export default cartSlice.reducer

// selectors
export const selectCartItems = createSelector(
  (s: RootState) => s.cart.items,
  (items) => Object.values(items)
)
export const selectSubtotal = createSelector(selectCartItems, items =>
  items.reduce((sum, it) => sum + it.price * it.qty, 0)
)
export const selectTotal = (s: RootState) => {
  const subtotal = selectSubtotal(s)
  const pct = s.cart.coupon?.pct ?? 0
  return Math.round(subtotal * (1 - pct / 100) * 100) / 100
}