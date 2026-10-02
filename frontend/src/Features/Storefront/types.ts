export type Page =
  | 'Home'
  | 'Shop'
  | 'Collections'
  | 'Product'
  | 'Search'
  | 'Cart'
  | 'Wishlist'
  | 'Checkout'
  | 'Account'
  | 'Orders'
  | 'Returns'
  | 'Track Order'
  | 'About Brand'
  | 'Contact'
  | 'Policies'

export type Product = {
  id: number
  name: string
  category: string
  price: number
  color: string
  image: string
  description: string
}

export type CartQuantities = Record<number, number>

export type Address = {
  id?: string
  label?: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  addressLine1: string
  addressLine2?: string
  city: string
  region?: string
  postalCode: string
  country: string
  countryCode?: string
  isDefault?: boolean
}

export type PaymentMethod = {
  id: string
  name: string
  description: string
  type: string
  display: string
  isDefault: boolean
}

export type OrderLine = {
  productId: number
  name: string
  color: string
  image: string
  unitPrice: number
  quantity: number
}

export type DemoOrder = {
  id: string
  orderNumber: string
  placedAt: string
  status: string
  paymentStatus: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: Pick<PaymentMethod, 'id' | 'name'>
  address: Address
  lines: OrderLine[]
}

export type WishlistItem = {
  productId: number
  savedAt: string
}

export type WishlistEvent = {
  id: string
  productId: number
  action: 'added' | 'removed'
  occurredAt: string
}

export type CheckoutSubmission = {
  email: string
  address: Address
  paymentMethodId: string
}