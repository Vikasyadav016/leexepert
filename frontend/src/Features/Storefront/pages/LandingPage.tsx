import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { PremiumToast } from '../components/PremiumToast'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { useStorefront } from '../context/StorefrontContext'
import { useAuth } from '../../../Services/AuthServices/AuthContext'
import { pageForPath, pagePaths } from '../navigation'
import type { Page } from '../types'
import '../Storefront.css'

export function LandingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const store = useStorefront()
  const auth = useAuth()
  const page = pageForPath(location.pathname)
  const onNavigate = (nextPage: Page) => navigate(pagePaths[nextPage])

  return (
    <div className="storefront">
      <SiteHeader page={page} cartCount={store.cartCount} wishlistCount={store.wishlistIds.length} user={auth.user} onNavigate={onNavigate} />
      <BackButton />
      <main>
        {store.notice && <PremiumToast notice={store.notice} onDismiss={store.clearNotice} />}
        <Outlet />
      </main>
      <SiteFooter onNavigate={onNavigate} onSubmit={(event, message) => { event.preventDefault(); store.notify(message) }} />
    </div>
  )
}