import { Link } from 'react-router-dom'
import type { CartQuantities, Product, WishlistEvent } from '../Storefront/types'
import { EmptyState, ProductGrid } from '../Storefront/components/ProductGrid'
import wishlistText from '../../TextJson/Wishlist/WishlistPage.json'
import './WishlistPage.css'

type WishlistPageProps = {
  products: Product[]
  wishlist: number[]
  quantities: CartQuantities
  onNavigate: () => void
  onHistory: () => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
  onRemove: (productId: number) => void
}

export function WishlistPage({ products, wishlist, quantities, onNavigate, onHistory, onOpen, onWish, onAdd, onRemove }: WishlistPageProps) {
  return (
    <section className="section-block content-page">
      <p className="eyebrow">{wishlistText.eyebrow}</p>
      <div className="history-heading"><h1>{wishlistText.title}</h1><span className="heading-count">{wishlist.length} {wishlistText.saved}</span></div>
      <div className="wishlist-toolbar"><span>{wishlistText.toolbar}</span><button className="text-link" onClick={onHistory}>{wishlistText.history} <span>↗</span></button></div>
      {products.length
        ? <ProductGrid items={products} onOpen={onOpen} onWish={onWish} wishlist={wishlist} quantities={quantities} onAdd={onAdd} onRemove={onRemove} />
        : <EmptyState title={wishlistText.emptyTitle} action={wishlistText.shop} onClick={onNavigate} />}
    </section>
  )
}

export function WishlistHistoryPage({ events, productCatalog }: { events: WishlistEvent[]; productCatalog: Product[] }) {
  return (
    <section className="section-block content-page">
      <p className="eyebrow">{wishlistText.historyEyebrow}</p>
      <div className="history-heading"><h1>{wishlistText.historyTitle}</h1><span className="heading-count">{events.length} {wishlistText.moments}</span></div>
      <div className="wishlist-toolbar"><span>{wishlistText.historyToolbar}</span><Link className="text-link" to="/wishlist">{wishlistText.backToWishlist} <span>↗</span></Link></div>
      <div className="activity-list">{events.length ? [...events].sort((first, second) => Date.parse(second.occurredAt) - Date.parse(first.occurredAt)).map((event) => {
          const product = productCatalog.find((item) => item.id === event.productId)
          if (!product) return null
          return <article className="activity-row" key={event.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{event.action === 'added' ? wishlistText.added : wishlistText.removed}</span></div><time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></article>
        }) : <p className="history-empty">{wishlistText.emptyHistory}</p>}</div>
    </section>
  )
}