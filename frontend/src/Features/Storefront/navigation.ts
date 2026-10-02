import type { Page } from './types'

export const pagePaths: Record<Page, string> = {
  Home: '/',
  Shop: '/shop',
  Collections: '/collections',
  Product: '/shop',
  Search: '/search',
  Cart: '/cart',
  Wishlist: '/wishlist',
  Checkout: '/checkout/address',
  Account: '/account',
  Profile: '/profile',
  Orders: '/orders',
  Returns: '/returns',
  'Track Order': '/track-order',
  'About Brand': '/about',
  Contact: '/contact',
  Policies: '/policies',
}

export function pageForPath(pathname: string): Page {
  if (pathname.startsWith('/products/')) return 'Product'
  if (pathname.startsWith('/checkout/')) return 'Checkout'
  if (pathname === '/shop') return 'Shop'
  if (pathname === '/collections') return 'Collections'
  if (pathname === '/search') return 'Search'
  if (pathname === '/cart') return 'Cart'
  if (pathname.startsWith('/wishlist')) return 'Wishlist'
  if (pathname === '/account') return 'Account'
  if (pathname === '/profile') return 'Profile'
  if (pathname === '/orders') return 'Orders'
  if (pathname === '/returns') return 'Returns'
  if (pathname === '/track-order') return 'Track Order'
  if (pathname === '/about') return 'About Brand'
  if (pathname === '/contact') return 'Contact'
  if (pathname === '/policies') return 'Policies'
  return 'Home'
}