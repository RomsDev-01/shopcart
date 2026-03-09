import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

const ProductContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'RESET_FILTERS':
      return { ...state, filters: initialFilters }
    case 'SET_SELECTED':
      return { ...state, selected: action.payload }
    default:
      return state
  }
}

const initialFilters = {
  category: 'all',
  minPrice: 0,
  maxPrice: 500,
  sort: 'featured',
  search: ''
}

const initialState = {
  products: [],
  loading: true,
  error: null,
  filters: initialFilters,
  selected: null
}

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState)

  const fetchProducts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch(`${API_BASE}/products`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      dispatch({ type: 'SET_PRODUCTS', payload: data })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setFilter = (updates) => dispatch({ type: 'SET_FILTER', payload: updates })
  const resetFilters = () => dispatch({ type: 'RESET_FILTERS' })
  const setSelected = (product) => dispatch({ type: 'SET_SELECTED', payload: product })

  const filtered = state.products
    .filter(p => {
      const { category, minPrice, maxPrice, search } = state.filters
      if (category !== 'all' && p.category !== category) return false
      if (p.price < minPrice || p.price > maxPrice) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (state.filters.sort) {
        case 'price_asc': return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
        case 'rating': return b.rating - a.rating
        case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default: return 0
      }
    })

  const categories = ['all', ...new Set(state.products.map(p => p.category))]

  return (
    <ProductContext.Provider
      value={{
        ...state,
        filtered,
        categories,
        setFilter,
        resetFilters,
        setSelected,
        refetch: fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}