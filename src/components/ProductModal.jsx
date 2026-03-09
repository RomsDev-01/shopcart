import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function ProductModal({ product, onClose }) {
  const { addItem, toggleDrawer } = useCart()
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return null

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem(product, `${selectedSize}${selectedColor ? ' / ' + selectedColor : ''}`)
    }
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
      toggleDrawer(true)
    }, 800)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-grid">
          <div className="modal-image-wrap">
            <img src={product.image} alt={product.name} className="modal-image" />
            {product.badge && <span className={`card-badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
          </div>

          <div className="modal-details">
            <span className="modal-category">{product.category}</span>
            <h2 className="modal-name">{product.name}</h2>

            <div className="modal-rating">
              {'★'.repeat(Math.floor(product.rating))}
              <span>{product.rating}</span>
              <span className="rating-count">({product.reviews} reviews)</span>
            </div>

            <div className="modal-price">
              <span className="price-current large">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="price-original">${product.originalPrice}</span>
                  <span className="price-save">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="modal-desc">{product.description}</p>

            {product.sizes?.length > 1 && (
              <div className="modal-option">
                <label>Size: <strong>{selectedSize}</strong></label>
                <div className="option-chips">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`chip ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="modal-option">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="option-chips">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      className={`chip ${selectedColor === c ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >{c}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-qty">
              <label>Quantity</label>
              <div className="qty-control large">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <span className="stock-note">{product.stock} in stock</span>
            </div>

            <button
              className={`btn-add-modal ${added ? 'added' : ''}`}
              onClick={handleAdd}
            >
              {added ? '✓ Added to Cart!' : `Add to Cart — $${(product.price * qty).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
