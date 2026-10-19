import type { CartQuantities, CheckoutTotals, CouponOffer, Product, ProductSelection } from '../Storefront/types'
import { EmptyState } from '../Storefront/components/ProductGrid'
import cartText from '../../TextJson/Cart/CartPage.json'
import './CartPage.css'

type CartPageProps = {
  products: Product[]
  quantities: CartQuantities
  selections: Record<number, ProductSelection>
  totals: CheckoutTotals
  selectedCoupon: CouponOffer | null
  onNavigate: (page: 'Shop' | 'Checkout' | 'Coupons') => void
  onSetQuantity: (productId: number, quantity: number) => void
}

export function CartPage({ products, quantities, selections, totals, selectedCoupon, onNavigate, onSetQuantity }: CartPageProps) {
  const cartProducts = products.filter((product) => quantities[product.id] > 0)
  const count = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0)

  return (
    <section className="section-block content-page">
      <p className="eyebrow">{cartText.eyebrow}</p>
      <h1>{cartText.title} <span className="heading-count">({count})</span></h1>
      {!count ? <EmptyState title={cartText.emptyTitle} action={cartText.shop} onClick={() => onNavigate('Shop')} /> : (
        <div className="cart-layout">
          <div className="cart-lines">
            {cartProducts.map((product) => (
              <div className="cart-line" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div className="cart-product"><span className="cart-product-name">{product.name}</span><span>{selections[product.id]?.color ?? product.color}{selections[product.id]?.size ? ` · Size ${selections[product.id].size}` : ''} · {product.category}</span><div className="quantity"><button aria-label={cartText.removeOne.replace('{name}', product.name)} onClick={() => onSetQuantity(product.id, quantities[product.id] - 1)}>−</button><span>{quantities[product.id]}</span><button aria-label={cartText.addOne.replace('{name}', product.name)} onClick={() => onSetQuantity(product.id, quantities[product.id] + 1)}>+</button></div></div>
                <strong>${(product.price * quantities[product.id]).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <aside className="order-summary"><p className="eyebrow">{cartText.summaryEyebrow}</p><h2>{cartText.total}</h2><p><span>{cartText.subtotal}</span><span>${totals.subtotal.toFixed(2)}</span></p>{selectedCoupon && <p className="cart-discount"><span>{selectedCoupon.code}</span><span>{totals.discount ? `−$${totals.discount.toFixed(2)}` : 'Not currently eligible'}</span></p>}<p><span>{cartText.shipping}</span><span>{totals.shipping ? `$${totals.shipping.toFixed(2)}` : cartText.complimentary}</span></p><p><span>Estimated tax</span><span>${totals.tax.toFixed(2)}</span></p><div className="summary-total"><span>Estimated total</span><strong>${totals.total.toFixed(2)}</strong></div><button className="button button-dark full-button" onClick={() => onNavigate('Checkout')}>{cartText.checkout} <span>↗</span></button><button className="cart-coupons-link" onClick={() => onNavigate('Coupons')}>Explore available offers</button><p className="secure-note">{cartText.demoNote}</p></aside>
        </div>
      )}
    </section>
  )
}