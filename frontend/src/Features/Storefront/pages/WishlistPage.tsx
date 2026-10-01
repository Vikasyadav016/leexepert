import type { Product } from '../types'
import { EmptyState, ProductGrid } from '../components/ProductGrid'

type WishlistPageProps = {
  products: Product[]
  wishlist: number[]
  onNavigate: () => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
}

export function WishlistPage({ products, wishlist, onNavigate, onOpen, onWish, onAdd }: WishlistPageProps) {
  return (
    <section className="section-block content-page">
      <p className="eyebrow">Saved for later</p>
      <h1>Your wishlist <span className="heading-count">({wishlist.length})</span></h1>
      {products.length
        ? <ProductGrid items={products} onOpen={onOpen} onWish={onWish} wishlist={wishlist} onAdd={onAdd} />
        : <EmptyState title="A place for the pieces you love." action="Explore the collection" onClick={onNavigate} />}
    </section>
  )
}