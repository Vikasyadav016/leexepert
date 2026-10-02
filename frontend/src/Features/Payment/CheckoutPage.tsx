import type { FormEvent } from 'react'
import type { Address, CartQuantities, CheckoutSubmission, PaymentMethod, Product } from '../Storefront/types'
import { EmptyState } from '../Storefront/components/ProductGrid'
import checkoutText from '../../TextJson/Checkout/CheckoutPage.json'

type CheckoutPageProps = {
  products: Product[]
  quantities: CartQuantities
  subtotal: number
  address: Address
  paymentMethods: PaymentMethod[]
  onNavigate: () => void
  onPlaceOrder: (submission: CheckoutSubmission) => void
}

export function CheckoutPage({ products, quantities, subtotal, address, paymentMethods, onNavigate, onPlaceOrder }: CheckoutPageProps) {
  const cartProducts = products.filter((product) => quantities[product.id] > 0)
  const shipping = subtotal >= 150 ? 0 : 8
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onPlaceOrder({
      email: String(formData.get('email')),
      address: {
        firstName: String(formData.get('firstName')),
        lastName: String(formData.get('lastName')),
        addressLine1: String(formData.get('addressLine1')),
        addressLine2: String(formData.get('addressLine2')),
        city: String(formData.get('city')),
        region: String(formData.get('region')),
        postalCode: String(formData.get('postalCode')),
        country: String(formData.get('country')),
      },
      paymentMethodId: String(formData.get('paymentMethod')),
    })
  }

  return (
    <section className="section-block content-page checkout-page">
      <p className="eyebrow">{checkoutText.eyebrow}</p><h1>{checkoutText.title}</h1>
      <div className="checkout-progress" aria-label={checkoutText.progressLabel}><span className="complete">01 <b>{checkoutText.bag}</b></span><i /><span className="complete">02 <b>{checkoutText.delivery}</b></span><i /><span className="current">03 <b>{checkoutText.payment}</b></span></div>
      {!cartProducts.length ? <EmptyState title={checkoutText.emptyTitle} action={checkoutText.shop} onClick={onNavigate} /> : (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="checkout-section"><div className="checkout-section-heading"><span>01</span><h2>{checkoutText.contact}</h2></div><input name="email" type="email" defaultValue={address.email} required placeholder={checkoutText.email} autoComplete="email" /></section>
            <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>{checkoutText.deliveryAddress}</h2></div>
              <div className="form-row"><input name="firstName" defaultValue={address.firstName} required placeholder={checkoutText.firstName} autoComplete="given-name" /><input name="lastName" defaultValue={address.lastName} required placeholder={checkoutText.lastName} autoComplete="family-name" /></div>
              <input name="addressLine1" defaultValue={address.addressLine1} required placeholder={checkoutText.address} autoComplete="address-line1" /><input name="addressLine2" defaultValue={address.addressLine2} placeholder={checkoutText.addressExtra} autoComplete="address-line2" />
              <div className="form-row"><input name="city" defaultValue={address.city} required placeholder={checkoutText.city} autoComplete="address-level2" /><input name="region" defaultValue={address.region} required placeholder={checkoutText.region} autoComplete="address-level1" /></div>
              <div className="form-row"><input name="postalCode" defaultValue={address.postalCode} required placeholder={checkoutText.postalCode} autoComplete="postal-code" /><input name="country" defaultValue={address.country} required placeholder={checkoutText.country} autoComplete="country-name" /></div>
            </section>
            <section className="checkout-section"><div className="checkout-section-heading"><span>03</span><h2>{checkoutText.payment}</h2><small>{checkoutText.demoNoCharge}</small></div>
              <div className="payment-method-list">{paymentMethods.map((method) => <label className="payment-method" key={method.id}><input type="radio" name="paymentMethod" value={method.id} defaultChecked={method.isDefault} /><span className="payment-radio" /><span className="payment-copy"><strong>{method.name}</strong><small>{method.display}</small></span><span className="payment-mark">{method.type === 'test-card' ? checkoutText.testPayment : checkoutText.otherPayment}</span></label>)}</div>
            </section>
            <button className="button button-dark full-button place-order-button">{checkoutText.placeDemoOrder} · ${total.toFixed(2)} <span>↗</span></button>
            <p className="checkout-disclaimer">{checkoutText.disclaimer}</p>
          </form>
          <aside className="order-summary checkout-summary"><p className="eyebrow">{checkoutText.summaryEyebrow}</p><h2>{checkoutText.summaryTitle}</h2>{cartProducts.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · {checkoutText.quantity} {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>{checkoutText.subtotal}</span><span>${subtotal.toFixed(2)}</span></p><p><span>{checkoutText.shipping}</span><span>{shipping ? `$${shipping.toFixed(2)}` : checkoutText.complimentary}</span></p><p><span>{checkoutText.tax}</span><span>${tax.toFixed(2)}</span></p><div className="summary-total"><strong>{checkoutText.total}</strong><strong>${total.toFixed(2)}</strong></div></div></aside>
        </div>
      )}
    </section>
  )
}