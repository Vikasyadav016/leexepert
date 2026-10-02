import { Link } from 'react-router-dom'
import type { Product, WishlistEvent } from '../Storefront/types'
import { EmptyState, ProductGrid } from '../Storefront/components/ProductGrid'

type WishlistPageProps = {
  products: Product[]
  wishlist: number[]
  onNavigate: () => void
  onHistory: () => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
}

export function WishlistPage({ products, wishlist, onNavigate, onHistory, onOpen, onWish, onAdd }: WishlistPageProps) {
  return (
    <section className="section-block content-page">
      <p className="eyebrow">Saved for later</p>
      <div className="history-heading"><h1>Your wishlist</h1><span className="heading-count">{wishlist.length} saved</span></div>
      <div className="wishlist-toolbar"><span>Your favorite pieces, kept close.</span><button className="text-link" onClick={onHistory}>View wishlist history <span>↗</span></button></div>
      {products.length
        ? <ProductGrid items={products} onOpen={onOpen} onWish={onWish} wishlist={wishlist} onAdd={onAdd} />
        : <EmptyState title="A place for the pieces you love." action="Explore the collection" onClick={onNavigate} />}
    </section>
  )
}

export function WishlistHistoryPage({ events, productCatalog }: { events: WishlistEvent[]; productCatalog: Product[] }) {
  return (
    <section className="section-block content-page">
      <p className="eyebrow">Saved, unsaved, remembered</p>
      <div className="history-heading"><h1>Wishlist history</h1><span className="heading-count">{events.length} moments</span></div>
      <div className="wishlist-toolbar"><span>A little trail of the pieces you loved.</span><Link className="text-link" to="/wishlist">Back to saved pieces <span>↗</span></Link></div>
      <div className="activity-list">{events.length ? [...events].sort((first, second) => Date.parse(second.occurredAt) - Date.parse(first.occurredAt)).map((event) => {
          const product = productCatalog.find((item) => item.id === event.productId)
          if (!product) return null
          return <article className="activity-row" key={event.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{event.action === 'added' ? 'Saved to your wishlist' : 'Removed from your wishlist'}</span></div><time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></article>
        }) : <p className="history-empty">Your wishlist activity will appear here.</p>}</div>
    </section>
  )
}