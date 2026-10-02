import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Address, CartQuantities, PaymentMethod, Product } from '../Storefront/types'

type PaymentPageProps = {
  products: Product[]
  quantities: CartQuantities
  subtotal: number
  address: Address
  paymentMethods: PaymentMethod[]
  onPlaceOrder: (paymentMethodId: string) => void
}

export function PaymentPage({ products, quantities, subtotal, address, paymentMethods, onPlaceOrder }: PaymentPageProps) {
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods.find((method) => method.isDefault)?.id ?? paymentMethods[0].id)
  const items = products.filter((product) => quantities[product.id] > 0)
  const shipping = subtotal >= 150 ? 0 : 8
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  return (
    <section className="section-block content-page checkout-page">
      <p className="eyebrow">The last little steps</p><h1>Payment</h1>
      <div className="checkout-progress" aria-label="Checkout progress"><span className="complete">01 <b>Bag</b></span><i /><span className="complete">02 <b>Delivery</b></span><i /><span className="current">03 <b>Payment</b></span></div>
      <div className="checkout-layout">
        <div className="checkout-form">
          <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>Delivery address</h2><Link className="text-link" to="/checkout/address">Edit</Link></div><address className="delivery-address">{address.firstName} {address.lastName}<br />{address.addressLine1}{address.addressLine2 && <><br />{address.addressLine2}</>}<br />{address.city}, {address.region} {address.postalCode}<br />{address.country}</address></section>
          <section className="checkout-section"><div className="checkout-section-heading"><span>03</span><h2>Choose payment</h2><small>Demo only · no charge</small></div><div className="payment-method-list">{paymentMethods.map((method) => <label className="payment-method" key={method.id}><input type="radio" name="paymentMethod" value={method.id} checked={paymentMethodId === method.id} onChange={() => setPaymentMethodId(method.id)} /><span className="payment-radio" /><span className="payment-copy"><strong>{method.name}</strong><small>{method.display}</small></span><span className="payment-mark">{method.type === 'test-card' ? 'TEST' : 'PAY'}</span></label>)}</div></section>
          <button className="button button-dark full-button place-order-button" onClick={() => onPlaceOrder(paymentMethodId)}>Place demo order · ${total.toFixed(2)} <span>↗</span></button>
          <p className="checkout-disclaimer">This is a local demo. No real payment details are collected or charged.</p>
        </div>
        <aside className="order-summary checkout-summary"><p className="eyebrow">Your selection</p><h2>Order summary</h2>{items.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · Qty {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p><p><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}</span></p><p><span>Estimated tax</span><span>${tax.toFixed(2)}</span></p><div className="summary-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div></div></aside>
      </div>
    </section>
  )
}