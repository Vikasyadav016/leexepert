import type { FormEvent } from 'react'
import type { Page } from '../types'
import './SiteFooter.css'

type SiteFooterProps = {
  onNavigate: (page: Page) => void
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void
}

export function SiteFooter({ onNavigate, onSubmit }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div><button className="wordmark footer-wordmark" onClick={() => onNavigate('Home')}>LEEX<span>®</span></button><p>Natural linen, thoughtfully made.<br />For all the days that make a life.</p></div>
        <div className="footer-column"><span>Explore</span><button onClick={() => onNavigate('Shop')}>Shop</button><button onClick={() => onNavigate('Collections')}>Collections</button><button onClick={() => onNavigate('About Brand')}>About brand</button></div>
        <div className="footer-column"><span>Customer care</span><button onClick={() => onNavigate('Contact')}>Contact</button><button onClick={() => onNavigate('Orders')}>Orders</button><button onClick={() => onNavigate('Track Order')}>Track order</button><button onClick={() => onNavigate('Returns')}>Returns</button><button onClick={() => onNavigate('Policies')}>Policies</button></div>
        <div className="footer-newsletter">
          <span>Notes from the linen life</span>
          <form onSubmit={(event) => onSubmit(event, 'You are on the list. See you in your inbox.')}>
            <input aria-label="Email for newsletter" type="email" required placeholder="Your email address" />
            <button aria-label="Subscribe">↗</button>
          </form>
          <small>Occasional letters, new arrivals and 10% off your first order.</small>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 Leex Studio</span><span>Made with care, worn everywhere.</span><button onClick={() => onNavigate('Policies')}>Privacy &amp; terms</button></div>
    </footer>
  )
}