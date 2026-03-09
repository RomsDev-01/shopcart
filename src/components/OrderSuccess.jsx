export default function OrderSuccess({ order, onReset }) {
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p className="success-sub">
          Thank you, {order?.customer?.firstName}! Your order has been placed successfully.
        </p>
        <div className="order-ref">
          Order <strong>{order?.id}</strong>
        </div>
        <div className="success-details">
          <div>
            <span>Confirmation sent to</span>
            <strong>{order?.customer?.email}</strong>
          </div>
          <div>
            <span>Estimated delivery</span>
            <strong>3–5 business days</strong>
          </div>
          <div>
            <span>Order total</span>
            <strong>${order?.total?.toFixed(2)}</strong>
          </div>
        </div>
        <div className="success-items">
          {order?.items?.map(item => (
            <div key={`${item.id}-${item.variant}`} className="success-item">
              <img src={item.image} alt={item.name} />
              <span>{item.name} × {item.qty}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={onReset}>
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
