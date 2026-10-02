import { useState } from 'react'
import type { Page } from '../types'
import { UserAvatar } from './UserAvatar'
import headerText from '../../../TextJson/Storefront/SiteHeader.json'
import brandText from '../../../TextJson/Brand.json'
import './SiteHeader.css'

const mainNav: Page[] = ['Home', 'Shop', 'Collections']
const mainNavLabels: Record<string, string> = { Home: headerText.home, Shop: headerText.shop, Collections: headerText.collections }
const utilityNav: Page[] = ['Account', 'Wishlist', 'Cart']
const utilityLabels: Record<string, string> = { Account: headerText.account, Wishlist: headerText.wishlist, Cart: headerText.cart }

type SiteHeaderProps = {
  page: Page
  cartCount: number
  wishlistCount: number
  user?: { fullName: string; avatarUrl?: string } | null
  onNavigate: (page: Page) => void
}

export function SiteHeader({ page, cartCount, wishlistCount, user, onNavigate }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const visibleUtilityNav = user ? utilityNav.filter((item) => item !== 'Account') : utilityNav

  function navigateTo(nextPage: Page) {
    onNavigate(nextPage)
    setMenuOpen(false)
  }

  return (
    <>
      <div className="announcement">{headerText.announcement}</div>
      <header className="site-header">
        <button className="wordmark" onClick={() => navigateTo('Home')} aria-label={headerText.homeLabel}>{brandText.name}<span>®</span></button>
        <button
          className="mobile-profile-trigger"
          onClick={() => navigateTo(user ? 'Profile' : 'Account')}
          aria-label={user ? headerText.openProfile.replace('{name}', user.fullName) : headerText.openAccount}
        >
          <UserAvatar name={user?.fullName ?? 'Account'} imageUrl={user?.avatarUrl} />
        </button>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? headerText.closeMenu : headerText.openMenu}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
        <div id="site-navigation" className={`header-menu-panel${menuOpen ? ' is-open' : ''}`}>
          <nav className="main-nav" aria-label={headerText.mainNavigation}>
            {mainNav.map((item) => <button key={item} className={page === item ? 'nav-link active' : 'nav-link'} onClick={() => navigateTo(item)}>{mainNavLabels[item] ?? item}</button>)}
          </nav>
          <div className="header-actions">
            <button className="action-link search-action" onClick={() => navigateTo('Search')}>{headerText.search}</button>
            {visibleUtilityNav.map((item) => (
              <button key={item} className="action-link" onClick={() => navigateTo(item)}>
                {utilityLabels[item] ?? item}
                {item === 'Cart' && <span className="count">{cartCount}</span>}
                {item === 'Wishlist' && <span className="count">{wishlistCount}</span>}
              </button>
            ))}
            {user && (
              <button className={`profile-trigger${page === 'Profile' ? ' active' : ''}`} onClick={() => navigateTo('Profile')}>
              <UserAvatar name={user.fullName} imageUrl={user.avatarUrl} />
              <span>{user.fullName}</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}