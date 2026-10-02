import type { Page } from '../types'
import './SiteHeader.css'

const mainNav: Page[] = ['Home', 'Shop', 'Collections']
const utilityNav: Page[] = ['Account', 'Wishlist', 'Cart']

type SiteHeaderProps = {
  page: Page
  cartCount: number
  wishlistCount: number
  onNavigate: (page: Page) => void
}

export function SiteHeader({ page, cartCount, wishlistCount, onNavigate }: SiteHeaderProps) {
  return (
    <>
      <div className="announcement">A little more room to breathe. Complimentary shipping over $150.</div>
      <header className="site-header">
        <button className="wordmark" onClick={() => onNavigate('Home')} aria-label="Leex home">LEEX<span>®</span></button>
        <nav className="main-nav" aria-label="Main navigation">
          {mainNav.map((item) => <button key={item} className={page === item ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate(item)}>{item}</button>)}
        </nav>
        <div className="header-actions">
          <button className="action-link search-action" onClick={() => onNavigate('Search')}>Search</button>
          {utilityNav.map((item) => (
            <button key={item} className="action-link" onClick={() => onNavigate(item)}>
              {item}
              {item === 'Cart' && <span className="count">{cartCount}</span>}
              {item === 'Wishlist' && <span className="count">{wishlistCount}</span>}
            </button>
          ))}
        </div>
      </header>
    </>
  )
}