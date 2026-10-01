import type { Product, Page } from '../types'
import { ProductGrid } from '../components/ProductGrid'

type CatalogPageProps = {
  page: 'Shop' | 'Collections' | 'Search'
  query: string
  products: Product[]
  wishlist: number[]
  onQueryChange: (query: string) => void
  onNavigate: (page: Page) => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
}

export function CatalogPage({ page, query, products, wishlist, onQueryChange, onNavigate, onOpen, onWish, onAdd }: CatalogPageProps) {
  return (
    <section className="catalog section-block">
      <p className="eyebrow">{page === 'Search' ? 'Find your favorite' : 'The Leex wardrobe'}</p>
      <div className="catalog-title"><h1>{page === 'Search' ? 'Search' : page === 'Collections' ? 'Collections' : 'Shop all'}</h1><span>{products.length} pieces</span></div>
      {page === 'Search' && <label className="search-box"><span>Search the collection</span><input autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Try ‘shirt’ or ‘olive’" /></label>}
      {page === 'Collections' && <div className="collection-tabs"><button onClick={() => { onQueryChange(''); onNavigate('Shop') }}>The full collection</button><button onClick={() => onQueryChange('Shirt')}>Easy layers</button><button onClick={() => onQueryChange('Dress')}>Warm-weather days</button></div>}
      <ProductGrid items={products} onOpen={onOpen} onWish={onWish} wishlist={wishlist} onAdd={onAdd} />
    </section>
  )
}