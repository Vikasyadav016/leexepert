import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import addressData from '../../DummyDataTest/addresses.json'
import orderData from '../../DummyDataTest/orders.json'
import paymentData from '../../DummyDataTest/payment-methods.json'
import wishlistData from '../../DummyDataTest/wishlist.json'
import wishlistHistoryData from '../../DummyDataTest/wishlist-history.json'
import { getPersistedUserId, saveAccountStoreData, type AuthStoreData } from '../../../Services/AuthServices/AuthContext'
import type { ToastNotice, ToastPlacement } from '../components/PremiumToast'
import { products } from '../data/products'
import storeText from '../../../TextJson/Storefront/StorefrontContext.json'
import type { Address, CartQuantities, CheckoutSubmission, DemoOrder, PaymentMethod, Product, WishlistEvent, WishlistItem } from '../types'

export type WishlistState = { items: WishlistItem[]; events: WishlistEvent[] }
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
  notice: ToastNotice | null
  clearNotice: () => void
  notify: (message: string, options?: { placement?: ToastPlacement; duration?: number }) => void
  addToCart: (product: Product, amount?: number) => void
  buyNow: (product: Product) => void
  setQuantity: (productId: number, quantity: number) => void
  toggleWishlist: (product: Product) => void
  restoreAccountData: (data: AuthStoreData) => void
  checkoutDetails: CheckoutDetails
  updateCheckoutDetails: (details: CheckoutDetails) => void
  paymentMethods: PaymentMethod[]
  placeOrder: (submission: CheckoutSubmission) => DemoOrder | null
  rateOrderItem: (orderId: string, productId: number, rating: number) => void
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
  const [notice, setNotice] = useState<ToastNotice | null>(null)

  const wishlistIds = wishlist.items.map((item) => item.productId)
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0)
  const wishedProducts = products.filter((product) => wishlistIds.includes(product.id))

  useEffect(() => { window.localStorage.setItem('leex-demo-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { window.localStorage.setItem('leex-demo-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => {
    const userId = getPersistedUserId()
    if (userId) saveAccountStoreData(userId, { cart, wishlist })
  }, [cart, wishlist])
  useEffect(() => { window.localStorage.setItem('leex-demo-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { window.localStorage.setItem('leex-demo-checkout', JSON.stringify(checkoutDetails)) }, [checkoutDetails])

  function addToCart(product: Product, amount = 1) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + amount }))
    notify(storeText.productAdded.replace('{name}', product.name))
  }

  function buyNow(product: Product) {
    setCart((current) => ({ ...current, [product.id]: Math.max(current[product.id] ?? 0, 1) }))
    setNotice(null)
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

  function restoreAccountData(data: AuthStoreData) {
    setCart(data.cart)
    setWishlist(data.wishlist)
  }

  function placeOrder(submission: CheckoutSubmission): DemoOrder | null {
    const lines = products.filter((product) => cart[product.id] > 0).map((product) => ({
      productId: product.id,
      name: product.name,
      color: product.color,
      image: product.image,
      unitPrice: product.price,
      quantity: cart[product.id],
    }))
    if (!lines.length) return null

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
    return order
  }

  function rateOrderItem(orderId: string, productId: number, rating: number) {
    const safeRating = Math.min(5, Math.max(1, Math.round(rating)))
    setOrders((current) => current.map((order) => order.id !== orderId ? order : {
      ...order,
      lines: order.lines.map((line) => line.productId === productId ? { ...line, rating: safeRating } : line),
    }))
  }

  function notify(message: string, options: { placement?: ToastPlacement; duration?: number } = {}) {
    setNotice({
      id: Date.now(),
      message,
      placement: options.placement ?? 'top-right',
      duration: options.duration ?? 4200,
    })
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
    clearNotice: () => setNotice(null),
    notify,
    addToCart,
    buyNow,
    setQuantity,
    toggleWishlist,
    restoreAccountData,
    checkoutDetails,
    updateCheckoutDetails: setCheckoutDetails,
    paymentMethods: demoPaymentMethods,
    placeOrder,
    rateOrderItem,
  }

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
}

export function useStorefront(): StorefrontContextValue {
  const context = useContext(StorefrontContext)
  if (!context) throw new Error('useStorefront must be used within StorefrontProvider.')
  return context
}