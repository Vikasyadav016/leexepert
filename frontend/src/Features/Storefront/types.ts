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