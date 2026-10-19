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
            {mainNav.map((item) => <button key={item} className={page === item ? 'nav-link active' : 'nav-link'} aria-current={page === item ? 'page' : undefined} onClick={() => navigateTo(item)}>{mainNavLabels[item] ?? item}</button>)}
          </nav>
          <div className="header-actions">
            <button className="action-link search-action" onClick={() => navigateTo('Search')}>
              <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.2 4.2" /></svg>
              <span>{headerText.search}</span>
            </button>
            {visibleUtilityNav.map((item) => (
              <button key={item} className={`action-link ${item.toLowerCase()}-action`} onClick={() => navigateTo(item)}>
                {item === 'Wishlist' && <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 8.8c0 4.1-8.2 9.1-8.2 9.1S3.8 12.9 3.8 8.8a4.1 4.1 0 0 1 7.4-2.4.9.9 0 0 0 1.6 0 4.1 4.1 0 0 1 7.4 2.4Z" /></svg>}
                {item === 'Cart' && <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l1.8 10.1a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 1.9-1.5L21 9H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>}
                {item === 'Account' && <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.8-3.4 3-5.1 6.5-5.1s5.7 1.7 6.5 5.1" /></svg>}
                <span>{utilityLabels[item] ?? item}</span>
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