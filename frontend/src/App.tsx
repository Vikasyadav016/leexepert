import { useEffect, useState, type FormEvent } from 'react'
import { SiteFooter } from './Features/Storefront/components/SiteFooter'
import { SiteHeader } from './Features/Storefront/components/SiteHeader'
import { CartPage } from './Features/Cart/CartPage'
import { OrdersPage } from './Features/Orders/OrdersPage'
import { CheckoutPage } from './Features/Payment/CheckoutPage'
import { WishlistPage } from './Features/Wishlist/WishlistPage'
import { CatalogPage } from './Features/Storefront/pages/CatalogPage'
import { CustomerPages } from './Features/Storefront/pages/CustomerPages'
import { HomePage } from './Features/Storefront/pages/HomePage'
import { ProductPage } from './Features/Storefront/pages/ProductPage'
import { products } from './Features/Storefront/data/products'
import type { Address, CartQuantities, CheckoutSubmission, DemoOrder, Page, Product, WishlistEvent, WishlistItem } from './Features/Storefront/types'
import addressData from './Features/DummyDataTest/addresses.json'
import orderData from './Features/DummyDataTest/orders.json'
import paymentData from './Features/DummyDataTest/payment-methods.json'
import wishlistData from './Features/DummyDataTest/wishlist.json'
import wishlistHistoryData from './Features/DummyDataTest/wishlist-history.json'
import './App.css'

type WishlistState = { items: WishlistItem[]; events: WishlistEvent[] }

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
const demoPaymentMethods = paymentData
const wishlistSeed: WishlistState = {
  items: wishlistData as WishlistItem[],
  events: wishlistHistoryData as WishlistEvent[],
}

function App() {
  const [page, setPage] = useState<Page>('Home')
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [cart, setCart] = useState<CartQuantities>(() => readDemoState('leex-demo-cart', {}))
  const [wishlistState, setWishlistState] = useState<WishlistState>(() => readDemoState('leex-demo-wishlist', wishlistSeed))
  const [orders, setOrders] = useState<DemoOrder[]>(() => readDemoState('leex-demo-orders', demoOrders))
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  const wishlistIds = wishlistState.items.map((item) => item.productId)
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0)
  const visibleProducts = products.filter((product) => `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query.toLowerCase()))
  const wishedProducts = products.filter((product) => wishlistIds.includes(product.id))

  useEffect(() => { window.localStorage.setItem('leex-demo-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { window.localStorage.setItem('leex-demo-wishlist', JSON.stringify(wishlistState)) }, [wishlistState])
  useEffect(() => { window.localStorage.setItem('leex-demo-orders', JSON.stringify(orders)) }, [orders])

  function navigate(nextPage: Page) {
    setPage(nextPage)
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openProduct(product: Product) {
    setSelectedProduct(product)
    navigate('Product')
  }

  function addToCart(product: Product, amount = 1) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + amount }))
    setNotice(`${product.name} added to your bag`)
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
    setWishlistState((current) => {
      const isSaved = current.items.some((item) => item.productId === product.id)
      return {
        items: isSaved
          ? current.items.filter((item) => item.productId !== product.id)
          : [{ productId: product.id, savedAt: occurredAt }, ...current.items],
        events: [{ id: eventId, productId: product.id, action: isSaved ? 'removed' : 'added', occurredAt }, ...current.events],
      }
    })
  }

  function submitForm(event: FormEvent<HTMLFormElement>, message: string) {
    event.preventDefault()
    setNotice(message)
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
    setPage('Orders')
    setNotice(`Order ${orderNumber} placed. This was a simulated payment; no charge was made.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderPage() {
    if (page === 'Home') return <HomePage products={products} wishlist={wishlistIds} onNavigate={navigate} onOpen={openProduct} onWish={toggleWishlist} onAdd={addToCart} />
    if (page === 'Shop' || page === 'Collections' || page === 'Search') {
      return <CatalogPage page={page} query={query} products={visibleProducts} wishlist={wishlistIds} onQueryChange={setQuery} onNavigate={navigate} onOpen={openProduct} onWish={toggleWishlist} onAdd={addToCart} />
    }
    if (page === 'Product') return <ProductPage product={selectedProduct} isWishlisted={wishlistIds.includes(selectedProduct.id)} onAdd={addToCart} onToggleWishlist={toggleWishlist} />
    if (page === 'Cart') return <CartPage products={products} quantities={cart} total={cartTotal} onNavigate={navigate} onSetQuantity={setQuantity} />
    if (page === 'Wishlist') return <WishlistPage products={wishedProducts} wishlist={wishlistIds} events={wishlistState.events} productCatalog={products} onNavigate={() => navigate('Shop')} onOpen={openProduct} onWish={toggleWishlist} onAdd={addToCart} />
    if (page === 'Checkout') return <CheckoutPage products={products} quantities={cart} subtotal={cartTotal} address={demoAddresses[0]} paymentMethods={demoPaymentMethods} onNavigate={() => navigate('Shop')} onPlaceOrder={placeOrder} />
    if (page === 'Orders') return <OrdersPage orders={orders} onNavigate={navigate} />
    return <CustomerPages page={page} onNotice={setNotice} onSubmit={submitForm} onShop={() => navigate('Shop')} />
  }

  return (
    <div className="storefront">
      <SiteHeader page={page} cartCount={cartCount} wishlistCount={wishlistIds.length} onNavigate={navigate} />
      <main>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}
        {renderPage()}
      </main>
      <SiteFooter onNavigate={navigate} onSubmit={submitForm} />
    </div>
  )
}

export default App