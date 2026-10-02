import type { KeyboardEvent } from 'react'
import type { Product } from '../types'
import './ProductGrid.css'

type ProductGridProps = {
  items: Product[]
  wishlist: number[]
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
}

export function ProductGrid({ items, onOpen, onWish, wishlist, onAdd }: ProductGridProps) {
  if (!items.length) {
    return <div className="empty-panel"><h2>No pieces found.</h2><p>Try another search or browse the full collection.</p></div>
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
          <div className="product-photo" onClick={() => onOpen(product)} role="button" tabIndex={0} onKeyDown={(event) => handlePhotoKeyDown(event, product)}>
            <img src={product.image} alt={product.name} />
            <button className={wishlist.includes(product.id) ? 'wish-button wished' : 'wish-button'} aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'} onClick={(event) => { event.stopPropagation(); onWish(product) }}>{wishlist.includes(product.id) ? '♥' : '♡'}</button>
            <button className="quick-add" onClick={(event) => { event.stopPropagation(); onAdd(product) }}>Quick add +</button>
          </div>
          <div className="product-info"><button onClick={() => onOpen(product)}>{product.name}</button><span>${product.price}.00</span></div>
          <p className="product-color">{product.color} · {product.category}</p>
        </article>
      ))}
    </div>
  )
}

export function EmptyState({ title, action, onClick }: { title: string; action: string; onClick: () => void }) {
  return <div className="empty-panel"><h2>{title}</h2><button className="button button-outline" onClick={onClick}>{action} <span>↗</span></button></div>
}