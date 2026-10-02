import type { FormEvent } from 'react'
import type { Address, CartQuantities, Product } from '../Storefront/types'
import addressText from '../../TextJson/Checkout/AddressPage.json'
import './Checkout.css'

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
      <p className="eyebrow">{addressText.eyebrow}</p><h1>{addressText.title}</h1>
      <div className="checkout-progress" aria-label={addressText.progressLabel}><span className="complete">01 <b>{addressText.bag}</b></span><i /><span className="current">02 <b>{addressText.delivery}</b></span><i /><span>03 <b>{addressText.payment}</b></span></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitAddress}>
          <section className="checkout-section"><div className="checkout-section-heading"><span>01</span><h2>{addressText.contact}</h2></div><input name="email" type="email" defaultValue={initialDetails.email} required placeholder={addressText.email} autoComplete="email" /></section>
          <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>{addressText.addressSection}</h2></div>
            <div className="form-row"><input name="firstName" defaultValue={initialDetails.address.firstName} required placeholder={addressText.firstName} autoComplete="given-name" /><input name="lastName" defaultValue={initialDetails.address.lastName} required placeholder={addressText.lastName} autoComplete="family-name" /></div>
            <input name="addressLine1" defaultValue={initialDetails.address.addressLine1} required placeholder={addressText.address} autoComplete="address-line1" /><input name="addressLine2" defaultValue={initialDetails.address.addressLine2} placeholder={addressText.addressExtra} autoComplete="address-line2" />
            <div className="form-row"><input name="city" defaultValue={initialDetails.address.city} required placeholder={addressText.city} autoComplete="address-level2" /><input name="region" defaultValue={initialDetails.address.region} required placeholder={addressText.region} autoComplete="address-level1" /></div>
            <div className="form-row"><input name="postalCode" defaultValue={initialDetails.address.postalCode} required placeholder={addressText.postalCode} autoComplete="postal-code" /><input name="country" defaultValue={initialDetails.address.country} required placeholder={addressText.country} autoComplete="country-name" /></div>
          </section>
          <button className="button button-dark full-button place-order-button">{addressText.continue} <span>↗</span></button>
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
    <aside className="order-summary checkout-summary"><p className="eyebrow">{addressText.summaryEyebrow}</p><h2>{addressText.summaryTitle}</h2>{products.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · {addressText.quantity} {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>{addressText.subtotal}</span><span>${subtotal.toFixed(2)}</span></p><p><span>{addressText.shipping}</span><span>{shipping ? `$${shipping.toFixed(2)}` : addressText.complimentary}</span></p><p><span>{addressText.tax}</span><span>${tax.toFixed(2)}</span></p><div className="summary-total"><strong>{addressText.total}</strong><strong>${(subtotal + shipping + tax).toFixed(2)}</strong></div></div></aside>
  )
}