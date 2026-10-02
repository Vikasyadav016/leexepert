import { useState } from 'react'
import type { Product, WishlistEvent } from '../Storefront/types'
import { EmptyState, ProductGrid } from '../Storefront/components/ProductGrid'

type WishlistPageProps = {
  products: Product[]
  wishlist: number[]
  events: WishlistEvent[]
  productCatalog: Product[]
  onNavigate: () => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
}

export function WishlistPage({ products, wishlist, events, productCatalog, onNavigate, onOpen, onWish, onAdd }: WishlistPageProps) {
  const [view, setView] = useState<'saved' | 'activity'>('saved')

  return (
    <section className="section-block content-page">
      <p className="eyebrow">Saved for later</p>
      <div className="history-heading"><h1>Your wishlist</h1><span className="heading-count">{wishlist.length} saved</span></div>
      <div className="history-tabs" role="tablist" aria-label="Wishlist views">
        <button role="tab" aria-selected={view === 'saved'} className={view === 'saved' ? 'selected' : ''} onClick={() => setView('saved')}>Saved pieces</button>
        <button role="tab" aria-selected={view === 'activity'} className={view === 'activity' ? 'selected' : ''} onClick={() => setView('activity')}>Wishlist history <span>{events.length}</span></button>
      </div>
      {view === 'saved' ? products.length
        ? <ProductGrid items={products} onOpen={onOpen} onWish={onWish} wishlist={wishlist} onAdd={onAdd} />
        : <EmptyState title="A place for the pieces you love." action="Explore the collection" onClick={onNavigate} />
        : <div className="activity-list">{events.length ? [...events].reverse().map((event) => {
          const product = productCatalog.find((item) => item.id === event.productId)
          if (!product) return null
          return <article className="activity-row" key={event.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{event.action === 'added' ? 'Saved to your wishlist' : 'Removed from your wishlist'}</span></div><time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></article>
        }) : <p className="history-empty">Your wishlist activity will appear here.</p>}</div>}
    </section>
  )
}