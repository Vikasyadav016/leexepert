import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StorefrontProvider } from './Features/Storefront/context/StorefrontContext'
import { LandingPage } from './Features/Storefront/pages/LandingPage'
import {
  CartRoute,
  CatalogRoute,
  CheckoutAddressRoute,
  CheckoutPaymentRoute,
  CustomerRoute,
  HomeRoute,
  OrdersRoute,
  ProductRoute,
  WishlistHistoryRoute,
  WishlistRoute,
} from './Features/Storefront/pages/RouteViews'

function App() {
  return (
    <BrowserRouter>
      <StorefrontProvider>
        <Routes>
          <Route path="/" element={<LandingPage />}>
            <Route index element={<HomeRoute />} />
            <Route path="shop" element={<CatalogRoute page="Shop" />} />
            <Route path="collections" element={<CatalogRoute page="Collections" />} />
            <Route path="search" element={<CatalogRoute page="Search" />} />
            <Route path="products/:productId" element={<ProductRoute />} />
            <Route path="cart" element={<CartRoute />} />
            <Route path="wishlist" element={<WishlistRoute />} />
            <Route path="wishlist/history" element={<WishlistHistoryRoute />} />
            <Route path="checkout/address" element={<CheckoutAddressRoute />} />
            <Route path="checkout/payment" element={<CheckoutPaymentRoute />} />
            <Route path="orders" element={<OrdersRoute />} />
            <Route path="account" element={<CustomerRoute page="Account" />} />
            <Route path="returns" element={<CustomerRoute page="Returns" />} />
            <Route path="track-order" element={<CustomerRoute page="Track Order" />} />
            <Route path="about" element={<CustomerRoute page="About Brand" />} />
            <Route path="contact" element={<CustomerRoute page="Contact" />} />
            <Route path="policies" element={<CustomerRoute page="Policies" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </StorefrontProvider>
    </BrowserRouter>
  )
}

export default App