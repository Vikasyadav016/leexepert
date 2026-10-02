import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CartPage } from '../../Cart/CartPage'
import { OrdersPage } from '../../Orders/OrdersPage'
import { AddressPage } from '../../Payment/AddressPage'
import { PaymentPage } from '../../Payment/PaymentPage'
import { WishlistHistoryPage } from '../../Wishlist/WishlistPage'
import { WishlistPage } from '../../Wishlist/WishlistPage'
import { CatalogPage } from './CatalogPage'
import { CustomerPages } from './CustomerPages'
import { HomePage } from './HomePage'
import { ProductPage } from './ProductPage'
import { products } from '../data/products'
import { pagePaths } from '../navigation'
import { useStorefront } from '../context/StorefrontContext'
import type { Page, Product } from '../types'

type CatalogPageName = Extract<Page, 'Shop' | 'Collections' | 'Search'>
type CustomerPageName = Extract<Page, 'Account' | 'Returns' | 'Track Order' | 'About Brand' | 'Contact' | 'Policies'>

export function HomeRoute() {
  const store = useStorefront()
  const navigate = useNavigate()
  return <HomePage products={products} wishlist={store.wishlistIds} onNavigate={(page) => navigate(pagePaths[page])} onOpen={(product) => navigate(`/products/${product.id}`)} onWish={store.toggleWishlist} onAdd={store.addToCart} />
}

export function CatalogRoute({ page }: { page: CatalogPageName }) {
  const store = useStorefront()
  const navigate = useNavigate()
  const visibleProducts = products.filter((product) => `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(store.query.toLowerCase()))
  return <CatalogPage page={page} query={store.query} products={visibleProducts} wishlist={store.wishlistIds} onQueryChange={store.setQuery} onNavigate={(nextPage) => navigate(pagePaths[nextPage])} onOpen={(product) => navigate(`/products/${product.id}`)} onWish={store.toggleWishlist} onAdd={store.addToCart} />
}

export function ProductRoute() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const store = useStorefront()
  const product = products.find((item) => item.id === Number(productId))
  if (!product) return <Navigate to="/shop" replace />

  function addAndOpenCart(item: Product) {
    store.addToCart(item)
    navigate('/cart')
  }

  function buyNow(item: Product) {
    store.buyNow(item)
    navigate('/checkout/address')
  }

  return <ProductPage product={product} isWishlisted={store.wishlistIds.includes(product.id)} onAdd={addAndOpenCart} onBuyNow={buyNow} onToggleWishlist={store.toggleWishlist} />
}

export function CartRoute() {
  const store = useStorefront()
  const navigate = useNavigate()
  return <CartPage products={products} quantities={store.cart} total={store.cartTotal} onNavigate={(page) => navigate(pagePaths[page])} onSetQuantity={store.setQuantity} />
}

export function WishlistRoute() {
  const store = useStorefront()
  const navigate = useNavigate()
  return <WishlistPage products={store.wishedProducts} wishlist={store.wishlistIds} onNavigate={() => navigate('/shop')} onHistory={() => navigate('/wishlist/history')} onOpen={(product) => navigate(`/products/${product.id}`)} onWish={store.toggleWishlist} onAdd={store.addToCart} />
}

export function WishlistHistoryRoute() {
  const store = useStorefront()
  return <WishlistHistoryPage events={store.wishlist.events} productCatalog={products} />
}

export function CheckoutAddressRoute() {
  const store = useStorefront()
  const navigate = useNavigate()
  if (store.cartCount === 0) return <Navigate to="/cart" replace />
  return <AddressPage initialDetails={store.checkoutDetails} onContinue={(details) => { store.updateCheckoutDetails(details); navigate('/checkout/payment') }} products={products} quantities={store.cart} subtotal={store.cartTotal} />
}

export function CheckoutPaymentRoute() {
  const store = useStorefront()
  if (store.cartCount === 0) return <Navigate to="/cart" replace />
  return <PaymentPage products={products} quantities={store.cart} subtotal={store.cartTotal} address={store.checkoutDetails.address} paymentMethods={store.paymentMethods} onPlaceOrder={(paymentMethodId) => store.placeOrder({ ...store.checkoutDetails, paymentMethodId })} />
}

export function OrdersRoute() {
  const navigate = useNavigate()
  const store = useStorefront()
  return <OrdersPage orders={store.orders} onNavigate={navigate} />
}

export function CustomerRoute({ page }: { page: CustomerPageName }) {
  const navigate = useNavigate()
  const store = useStorefront()
  return <CustomerPages page={page} onSubmit={(event, message) => { event.preventDefault(); store.notify(message) }} onShop={() => navigate('/shop')} />
}