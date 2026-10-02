import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { useStorefront } from '../context/StorefrontContext'
import { pageForPath, pagePaths } from '../navigation'
import type { Page } from '../types'
import '../../../App.css'

export function LandingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const store = useStorefront()
  const page = pageForPath(location.pathname)
  const onNavigate = (nextPage: Page) => navigate(pagePaths[nextPage])

  return (
    <div className="storefront">
      <SiteHeader page={page} cartCount={store.cartCount} wishlistCount={store.wishlistIds.length} onNavigate={onNavigate} />
      <BackButton />
      <main>
        {store.notice && <div className="notice" role="status">{store.notice}<button onClick={store.clearNotice} aria-label="Dismiss">×</button></div>}
        <Outlet />
      </main>
      <SiteFooter onNavigate={onNavigate} onSubmit={(event, message) => { event.preventDefault(); store.notify(message) }} />
    </div>
  )
}