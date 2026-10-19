import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './Services/AuthServices/AuthContext'
import { GuestOnlyRoute, RequireAuth } from './Services/AuthServices/RouteGuards'
import { StorefrontProvider } from './Features/Storefront/context/StorefrontContext'
import { LandingPage } from './Features/Storefront/pages/LandingPage'
import {
  CartRoute,
  CatalogRoute,
  CheckoutAddressRoute,
  CheckoutPaymentRoute,
  CouponsRoute,
  CustomerRoute,
  HomeRoute,
  OrderDetailsRoute,
  OrdersRoute,
  OrderCompleteRoute,
  OrderTrackingRoute,
  ProductRoute,
  WishlistHistoryRoute,
  WishlistRoute,
  ProfileRoute,
} from './Features/Storefront/pages/RouteViews'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <StorefrontProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />}>
              <Route index element={<HomeRoute />} />
              <Route path="shop" element={<CatalogRoute page="Shop" />} />
              <Route path="collections" element={<CatalogRoute page="Collections" />} />
              <Route path="search" element={<CatalogRoute page="Search" />} />
              <Route path="products/:productId" element={<ProductRoute />} />
              <Route path="cart" element={<CartRoute />} />
              <Route path="wishlist" element={<WishlistRoute />} />
              <Route path="coupons" element={<CouponsRoute />} />
              <Route element={<RequireAuth loginRequired />}>
                <Route path="wishlist/history" element={<WishlistHistoryRoute />} />
                <Route path="orders" element={<OrdersRoute />} />
                <Route path="orders/:orderNumber" element={<OrderDetailsRoute />} />
                <Route path="orders/:orderNumber/tracking" element={<OrderTrackingRoute />} />
                <Route path="track-order" element={<OrdersRoute />} />
                <Route path="order-complete/:orderNumber" element={<OrderCompleteRoute />} />
                <Route path="profile" element={<ProfileRoute />} />
              </Route>
              <Route element={<RequireAuth loginRequired />}>
                <Route path="checkout/address" element={<CheckoutAddressRoute />} />
                <Route path="checkout/payment" element={<CheckoutPaymentRoute />} />
              </Route>
              <Route element={<GuestOnlyRoute />}>
                <Route path="account" element={<CustomerRoute page="Account" />} />
              </Route>
              <Route path="returns" element={<CustomerRoute page="Returns" />} />
              <Route path="about" element={<CustomerRoute page="About Brand" />} />
              <Route path="contact" element={<CustomerRoute page="Contact" />} />
              <Route path="policies" element={<CustomerRoute page="Policies" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </StorefrontProvider>
    </BrowserRouter>
  )
}

export default App