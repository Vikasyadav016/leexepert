import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Address, CartQuantities, CheckoutTotals, CouponOffer, PaymentMethod, Product } from '../Storefront/types'
import paymentText from '../../TextJson/Checkout/PaymentPage.json'
import './Checkout.css'

type PaymentPageProps = {
  products: Product[]
  quantities: CartQuantities
  subtotal: number
  totals: CheckoutTotals
  address: Address
  paymentMethods: PaymentMethod[]
  coupons: CouponOffer[]
  selectedCoupon: CouponOffer | null
  onApplyCoupon: (code: string) => boolean
  onClearCoupon: () => void
  onPlaceOrder: (paymentMethodId: string) => void
}

export function PaymentPage({ products, quantities, subtotal, totals, address, paymentMethods, coupons, selectedCoupon, onApplyCoupon, onClearCoupon, onPlaceOrder }: PaymentPageProps) {
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods.find((method) => method.isDefault)?.id ?? paymentMethods[0].id)
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const items = products.filter((product) => quantities[product.id] > 0)

  function applyCoupon(code: string) {
    const valid = onApplyCoupon(code.trim().toUpperCase())
    setCouponMessage(valid ? `${code.trim().toUpperCase()} applied to your order.` : 'This offer is not available for your current subtotal.')
    if (valid) setCouponCode(code.trim().toUpperCase())
  }

  function submitCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    applyCoupon(couponCode)
  }

  return (
    <section className="section-block content-page checkout-page">
      <p className="eyebrow">{paymentText.eyebrow}</p><h1>{paymentText.title}</h1>
      <div className="checkout-progress" aria-label={paymentText.progressLabel}><span className="complete">01 <b>{paymentText.bag}</b></span><i /><span className="complete">02 <b>{paymentText.delivery}</b></span><i /><span className="current">03 <b>{paymentText.payment}</b></span></div>
      <div className="checkout-layout">
        <div className="checkout-form">
          <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>{paymentText.deliveryAddress}</h2><Link className="text-link" to="/checkout/address">{paymentText.edit}</Link></div><address className="delivery-address">{address.firstName} {address.lastName}<br />{address.addressLine1}{address.addressLine2 && <><br />{address.addressLine2}</>}<br />{address.city}, {address.region} {address.postalCode}<br />{address.country}</address></section>
          <section className="checkout-section"><div className="checkout-section-heading"><span>03</span><h2>{paymentText.choosePayment}</h2><small>{paymentText.demoNoCharge}</small></div><div className="payment-method-list">{paymentMethods.map((method) => <label className="payment-method" key={method.id}><input type="radio" name="paymentMethod" value={method.id} checked={paymentMethodId === method.id} onChange={() => setPaymentMethodId(method.id)} /><span className="payment-radio" /><span className="payment-copy"><strong>{method.name}</strong><small>{method.display}</small></span><span className="payment-mark">{method.type === 'test-card' ? paymentText.testPayment : paymentText.otherPayment}</span></label>)}</div></section>
          <section className="coupon-section checkout-section" aria-labelledby="checkout-coupons-title">
            <div className="checkout-section-heading"><span>04</span><h2 id="checkout-coupons-title">A little something extra</h2></div>
            <p className="coupon-intro">Pure linen, thoughtfully made. Choose an offer for your first or next favorite.</p>
            <div className="coupon-grid">
              {coupons.map((coupon) => {
                const applied = selectedCoupon?.code === coupon.code
                const eligible = subtotal >= coupon.minimumSubtotal
                return <article className={`coupon-card${applied ? ' is-applied' : ''}`} key={coupon.code}>
                  <div className="coupon-card-top"><strong>{coupon.badge}</strong><span>{applied ? 'Applied' : 'LEEX offer'}</span></div>
                  <h3>{coupon.title}</h3><p>{coupon.description}</p><small>Code <b>{coupon.code}</b> · Min. order ${coupon.minimumSubtotal}</small>
                  <button className="coupon-apply" type="button" disabled={!eligible && !applied} onClick={() => applied ? (onClearCoupon(), setCouponMessage('Offer removed from your order.')) : applyCoupon(coupon.code)}>{applied ? 'Remove offer' : eligible ? 'Apply offer' : `Add $${(coupon.minimumSubtotal - subtotal).toFixed(2)} to qualify`}</button>
                </article>
              })}
            </div>
            <form className="coupon-code-form" onSubmit={submitCoupon}>
              <label htmlFor="coupon-code">Have a code?</label>
              <div><input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" /><button type="submit" className="button button-outline">Apply</button></div>
              <p role="status" aria-live="polite">{couponMessage || (selectedCoupon ? `${selectedCoupon.code} is selected.` : '')}</p>
            </form>
          </section>
          <button className="button button-dark full-button place-order-button" onClick={() => onPlaceOrder(paymentMethodId)}>{paymentText.placeDemoOrder} · ${totals.total.toFixed(2)} <span>↗</span></button>
          <p className="checkout-disclaimer">{paymentText.disclaimer}</p>
        </div>
        <aside className="order-summary checkout-summary"><p className="eyebrow">{paymentText.summaryEyebrow}</p><h2>{paymentText.summaryTitle}</h2>{items.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · {paymentText.quantity} {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>{paymentText.subtotal}</span><span>${totals.subtotal.toFixed(2)}</span></p>{selectedCoupon && <p className="coupon-summary-code"><span>{selectedCoupon.code}</span><span>{totals.discount ? `−$${totals.discount.toFixed(2)}` : `Add $${Math.max(0, selectedCoupon.minimumSubtotal - subtotal).toFixed(2)} to apply`}</span></p>}<p><span>{paymentText.shipping}</span><span>{totals.shipping ? `$${totals.shipping.toFixed(2)}` : paymentText.complimentary}</span></p><p><span>{paymentText.tax}</span><span>${totals.tax.toFixed(2)}</span></p><div className="summary-total"><strong>{paymentText.total}</strong><strong>${totals.total.toFixed(2)}</strong></div></div></aside>
      </div>
    </section>
  )
}