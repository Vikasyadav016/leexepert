import type { FormEvent } from 'react'
import type { Page } from '../types'

type CustomerPagesProps = {
  page: Extract<Page, 'Account' | 'Orders' | 'Returns' | 'Track Order' | 'About Brand' | 'Contact' | 'Policies'>
  onNotice: (message: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void
  onShop: () => void
}

function AccountPage({ onNotice, onSubmit }: Pick<CustomerPagesProps, 'onNotice' | 'onSubmit'>) {
  return <section className="section-block content-page narrow-page"><p className="eyebrow">Welcome back</p><h1>Your account</h1><form className="simple-form" onSubmit={(event) => onSubmit(event, 'Sign-in is not connected yet. Your account service will be available soon.')}><p>Sign in to see your orders, save your favorites and make checkout a little easier.</p><input required type="email" placeholder="Email address" /><input required type="password" placeholder="Password" /><button className="button button-dark full-button">Sign in</button><button type="button" className="text-link" onClick={() => onNotice('Account creation will be available soon.')}>Create an account <span>↗</span></button></form></section>
}

function OrdersPage({ onShop }: Pick<CustomerPagesProps, 'onShop'>) {
  return <section className="section-block content-page"><p className="eyebrow">Your purchases</p><h1>Orders</h1><div className="empty-panel"><h2>No orders just yet.</h2><p>Once you place an order, you can follow its progress here.</p><button className="text-link" onClick={onShop}>Find your first favorite <span>↗</span></button></div></section>
}

function ReturnsPage({ onSubmit }: Pick<CustomerPagesProps, 'onSubmit'>) {
  return <section className="section-block content-page narrow-page"><p className="eyebrow">Here to help</p><h1>Returns</h1><p className="page-intro">We hope you love your Leex pieces. If something isn't quite right, start a return within 30 days of delivery.</p><form className="simple-form" onSubmit={(event) => onSubmit(event, 'Return request received. Our care team will be in touch.')}><input required placeholder="Order number" /><input required type="email" placeholder="Email used at checkout" /><select required defaultValue=""><option value="" disabled>Reason for return</option><option>Fit wasn't right</option><option>Changed my mind</option><option>Something else</option></select><button className="button button-dark full-button">Start a return</button></form></section>
}

function TrackOrderPage({ onSubmit }: Pick<CustomerPagesProps, 'onSubmit'>) {
  return <section className="section-block content-page narrow-page"><p className="eyebrow">On its way?</p><h1>Track your order</h1><p className="page-intro">Enter your order details and we'll help you find your parcel.</p><form className="simple-form" onSubmit={(event) => onSubmit(event, 'Tracking details are not connected yet. Please check your shipping confirmation email.')}><input required placeholder="Order number" /><input required type="email" placeholder="Email address" /><button className="button button-dark full-button">Find my order</button></form></section>
}

function AboutPage({ onShop }: Pick<CustomerPagesProps, 'onShop'>) {
  return <section className="section-block content-page editorial-page"><p className="eyebrow">A considered wardrobe</p><h1>Less, but lived in.</h1><p className="editorial-lead">Leex began with a simple thought: the things we wear every day should feel a little more like ourselves.</p><div className="editorial-image" role="img" aria-label="Timeless natural fabric and clothing" /><p className="page-intro">We make small collections of lasting essentials in natural linen. We choose fabrics for how they feel, work with makers who care about their craft, and design for real life: creases, sunlight, long lunches and all.</p><button className="button button-dark" onClick={onShop}>Meet the collection <span>↗</span></button></section>
}

function ContactPage({ onSubmit }: Pick<CustomerPagesProps, 'onSubmit'>) {
  return <section className="section-block content-page narrow-page"><p className="eyebrow">A real person, always</p><h1>Contact</h1><p className="page-intro">Questions about fit, fabric or an order? Send us a note and our small team will get back to you within two business days.</p><form className="simple-form" onSubmit={(event) => onSubmit(event, 'Thanks for reaching out. We will be in touch soon.')}><input required placeholder="Your name" /><input required type="email" placeholder="Email address" /><select defaultValue="Order question"><option>Order question</option><option>Product and sizing</option><option>Something else</option></select><textarea required placeholder="How can we help?" rows={5} /><button className="button button-dark full-button">Send message</button></form><p className="contact-email">Or write to <a href="mailto:hello@leex.com">hello@leex.com</a></p></section>
}

function PoliciesPage() {
  return <section className="section-block content-page narrow-page policy-page"><p className="eyebrow">The useful details</p><h1>Policies</h1><details open><summary>Shipping</summary><p>Complimentary standard shipping on orders over $150. Orders are prepared in 1–3 business days. Tracking details are sent as soon as your parcel is on its way.</p></details><details><summary>Returns &amp; exchanges</summary><p>Unworn items can be returned within 30 days of delivery. Items should be in their original condition with tags attached. Start a return from the Returns page.</p></details><details><summary>Care for linen</summary><p>Wash cool with like colors and let your linen air dry. A warm iron works beautifully, though we think linen is lovely with a little life in it.</p></details><details><summary>Privacy</summary><p>Your details are used only to support your order and experience with Leex. We never sell personal information.</p></details></section>
}

export function CustomerPages({ page, onNotice, onSubmit, onShop }: CustomerPagesProps) {
  switch (page) {
    case 'Account': return <AccountPage onNotice={onNotice} onSubmit={onSubmit} />
    case 'Orders': return <OrdersPage onShop={onShop} />
    case 'Returns': return <ReturnsPage onSubmit={onSubmit} />
    case 'Track Order': return <TrackOrderPage onSubmit={onSubmit} />
    case 'About Brand': return <AboutPage onShop={onShop} />
    case 'Contact': return <ContactPage onSubmit={onSubmit} />
    case 'Policies': return <PoliciesPage />
  }
}