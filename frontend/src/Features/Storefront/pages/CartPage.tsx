import type { CartQuantities, Product } from '../types'
import { EmptyState } from '../components/ProductGrid'

type CartPageProps = {
  products: Product[]
  quantities: CartQuantities
  total: number
  onNavigate: (page: 'Shop' | 'Checkout') => void
  onSetQuantity: (productId: number, quantity: number) => void
}

export function CartPage({ products, quantities, total, onNavigate, onSetQuantity }: CartPageProps) {
  const cartProducts = products.filter((product) => quantities[product.id] > 0)
  const count = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0)

  return (
    <section className="section-block content-page">
      <p className="eyebrow">Your selection</p>
      <h1>Your bag <span className="heading-count">({count})</span></h1>
      {!count ? <EmptyState title="Your bag is taking a breather." action="Shop the collection" onClick={() => onNavigate('Shop')} /> : (
        <div className="cart-layout">
          <div className="cart-lines">
            {cartProducts.map((product) => (
              <div className="cart-line" key={product.id}>
                <img src={product.image} alt="" />
                <div className="cart-product"><span className="cart-product-name">{product.name}</span><span>{product.color}</span><div className="quantity"><button aria-label={`Remove one ${product.name}`} onClick={() => onSetQuantity(product.id, quantities[product.id] - 1)}>−</button><span>{quantities[product.id]}</span><button aria-label={`Add one ${product.name}`} onClick={() => onSetQuantity(product.id, quantities[product.id] + 1)}>+</button></div></div>
                <strong>${product.price * quantities[product.id]}.00</strong>
              </div>
            ))}
          </div>
          <aside className="order-summary"><h2>Summary</h2><p><span>Subtotal</span><span>${total}.00</span></p><p><span>Shipping</span><span>{total >= 150 ? 'Complimentary' : 'Calculated at checkout'}</span></p><div className="summary-total"><span>Total</span><strong>${total}.00</strong></div><button className="button button-dark full-button" onClick={() => onNavigate('Checkout')}>Continue to checkout <span>↗</span></button></aside>
        </div>
      )}
    </section>
  )
}