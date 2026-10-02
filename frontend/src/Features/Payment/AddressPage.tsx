import type { FormEvent } from 'react'
import type { Address, CartQuantities, Product } from '../Storefront/types'

type CheckoutDetails = { email: string; address: Address }

type AddressPageProps = {
  initialDetails: CheckoutDetails
  products: Product[]
  quantities: CartQuantities
  subtotal: number
  onContinue: (details: CheckoutDetails) => void
}

export function AddressPage({ initialDetails, products, quantities, subtotal, onContinue }: AddressPageProps) {
  const items = products.filter((product) => quantities[product.id] > 0)

  function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    onContinue({
      email: String(values.get('email')),
      address: {
        firstName: String(values.get('firstName')),
        lastName: String(values.get('lastName')),
        addressLine1: String(values.get('addressLine1')),
        addressLine2: String(values.get('addressLine2')),
        city: String(values.get('city')),
        region: String(values.get('region')),
        postalCode: String(values.get('postalCode')),
        country: String(values.get('country')),
      },
    })
  }

  return (
    <section className="section-block content-page checkout-page">
      <p className="eyebrow">The last little steps</p><h1>Delivery address</h1>
      <div className="checkout-progress" aria-label="Checkout progress"><span className="complete">01 <b>Bag</b></span><i /><span className="current">02 <b>Delivery</b></span><i /><span>03 <b>Payment</b></span></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitAddress}>
          <section className="checkout-section"><div className="checkout-section-heading"><span>01</span><h2>Contact</h2></div><input name="email" type="email" defaultValue={initialDetails.email} required placeholder="Email address" autoComplete="email" /></section>
          <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>Where to send it</h2></div>
            <div className="form-row"><input name="firstName" defaultValue={initialDetails.address.firstName} required placeholder="First name" autoComplete="given-name" /><input name="lastName" defaultValue={initialDetails.address.lastName} required placeholder="Last name" autoComplete="family-name" /></div>
            <input name="addressLine1" defaultValue={initialDetails.address.addressLine1} required placeholder="Address" autoComplete="address-line1" /><input name="addressLine2" defaultValue={initialDetails.address.addressLine2} placeholder="Apartment, suite (optional)" autoComplete="address-line2" />
            <div className="form-row"><input name="city" defaultValue={initialDetails.address.city} required placeholder="City" autoComplete="address-level2" /><input name="region" defaultValue={initialDetails.address.region} required placeholder="State / region" autoComplete="address-level1" /></div>
            <div className="form-row"><input name="postalCode" defaultValue={initialDetails.address.postalCode} required placeholder="Postal code" autoComplete="postal-code" /><input name="country" defaultValue={initialDetails.address.country} required placeholder="Country" autoComplete="country-name" /></div>
          </section>
          <button className="button button-dark full-button place-order-button">Continue to payment <span>↗</span></button>
        </form>
        <CheckoutSummary products={items} quantities={quantities} subtotal={subtotal} />
      </div>
    </section>
  )
}

function CheckoutSummary({ products, quantities, subtotal }: { products: Product[]; quantities: CartQuantities; subtotal: number }) {
  const shipping = subtotal >= 150 ? 0 : 8
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  return (
    <aside className="order-summary checkout-summary"><p className="eyebrow">Your selection</p><h2>Order summary</h2>{products.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · Qty {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p><p><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}</span></p><p><span>Estimated tax</span><span>${tax.toFixed(2)}</span></p><div className="summary-total"><strong>Estimated total</strong><strong>${(subtotal + shipping + tax).toFixed(2)}</strong></div></div></aside>
  )
}