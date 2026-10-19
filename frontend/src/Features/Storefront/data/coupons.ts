import type { CouponOffer } from '../types'

export const coupons: CouponOffer[] = [
  {
    code: 'LINEN10',
    title: 'A little linen love',
    description: 'Take 10% off your order of $100 or more.',
    badge: '10% OFF',
    kind: 'percent',
    amount: 10,
    minimumSubtotal: 100,
  },
  {
    code: 'WELCOME15',
    title: 'A warm welcome',
    description: 'Enjoy $15 off orders of $150 or more.',
    badge: '$15 OFF',
    kind: 'fixed',
    amount: 15,
    minimumSubtotal: 150,
  },
]