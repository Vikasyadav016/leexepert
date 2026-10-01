import type { FormEvent } from 'react'
import type { CartQuantities, Product } from '../types'
import { EmptyState } from '../components/ProductGrid'

type CheckoutPageProps = {
  products: Product[]
  quantities: CartQuantities
  total: number
  onNavigate: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void
}

export function CheckoutPage({ products, quantities, total, onNavigate, onSubmit }: CheckoutPageProps) {
  const cartProducts = products.filter((product) => quantities[product.id] > 0)

  return (
    <section className="section-block content-page">
      <p className="eyebrow">Almost yours</p>
      <h1>Checkout</h1>
      {!cartProducts.length ? <EmptyState title="Your bag is empty." action="Shop the collection" onClick={onNavigate} /> : (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={(event) => onSubmit(event, 'Order received. This demo checkout does not process payment yet.')}>
            <h2>Contact</h2><input type="email" required placeholder="Email address" />
            <h2>Delivery address</h2>
            <div className="form-row"><input required placeholder="First name" /><input required placeholder="Last name" /></div>
            <input required placeholder="Address" />
            <div className="form-row"><input required placeholder="City" /><input required placeholder="Postal code" /></div>
            <input required placeholder="Country / region" />
            <button className="button button-dark full-button">Place order · ${total}.00</button>
          </form>
          <aside className="order-summary"><h2>In your bag</h2>{cartProducts.map((product) => <p key={product.id}><span>{product.name} × {quantities[product.id]}</span><span>${product.price * quantities[product.id]}.00</span></p>)}<div className="summary-total"><span>Total</span><strong>${total}.00</strong></div></aside>
        </div>
      )}
    </section>
  )
}