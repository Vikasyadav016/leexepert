import type { CartQuantities, Product } from '../Storefront/types'
import { EmptyState } from '../Storefront/components/ProductGrid'

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
                <img src={product.image} alt={product.name} />
                <div className="cart-product"><span className="cart-product-name">{product.name}</span><span>{product.color} · {product.category}</span><div className="quantity"><button aria-label={`Remove one ${product.name}`} onClick={() => onSetQuantity(product.id, quantities[product.id] - 1)}>−</button><span>{quantities[product.id]}</span><button aria-label={`Add one ${product.name}`} onClick={() => onSetQuantity(product.id, quantities[product.id] + 1)}>+</button></div></div>
                <strong>${(product.price * quantities[product.id]).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <aside className="order-summary"><p className="eyebrow">A little summary</p><h2>Order total</h2><p><span>Subtotal</span><span>${total.toFixed(2)}</span></p><p><span>Shipping</span><span>{total >= 150 ? 'Complimentary' : '$8.00 at checkout'}</span></p><div className="summary-total"><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><button className="button button-dark full-button" onClick={() => onNavigate('Checkout')}>Continue to checkout <span>↗</span></button><p className="secure-note">Demo checkout · no real payment is collected.</p></aside>
        </div>
      )}
    </section>
  )
}