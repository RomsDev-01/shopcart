import { useForm } from 'react-hook-form'
import { useCart } from '../context/CartContext'

const STEPS = ['Contact', 'Shipping', 'Payment']

export default function CheckoutForm({ step, nextStep, prevStep, onSubmit, submitting }) {
  const { items, total } = useCart()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onValid = (data) => {
    if (step < 3) nextStep()
    else onSubmit(data)
  }

  return (
    <div className="checkout-layout">
      {/* Steps indicator */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-item ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
            <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-cols">
        <form className="checkout-form" onSubmit={handleSubmit(onValid)} noValidate>

          {/* Step 1: Contact */}
          {step === 1 && (
            <fieldset className="form-section">
              <legend>Contact Information</legend>
              <div className="form-row">
                <div className="form-field">
                  <label>First Name *</label>
                  <input
                    {...register('firstName', { required: 'Required' })}
                    className={errors.firstName ? 'error' : ''}
                    placeholder="Jane"
                  />
                  {errors.firstName && <span className="err-msg">{errors.firstName.message}</span>}
                </div>
                <div className="form-field">
                  <label>Last Name *</label>
                  <input
                    {...register('lastName', { required: 'Required' })}
                    className={errors.lastName ? 'error' : ''}
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="err-msg">{errors.lastName.message}</span>}
                </div>
              </div>
              <div className="form-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                  })}
                  className={errors.email ? 'error' : ''}
                  placeholder="jane@example.com"
                />
                {errors.email && <span className="err-msg">{errors.email.message}</span>}
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input
                  {...register('phone', {
                    pattern: { value: /^[\d\s\-+()]{7,}$/, message: 'Invalid phone' }
                  })}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && <span className="err-msg">{errors.phone.message}</span>}
              </div>
            </fieldset>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <fieldset className="form-section">
              <legend>Shipping Address</legend>
              <div className="form-field">
                <label>Street Address *</label>
                <input
                  {...register('address', { required: 'Required' })}
                  className={errors.address ? 'error' : ''}
                  placeholder="123 Main Street"
                />
                {errors.address && <span className="err-msg">{errors.address.message}</span>}
              </div>
              <div className="form-field">
                <label>Apartment, suite, etc.</label>
                <input {...register('address2')} placeholder="Apt 4B (optional)" />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>City *</label>
                  <input
                    {...register('city', { required: 'Required' })}
                    className={errors.city ? 'error' : ''}
                    placeholder="New York"
                  />
                  {errors.city && <span className="err-msg">{errors.city.message}</span>}
                </div>
                <div className="form-field">
                  <label>State *</label>
                  <input
                    {...register('state', { required: 'Required' })}
                    className={errors.state ? 'error' : ''}
                    placeholder="NY"
                  />
                  {errors.state && <span className="err-msg">{errors.state.message}</span>}
                </div>
                <div className="form-field">
                  <label>ZIP *</label>
                  <input
                    {...register('zip', {
                      required: 'Required',
                      pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP' }
                    })}
                    className={errors.zip ? 'error' : ''}
                    placeholder="10001"
                  />
                  {errors.zip && <span className="err-msg">{errors.zip.message}</span>}
                </div>
              </div>
              <div className="form-field">
                <label>Country *</label>
                <select {...register('country', { required: 'Required' })}>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </fieldset>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <fieldset className="form-section">
              <legend>Payment Details</legend>
              <div className="demo-note">
                🔒 This is a demo — no real payment is processed.
              </div>
              <div className="form-field">
                <label>Cardholder Name *</label>
                <input
                  {...register('cardName', { required: 'Required' })}
                  className={errors.cardName ? 'error' : ''}
                  placeholder="Jane Doe"
                />
                {errors.cardName && <span className="err-msg">{errors.cardName.message}</span>}
              </div>
              <div className="form-field">
                <label>Card Number *</label>
                <input
                  {...register('cardNumber', {
                    required: 'Required',
                    pattern: { value: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, message: 'Enter 16 digits' }
                  })}
                  className={errors.cardNumber ? 'error' : ''}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                />
                {errors.cardNumber && <span className="err-msg">{errors.cardNumber.message}</span>}
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Expiry *</label>
                  <input
                    {...register('expiry', {
                      required: 'Required',
                      pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'MM/YY' }
                    })}
                    className={errors.expiry ? 'error' : ''}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiry && <span className="err-msg">{errors.expiry.message}</span>}
                </div>
                <div className="form-field">
                  <label>CVV *</label>
                  <input
                    {...register('cvv', {
                      required: 'Required',
                      pattern: { value: /^\d{3,4}$/, message: '3-4 digits' }
                    })}
                    className={errors.cvv ? 'error' : ''}
                    placeholder="123"
                    maxLength={4}
                    type="password"
                  />
                  {errors.cvv && <span className="err-msg">{errors.cvv.message}</span>}
                </div>
              </div>
            </fieldset>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn-back" onClick={prevStep}>
                ← Back
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? 'Processing...'
                : step < 3
                ? `Continue to ${STEPS[step]} →`
                : `Place Order — $${(total + 12).toFixed(2)}`}
            </button>
          </div>
        </form>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul className="summary-items">
            {items.map(item => (
              <li key={`${item.id}-${item.variant}`} className="summary-item">
                <div className="summary-item-img-wrap">
                  <img src={item.image} alt={item.name} />
                  <span className="summary-qty">{item.qty}</span>
                </div>
                <div>
                  <div className="summary-item-name">{item.name}</div>
                  {item.variant && <div className="summary-item-variant">{item.variant}</div>}
                </div>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-totals">
            <div><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div><span>Shipping</span><span>$12.00</span></div>
            <div className="summary-grand"><span>Total</span><span>${(total + 12).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
