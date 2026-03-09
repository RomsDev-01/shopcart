import { useState } from 'react'
import { useCart } from '../context/CartContext'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export function useCheckout() {
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState(1) // 1=info, 2=shipping, 3=payment, 4=success
  const [orderData, setOrderData] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))
  const goToStep = (n) => setStep(n)

  const submitOrder = async (formData) => {
    setSubmitting(true)
    const order = {
      id: `SC-${Date.now()}`,
      items,
      total: total + 12, // shipping
      customer: formData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      setOrderData(order)
      clearCart()
      setStep(4)
    } catch {
      // In demo mode, still proceed
      setOrderData(order)
      clearCart()
      setStep(4)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(1)
    setOrderData(null)
  }

  return { step, nextStep, prevStep, goToStep, submitOrder, orderData, submitting, reset }
}