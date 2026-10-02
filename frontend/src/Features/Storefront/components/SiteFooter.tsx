import type { FormEvent } from 'react'
import type { Page } from '../types'
import footerText from '../../../TextJson/Storefront/SiteFooter.json'
import brandText from '../../../TextJson/Brand.json'
import './SiteFooter.css'

type SiteFooterProps = {
  onNavigate: (page: Page) => void
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void
}

export function SiteFooter({ onNavigate, onSubmit }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div><button className="wordmark footer-wordmark" onClick={() => onNavigate('Home')}>{brandText.name}<span>®</span></button><p>{footerText.brandLine1}<br />{footerText.brandLine2}</p></div>
        <div className="footer-column"><span>{footerText.explore}</span><button onClick={() => onNavigate('Shop')}>{footerText.shop}</button><button onClick={() => onNavigate('Collections')}>{footerText.collections}</button><button onClick={() => onNavigate('About Brand')}>{footerText.about}</button></div>
        <div className="footer-column"><span>{footerText.customerCare}</span><button onClick={() => onNavigate('Contact')}>{footerText.contact}</button><button onClick={() => onNavigate('Orders')}>{footerText.orders}</button><button onClick={() => onNavigate('Track Order')}>{footerText.trackOrder}</button><button onClick={() => onNavigate('Returns')}>{footerText.returns}</button><button onClick={() => onNavigate('Policies')}>{footerText.policies}</button></div>
        <div className="footer-newsletter">
          <span>{footerText.newsletter}</span>
          <form onSubmit={(event) => onSubmit(event, footerText.newsletterSuccess)}>
            <input aria-label={footerText.newsletterEmail} type="email" required placeholder={footerText.newsletterEmail} />
            <button aria-label={footerText.subscribe}>↗</button>
          </form>
          <small>{footerText.newsletterNote}</small>
        </div>
      </div>
      <div className="footer-bottom"><span>{footerText.copyright}</span><span>{footerText.footerSignoff}</span><button onClick={() => onNavigate('Policies')}>{footerText.privacyTerms}</button></div>
    </footer>
  )
}