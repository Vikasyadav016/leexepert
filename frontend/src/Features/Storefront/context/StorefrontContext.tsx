import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import addressData from '../../DummyDataTest/addresses.json'
import orderData from '../../DummyDataTest/orders.json'
import paymentData from '../../DummyDataTest/payment-methods.json'
import wishlistData from '../../DummyDataTest/wishlist.json'
import wishlistHistoryData from '../../DummyDataTest/wishlist-history.json'
import { products } from '../data/products'
import type { Address, CartQuantities, CheckoutSubmission, DemoOrder, PaymentMethod, Product, WishlistEvent, WishlistItem } from '../types'

type WishlistState = { items: WishlistItem[]; events: WishlistEvent[] }
type CheckoutDetails = { email: string; address: Address }

type StorefrontContextValue = {
  products: Product[]
  cart: CartQuantities
  cartCount: number
  cartTotal: number
  wishlist: WishlistState
  wishlistIds: number[]
  wishedProducts: Product[]
  orders: DemoOrder[]
  query: string
  setQuery: (query: string) => void
  notice: string
  clearNotice: () => void
  notify: (message: string) => void
  addToCart: (product: Product, amount?: number) => void
  buyNow: (product: Product) => void
  setQuantity: (productId: number, quantity: number) => void
  toggleWishlist: (product: Product) => void
  checkoutDetails: CheckoutDetails
  updateCheckoutDetails: (details: CheckoutDetails) => void
  paymentMethods: PaymentMethod[]
  placeOrder: (submission: CheckoutSubmission) => void
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null)

function readDemoState<T>(key: string, fallback: T): T {
  try {
    const saved = window.localStorage.getItem(key)
    return saved ? JSON.parse(saved) as T : fallback
  } catch {
    return fallback
  }
}

const demoAddresses = addressData as Address[]
const demoOrders = orderData as DemoOrder[]
const demoPaymentMethods = paymentData as PaymentMethod[]
const wishlistSeed: WishlistState = {
  items: wishlistData as WishlistItem[],
  events: wishlistHistoryData as WishlistEvent[],
}
const initialCheckoutDetails: CheckoutDetails = {
  email: demoAddresses[0].email ?? '',
  address: demoAddresses[0],
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartQuantities>(() => readDemoState('leex-demo-cart', {}))
  const [wishlist, setWishlist] = useState<WishlistState>(() => readDemoState('leex-demo-wishlist', wishlistSeed))
  const [orders, setOrders] = useState<DemoOrder[]>(() => readDemoState('leex-demo-orders', demoOrders))
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>(() => readDemoState('leex-demo-checkout', initialCheckoutDetails))
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  const wishlistIds = wishlist.items.map((item) => item.productId)
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0)
  const wishedProducts = products.filter((product) => wishlistIds.includes(product.id))

  useEffect(() => { window.localStorage.setItem('leex-demo-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { window.localStorage.setItem('leex-demo-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => { window.localStorage.setItem('leex-demo-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { window.localStorage.setItem('leex-demo-checkout', JSON.stringify(checkoutDetails)) }, [checkoutDetails])

  function addToCart(product: Product, amount = 1) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + amount }))
    setNotice(`${product.name} added to your bag`)
  }

  function buyNow(product: Product) {
    setCart((current) => ({ ...current, [product.id]: Math.max(current[product.id] ?? 0, 1) }))
    setNotice('')
  }

  function setQuantity(productId: number, quantity: number) {
    setCart((current) => {
      const next = { ...current }
      if (quantity <= 0) delete next[productId]
      else next[productId] = quantity
      return next
    })
  }

  function toggleWishlist(product: Product) {
    const occurredAt = new Date().toISOString()
    const eventId = `wish-${Date.now()}-${product.id}`
    setWishlist((current) => {
      const isSaved = current.items.some((item) => item.productId === product.id)
      return {
        items: isSaved
          ? current.items.filter((item) => item.productId !== product.id)
          : [{ productId: product.id, savedAt: occurredAt }, ...current.items],
        events: [{ id: eventId, productId: product.id, action: isSaved ? 'removed' : 'added', occurredAt }, ...current.events],
      }
    })
  }

  function placeOrder(submission: CheckoutSubmission) {
    const lines = products.filter((product) => cart[product.id] > 0).map((product) => ({
      productId: product.id,
      name: product.name,
      color: product.color,
      image: product.image,
      unitPrice: product.price,
      quantity: cart[product.id],
    }))
    if (!lines.length) return

    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
    const shipping = subtotal >= 150 ? 0 : 8
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const paymentMethod = demoPaymentMethods.find((method) => method.id === submission.paymentMethodId) ?? demoPaymentMethods[0]
    const placedAt = new Date().toISOString()
    const orderNumber = `LE-${placedAt.slice(2, 10).replaceAll('-', '')}-${Date.now().toString().slice(-4)}`
    const order: DemoOrder = {
      id: orderNumber,
      orderNumber,
      placedAt,
      status: 'Confirmed',
      paymentStatus: 'Paid · simulated',
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      paymentMethod: { id: paymentMethod.id, name: paymentMethod.name },
      address: { ...submission.address, email: submission.email },
      lines,
    }

    setOrders((current) => [order, ...current])
    setCart({})
    setNotice(`Order ${orderNumber} placed. This was a simulated payment; no charge was made.`)
  }

  const value: StorefrontContextValue = {
    products,
    cart,
    cartCount,
    cartTotal,
    wishlist,
    wishlistIds,
    wishedProducts,
    orders,
    query,
    setQuery,
    notice,
    clearNotice: () => setNotice(''),
    notify: setNotice,
    addToCart,
    buyNow,
    setQuantity,
    toggleWishlist,
    checkoutDetails,
    updateCheckoutDetails: setCheckoutDetails,
    paymentMethods: demoPaymentMethods,
    placeOrder,
  }

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
}

export function useStorefront(): StorefrontContextValue {
  const context = useContext(StorefrontContext)
  if (!context) throw new Error('useStorefront must be used within StorefrontProvider.')
  return context
}