import type { CheckoutTotals, CouponOffer } from '../types'

export function calculateCheckoutTotals(subtotal: number, coupon?: CouponOffer | null): CheckoutTotals {
  const isEligible = coupon && subtotal >= coupon.minimumSubtotal
  const rawDiscount = isEligible
    ? coupon.kind === 'percent'
      ? subtotal * coupon.amount / 100
      : coupon.amount
    : 0
  const discount = Math.round(Math.min(subtotal, rawDiscount) * 100) / 100
  const taxableSubtotal = subtotal - discount
  const shipping = subtotal >= 150 ? 0 : 8
  const tax = Math.round(taxableSubtotal * 0.08 * 100) / 100

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: Math.round((taxableSubtotal + shipping + tax) * 100) / 100,
  }
}