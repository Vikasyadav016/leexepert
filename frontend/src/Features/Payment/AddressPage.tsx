import { useState, type FormEvent } from 'react'
import type { Address, CartQuantities, CheckoutTotals, Product } from '../Storefront/types'
import addressText from '../../TextJson/Checkout/AddressPage.json'
import './Checkout.css'

type CheckoutDetails = { email: string; address: Address }

type AddressPageProps = {
  initialDetails: CheckoutDetails
  products: Product[]
  quantities: CartQuantities
  totals: CheckoutTotals
  onContinue: (details: CheckoutDetails) => void
}

export function AddressPage({ initialDetails, products, quantities, totals, onContinue }: AddressPageProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const items = products.filter((product) => quantities[product.id] > 0)

  function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const requiredFields = ['email', 'firstName', 'lastName', 'addressLine1', 'city', 'region', 'postalCode', 'country']
    const nextErrors: Record<string, string> = {}
    for (const field of requiredFields) {
      if (!String(values.get(field) ?? '').trim()) nextErrors[field] = 'This field is required.'
    }
    const email = String(values.get('email') ?? '').trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    onContinue({
      email,
      address: {
        firstName: String(values.get('firstName') ?? '').trim(),
        lastName: String(values.get('lastName') ?? '').trim(),
        addressLine1: String(values.get('addressLine1') ?? '').trim(),
        addressLine2: String(values.get('addressLine2') ?? '').trim(),
        city: String(values.get('city') ?? '').trim(),
        region: String(values.get('region') ?? '').trim(),
        postalCode: String(values.get('postalCode') ?? '').trim(),
        country: String(values.get('country') ?? '').trim(),
      },
    })
  }

  return (
    <section className="section-block content-page checkout-page">
      <p className="eyebrow">{addressText.eyebrow}</p><h1>{addressText.title}</h1>
      <div className="checkout-progress" aria-label={addressText.progressLabel}><span className="complete">01 <b>{addressText.bag}</b></span><i /><span className="current">02 <b>{addressText.delivery}</b></span><i /><span>03 <b>{addressText.payment}</b></span></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitAddress} noValidate>
          <section className="checkout-section"><div className="checkout-section-heading"><span>01</span><h2>{addressText.contact}</h2></div><label className="checkout-field"><span>{addressText.email} <b>*</b></span><input name="email" type="email" defaultValue={initialDetails.email} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} />{errors.email && <small id="error-email" className="field-error">{errors.email}</small>}</label></section>
          <section className="checkout-section"><div className="checkout-section-heading"><span>02</span><h2>{addressText.addressSection}</h2></div>
            <div className="form-row"><AddressField name="firstName" label={addressText.firstName} value={initialDetails.address.firstName} autoComplete="given-name" error={errors.firstName} /><AddressField name="lastName" label={addressText.lastName} value={initialDetails.address.lastName} autoComplete="family-name" error={errors.lastName} /></div>
            <AddressField name="addressLine1" label={addressText.address} value={initialDetails.address.addressLine1} autoComplete="address-line1" error={errors.addressLine1} />
            <AddressField name="addressLine2" label={addressText.addressExtra} value={initialDetails.address.addressLine2} autoComplete="address-line2" required={false} />
            <div className="form-row"><AddressField name="city" label={addressText.city} value={initialDetails.address.city} autoComplete="address-level2" error={errors.city} /><AddressField name="region" label={addressText.region} value={initialDetails.address.region} autoComplete="address-level1" error={errors.region} /></div>
            <div className="form-row"><AddressField name="postalCode" label={addressText.postalCode} value={initialDetails.address.postalCode} autoComplete="postal-code" error={errors.postalCode} /><AddressField name="country" label={addressText.country} value={initialDetails.address.country} autoComplete="country-name" error={errors.country} /></div>
          </section>
          <button className="button button-dark full-button place-order-button">{addressText.continue} <span>↗</span></button>
        </form>
        <CheckoutSummary products={items} quantities={quantities} totals={totals} />
      </div>
    </section>
  )
}

function AddressField({ name, label, value, autoComplete, error, required = true }: { name: string; label: string; value?: string; autoComplete: string; error?: string; required?: boolean }) {
  const errorId = `error-${name}`
  return <label className="checkout-field"><span>{label}{required && <> <b>*</b></>}</span><input name={name} defaultValue={value} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />{error && <small id={errorId} className="field-error">{error}</small>}</label>
}

function CheckoutSummary({ products, quantities, totals }: { products: Product[]; quantities: CartQuantities; totals: CheckoutTotals }) {
  return (
    <aside className="order-summary checkout-summary"><p className="eyebrow">{addressText.summaryEyebrow}</p><h2>{addressText.summaryTitle}</h2>{products.map((product) => <div className="checkout-product" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.color} · {addressText.quantity} {quantities[product.id]}</small></div><span>${(product.price * quantities[product.id]).toFixed(2)}</span></div>)}<div className="checkout-totals"><p><span>{addressText.subtotal}</span><span>${totals.subtotal.toFixed(2)}</span></p>{totals.discount > 0 && <p className="checkout-discount"><span>Coupon savings</span><span>−${totals.discount.toFixed(2)}</span></p>}<p><span>{addressText.shipping}</span><span>{totals.shipping ? `$${totals.shipping.toFixed(2)}` : addressText.complimentary}</span></p><p><span>{addressText.tax}</span><span>${totals.tax.toFixed(2)}</span></p><div className="summary-total"><strong>{addressText.total}</strong><strong>${totals.total.toFixed(2)}</strong></div></div></aside>
  )
}