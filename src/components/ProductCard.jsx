import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, onView }) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    setAdding(true)
    addItem(product, product.sizes?.[0] || '')
    setTimeout(() => setAdding(false), 1200)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <article
      className={`product-card ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(product)}
    >
      <div className="card-image-wrap">
        <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
        {product.badge && (
          <span className={`card-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
            {product.badge}
          </span>
        )}
        {discount && <span className="card-discount">−{discount}%</span>}
        <button
          className={`quick-add ${adding ? 'added' : ''}`}
          onClick={handleAdd}
        >
          {adding ? '✓ Added' : '+ Quick Add'}
        </button>
      </div>

      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-meta">
          <div className="card-rating">
            {'★'.repeat(Math.floor(product.rating))}
            <span className="rating-count">({product.reviews})</span>
          </div>
          <div className="card-price">
            <span className="price-current">${product.price}</span>
            {product.originalPrice && (
              <span className="price-original">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
