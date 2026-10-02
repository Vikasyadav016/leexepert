import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Address, CartQuantities, PaymentMethod, Product } from '../Storefront/types'
import paymentText from '../../TextJson/Checkout/PaymentPage.json'
import './Checkout.css'

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
      <p className="eyebrow">{paymentText.eyebrow}</p><h1>{paymentText.title}</h1>
      <div className="checkout-progress" aria-label="Checkout progress"><span className="complete">01 <b>{paymentText.bag}</b></span><i /><span className="complete">02 <b>{paymentText.delivery}</b></span><i /><span className="current">03 <b>{paymentText.payment}</b></span></div>
      <div className="checkout-layout">
        <div className="checkout-form">
          <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>{paymentText.deliveryAddress}</h2><Link className="text-link" to="/checkout/address">{paymentText.edit}</Link></div><address className="delivery-address">{address.firstName} {address.lastName}<br />{address.addressLine1}{address.addressLine2 && <><br />{address.addressLine2}</>}<br />{address.city}, {address.region} {address.postalCode}<br />{address.country}</address></section>
          <section className="checkout-section"><div className="checkout-section-heading"><span>03</span><h2>{paymentText.choosePayment}</h2><small>{paymentText.demoNoCharge}</small></div><div className="payment-method-list">{paymentMethods.map((method) => <label className="payment-method" key={method.id}><input type="radio" name="paymentMethod" value={method.id} checked={paymentMethodId === method.id} onChange={() => setPaymentMethodId(method.id)} /><span className="payment-radio" /><span className="payment-copy"><strong>{method.name}</strong><small>{method.display}</small></span><span className="payment-mark">{method.type === 'test-card' ? paymentText.testPayment : paymentText.otherPayment}</span></label>)}</div></section>
          <button className="button button-dark full-button place-order-button" onClick={() => onPlaceOrder(paymentMethodId)}>{paymentText.placeDemoOrder} · ${total.toFixed(2)} <span>↗</span></button>
          <p className="checkout-disclaimer">{paymentText.disclaimer}</p>
        </div>
        <aside className="order-summary checkout-summary"><p className="eyebrow">{paymentText.summaryEyebrow}</p><h2>{paymentText.summaryTitle}</h2>{items.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · {paymentText.quantity} {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>{paymentText.subtotal}</span><span>${subtotal.toFixed(2)}</span></p><p><span>{paymentText.shipping}</span><span>{shipping ? `$${shipping.toFixed(2)}` : paymentText.complimentary}</span></p><p><span>{paymentText.tax}</span><span>${tax.toFixed(2)}</span></p><div className="summary-total"><strong>{paymentText.total}</strong><strong>${total.toFixed(2)}</strong></div></div></aside>
      </div>
    </section>
  )
}