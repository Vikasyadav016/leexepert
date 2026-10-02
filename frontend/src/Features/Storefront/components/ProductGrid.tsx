import type { KeyboardEvent } from 'react'
import type { Product } from '../types'
import type { CartQuantities } from '../types'
import productGridText from '../../../TextJson/Storefront/ProductGrid.json'
import './ProductGrid.css'

type ProductGridProps = {
  items: Product[]
  wishlist: number[]
  quantities: CartQuantities
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
  onRemove: (productId: number) => void
}

export function ProductGrid({ items, onOpen, onWish, wishlist, quantities, onAdd, onRemove }: ProductGridProps) {
  if (!items.length) {
    return <div className="empty-panel"><h2>{productGridText.empty.title}</h2><p>{productGridText.empty.body}</p></div>
  }

  function handlePhotoKeyDown(event: KeyboardEvent<HTMLDivElement>, product: Product) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen(product)
    }
  }

  return (
    <div className="product-grid">
      {items.map((product, index) => (
        <article className="product-card" key={product.id} style={{ animationDelay: `${index * 70}ms` }}>
          {(() => {
            const quantity = quantities[product.id] ?? 0
            return (
              <>
          <div className="product-photo" onClick={() => onOpen(product)} role="button" tabIndex={0} onKeyDown={(event) => handlePhotoKeyDown(event, product)}>
            <img src={product.image} alt={product.name} />
            <button className={wishlist.includes(product.id) ? 'wish-button wished' : 'wish-button'} aria-label={wishlist.includes(product.id) ? productGridText.removeFromWishlist : productGridText.addToWishlist} onClick={(event) => { event.stopPropagation(); onWish(product) }}>{wishlist.includes(product.id) ? '♥' : '♡'}</button>
            <div className={`product-cart-actions${quantity ? ' has-quantity' : ''}`}>
              <button className="quick-add" onClick={(event) => { event.stopPropagation(); quantity ? onRemove(product.id) : onAdd(product) }}>{quantity ? productGridText.cart.remove : productGridText.cart.quickAdd}</button>
              {quantity > 0 && <button className="quick-add-more" onClick={(event) => { event.stopPropagation(); onAdd(product) }}>{productGridText.cart.addMore} <span>· {quantity}</span></button>}
            </div>
          </div>
          <div className="product-info"><button onClick={() => onOpen(product)}>{product.name}</button><span>${product.price}.00</span></div>
          <p className="product-color">{product.color} · {product.category}</p>
              </>
            )
          })()}
        </article>
      ))}
    </div>
  )
}

export function EmptyState({ title, action, onClick }: { title: string; action: string; onClick: () => void }) {
  return <div className="empty-panel"><h2>{title}</h2><button className="button button-outline" onClick={onClick}>{action} <span>↗</span></button></div>
}