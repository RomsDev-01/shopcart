import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { useCheckout } from './hooks/useCheckout'
import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import CheckoutForm from './components/CheckoutForm'
import OrderSuccess from './components/OrderSuccess'
import { useProducts } from './context/ProductContext'

function Shop({ onCheckout }) {
  const { filtered, loading, error } = useProducts()
  const [selected, setSelected] = useState(null)

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner" />
      <p>Loading products...</p>
    </div>
  )

  if (error) return (
    <div className="error-state">
      <p>⚠ Could not load products. Is JSON Server running?</p>
      <code>npm run server</code>
    </div>
  )

  return (
    <>
      <FilterBar />
      <main className="shop-grid-wrap">
        <div className="shop-grid">
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>No products match your filters.</p>
              <button onClick={() => window.location.reload()}>Reset</button>
            </div>
          ) : (
            filtered.map(p => (
              <ProductCard key={p.id} product={p} onView={setSelected} />
            ))
          )}
        </div>
      </main>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  )
}

function CheckoutPage({ onBack }) {
  const { step, nextStep, prevStep, submitOrder, orderData, submitting, reset } = useCheckout()

  const handleReset = () => { reset(); onBack() }

  if (step === 4) return <OrderSuccess order={orderData} onReset={handleReset} />

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-to-shop" onClick={onBack}>← Back to Shop</button>
        <h1 className="checkout-title">Checkout</h1>
      </div>
      <CheckoutForm
        step={step}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={submitOrder}
        submitting={submitting}
      />
    </div>
  )
}

function AppInner() {
  const [page, setPage] = useState('shop')

  return (
    <div className="app">
      <Navbar onCheckout={() => setPage('checkout')} />
      {page === 'shop' ? (
        <Shop onCheckout={() => setPage('checkout')} />
      ) : (
        <CheckoutPage onBack={() => setPage('shop')} />
      )}
      <CartDrawer onCheckout={() => setPage('checkout')} />

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="brand">◆ ShopCart</span>
          <span>© {new Date().getFullYear()} — Built with React + JSON Server</span>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <ProductProvider>
        <AppInner />
      </ProductProvider>
    </CartProvider>
  )
}
