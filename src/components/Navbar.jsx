import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'

export default function Navbar({ onCheckout }) {
  const { count, toggleDrawer } = useCart()
  const { setFilter, filters } = useProducts()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <a className="brand" href="#">
          <span className="brand-icon">◆</span>
          <span>ShopCart</span>
        </a>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['all', 'clothing', 'accessories', 'home', 'beauty'].map(cat => (
            <button
              key={cat}
              className={`nav-link ${filters.category === cat ? 'active' : ''}`}
              onClick={() => { setFilter({ category: cat }); setMenuOpen(false) }}
            >
              {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={e => setFilter({ search: e.target.value })}
              className="nav-search"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>

          <button className="cart-btn" onClick={() => toggleDrawer(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}
