import type { FormEvent } from 'react'
import type { Address, CartQuantities, CheckoutSubmission, PaymentMethod, Product } from '../Storefront/types'
import { EmptyState } from '../Storefront/components/ProductGrid'

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
      <p className="eyebrow">The last little step</p><h1>Checkout</h1>
      <div className="checkout-progress" aria-label="Checkout progress"><span className="complete">01 <b>Bag</b></span><i /><span className="complete">02 <b>Delivery</b></span><i /><span className="current">03 <b>Payment</b></span></div>
      {!cartProducts.length ? <EmptyState title="Your bag is empty." action="Shop the collection" onClick={onNavigate} /> : (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="checkout-section"><div className="checkout-section-heading"><span>01</span><h2>Contact</h2></div><input name="email" type="email" defaultValue={address.email} required placeholder="Email address" autoComplete="email" /></section>
            <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>Delivery address</h2></div>
              <div className="form-row"><input name="firstName" defaultValue={address.firstName} required placeholder="First name" autoComplete="given-name" /><input name="lastName" defaultValue={address.lastName} required placeholder="Last name" autoComplete="family-name" /></div>
              <input name="addressLine1" defaultValue={address.addressLine1} required placeholder="Address" autoComplete="address-line1" /><input name="addressLine2" defaultValue={address.addressLine2} placeholder="Apartment, suite (optional)" autoComplete="address-line2" />
              <div className="form-row"><input name="city" defaultValue={address.city} required placeholder="City" autoComplete="address-level2" /><input name="region" defaultValue={address.region} required placeholder="State / region" autoComplete="address-level1" /></div>
              <div className="form-row"><input name="postalCode" defaultValue={address.postalCode} required placeholder="Postal code" autoComplete="postal-code" /><input name="country" defaultValue={address.country} required placeholder="Country" autoComplete="country-name" /></div>
            </section>
            <section className="checkout-section"><div className="checkout-section-heading"><span>03</span><h2>Payment</h2><small>Demo only · no charge</small></div>
              <div className="payment-method-list">{paymentMethods.map((method) => <label className="payment-method" key={method.id}><input type="radio" name="paymentMethod" value={method.id} defaultChecked={method.isDefault} /><span className="payment-radio" /><span className="payment-copy"><strong>{method.name}</strong><small>{method.display}</small></span><span className="payment-mark">{method.type === 'test-card' ? 'TEST' : 'PAY'}</span></label>)}</div>
            </section>
            <button className="button button-dark full-button place-order-button">Place demo order · ${total.toFixed(2)} <span>↗</span></button>
            <p className="checkout-disclaimer">This is a local demo. No real payment details are collected or charged.</p>
          </form>
          <aside className="order-summary checkout-summary"><p className="eyebrow">Your selection</p><h2>Order summary</h2>{cartProducts.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · Qty {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p><p><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}</span></p><p><span>Estimated tax</span><span>${tax.toFixed(2)}</span></p><div className="summary-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div></div></aside>
        </div>
      )}
    </section>
  )
}