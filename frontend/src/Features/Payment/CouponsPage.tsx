import { useState } from 'react'
import type { CouponOffer } from '../Storefront/types'
import { coupons as availableCoupons } from '../Storefront/data/coupons'
import './CouponsPage.css'

export function CouponsPage({ onShop }: { onShop: () => void }) {
  const [copiedCode, setCopiedCode] = useState('')

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
    } catch {
      setCopiedCode('')
    }
  }

  return (
    <section className="section-block content-page coupons-page">
      <header className="coupons-heading"><p className="eyebrow">A little something for your wardrobe</p><h1>Good things, made of linen.</h1><p className="page-intro">Pieces to wear on repeat, with a small thank-you from us. Apply an offer during payment.</p></header>
      <div className="coupon-listing">
        {availableCoupons.map((coupon: CouponOffer, index) => <article className={`coupon-listing-card coupon-tone-${index + 1}`} key={coupon.code}>
          <div className="coupon-listing-art" aria-hidden="true"><span>{coupon.badge}</span><i /><i /><i /></div>
          <div className="coupon-listing-copy"><span className="coupon-listing-kicker">LEEX STUDIO · PRIVATE OFFER</span><h2>{coupon.title}</h2><p>{coupon.description}</p><span className="coupon-listing-minimum">Minimum order ${coupon.minimumSubtotal}</span><div className="coupon-listing-code"><strong>{coupon.code}</strong><button type="button" onClick={() => copyCode(coupon.code)}>{copiedCode === coupon.code ? 'Copied' : 'Copy code'}</button></div></div>
        </article>)}
      </div>
      <div className="coupon-footer"><p>Natural fibers. Considered details. Made to live in.</p><button className="button button-dark" onClick={onShop}>Explore the collection <span>↗</span></button></div>
    </section>
  )
}