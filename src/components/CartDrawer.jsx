import { useCart } from '../context/CartContext'

export default function CartDrawer({ onCheckout }) {
  const { items, isOpen, toggleDrawer, removeItem, updateQty, total, count } = useCart()

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => toggleDrawer(false)}
      />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">
            Your Cart
            {count > 0 && <span className="drawer-count">{count}</span>}
          </h2>
          <button className="drawer-close" onClick={() => toggleDrawer(false)}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">◈</div>
            <p>Your cart is empty</p>
            <button className="btn-primary" onClick={() => toggleDrawer(false)}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(item => (
                <li key={`${item.id}-${item.variant}`} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    {item.variant && (
                      <span className="cart-item-variant">{item.variant}</span>
                    )}
                    <div className="cart-item-controls">
                      <div className="qty-control">
                        <button onClick={() => updateQty(item.id, item.variant, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.variant, item.qty + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.id, item.variant)}
                  >✕</button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="cart-shipping">
                <span>Shipping</span>
                <span className="free-ship">$12.00</span>
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span>${(total + 12).toFixed(2)}</span>
              </div>
              <button
                className="btn-checkout"
                onClick={() => { toggleDrawer(false); onCheckout() }}
              >
                Proceed to Checkout →
              </button>
              <button className="btn-continue" onClick={() => toggleDrawer(false)}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
