import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i.id === action.payload.id && i.variant === action.payload.variant
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id && i.variant === action.payload.variant
              ? { ...i, qty: i.qty + 1 }
              : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.id === action.payload.id && i.variant === action.payload.variant)
        )
      }
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return {
          ...state,
          items: state.items.filter(
            i => !(i.id === action.payload.id && i.variant === action.payload.variant)
          )
        }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id && i.variant === action.payload.variant
            ? { ...i, qty: action.payload.qty }
            : i
        )
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: action.payload ?? !state.isOpen }
    default:
      return state
  }
}

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  isOpen: false
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product, variant = '') =>
    dispatch({ type: 'ADD_ITEM', payload: { ...product, variant } })

  const removeItem = (id, variant = '') =>
    dispatch({ type: 'REMOVE_ITEM', payload: { id, variant } })

  const updateQty = (id, variant = '', qty) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, variant, qty } })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const toggleDrawer = (val) => dispatch({ type: 'TOGGLE_DRAWER', payload: val })

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQty, clearCart, toggleDrawer, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
