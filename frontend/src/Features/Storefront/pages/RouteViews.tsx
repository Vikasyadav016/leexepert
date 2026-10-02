import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CartPage } from '../../Cart/CartPage'
import { OrdersPage } from '../../Orders/OrdersPage'
import { OrderCompletePage } from '../../Orders/OrderCompletePage'
import { AddressPage } from '../../Payment/AddressPage'
import { PaymentPage } from '../../Payment/PaymentPage'
import { WishlistHistoryPage } from '../../Wishlist/WishlistPage'
import { WishlistPage } from '../../Wishlist/WishlistPage'
import { CatalogPage } from './CatalogPage'
import { CustomerPages } from './CustomerPages'
import { HomePage } from './HomePage'
import { ProductPage } from './ProductPage'
import { ProfilePage } from './ProfilePage'
import { products } from '../data/products'
import { pagePaths } from '../navigation'
import { useStorefront } from '../context/StorefrontContext'
import { useAuth } from '../../../Services/AuthServices/AuthContext'
import { returnPathFromState } from '../../../Services/AuthServices/RouteGuards'
import type { Page, Product } from '../types'

type CatalogPageName = Extract<Page, 'Shop' | 'Collections' | 'Search'>
type CustomerPageName = Extract<Page, 'Account' | 'Returns' | 'Track Order' | 'About Brand' | 'Contact' | 'Policies'>

export function HomeRoute() {
  const store = useStorefront()
  const navigate = useNavigate()
  return <HomePage products={products} wishlist={store.wishlistIds} quantities={store.cart} onNavigate={(page) => navigate(pagePaths[page])} onOpen={(product) => navigate(`/products/${product.id}`)} onWish={store.toggleWishlist} onAdd={store.addToCart} onRemove={(productId) => store.setQuantity(productId, 0)} />
}

export function CatalogRoute({ page }: { page: CatalogPageName }) {
  const store = useStorefront()
  const navigate = useNavigate()
  const visibleProducts = products.filter((product) => `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(store.query.toLowerCase()))
  return <CatalogPage page={page} query={store.query} products={visibleProducts} wishlist={store.wishlistIds} quantities={store.cart} onQueryChange={store.setQuery} onNavigate={(nextPage) => navigate(pagePaths[nextPage])} onOpen={(product) => navigate(`/products/${product.id}`)} onWish={store.toggleWishlist} onAdd={store.addToCart} onRemove={(productId) => store.setQuantity(productId, 0)} />
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
  return <WishlistPage products={store.wishedProducts} wishlist={store.wishlistIds} quantities={store.cart} onNavigate={() => navigate('/shop')} onHistory={() => navigate('/wishlist/history')} onOpen={(product) => navigate(`/products/${product.id}`)} onWish={store.toggleWishlist} onAdd={store.addToCart} onRemove={(productId) => store.setQuantity(productId, 0)} />
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
  const navigate = useNavigate()
  if (store.cartCount === 0) return <Navigate to="/cart" replace />
  return <PaymentPage products={products} quantities={store.cart} subtotal={store.cartTotal} address={store.checkoutDetails.address} paymentMethods={store.paymentMethods} onPlaceOrder={(paymentMethodId) => { const order = store.placeOrder({ ...store.checkoutDetails, paymentMethodId }); if (order) navigate(`/order-complete/${order.orderNumber}`) }} />
}

export function OrdersRoute() {
  const navigate = useNavigate()
  const store = useStorefront()
  return <OrdersPage orders={store.orders} onNavigate={navigate} onRate={store.rateOrderItem} />
}

export function OrderCompleteRoute() {
  const { orderNumber } = useParams()
  const navigate = useNavigate()
  const store = useStorefront()
  const order = store.orders.find((item) => item.orderNumber === orderNumber)
  if (!order) return <Navigate to="/orders" replace />
  return <OrderCompletePage order={order} onRate={(productId, rating) => store.rateOrderItem(order.id, productId, rating)} onNavigate={navigate} />
}

export function ProfileRoute() {
  const navigate = useNavigate()
  const store = useStorefront()
  const auth = useAuth()
  if (!auth.user) return <Navigate to="/" replace />

  return (
    <ProfilePage
      user={auth.user}
      orders={store.orders}
      address={store.checkoutDetails.address}
      wishlistCount={store.wishlistIds.length}
      onNavigate={(page) => navigate(pagePaths[page])}
      onLogout={() => { auth.logout(); navigate('/', { replace: true }) }}
      onNotice={store.notify}
    />
  )
}

export function CustomerRoute({ page }: { page: CustomerPageName }) {
  const navigate = useNavigate()
  const location = useLocation()
  const store = useStorefront()
  const auth = useAuth()
  return <CustomerPages page={page} onNotice={store.notify} onAuthenticated={(profile) => { const result = auth.authenticate(profile, { cart: store.cart, wishlist: store.wishlist }); store.restoreAccountData(result.storeData); navigate(returnPathFromState(location.state), { replace: true }) }} onSubmit={(event, message) => { event.preventDefault(); store.notify(message) }} onShop={() => navigate('/shop')} />
}