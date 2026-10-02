import type { CartQuantities, Product, Page } from '../types'
import { ProductGrid } from '../components/ProductGrid'
import './CatalogPage.css'
import catalogText from '../../../TextJson/Storefront/CatalogPage.json'

type CatalogPageProps = {
  page: 'Shop' | 'Collections' | 'Search'
  query: string
  products: Product[]
  wishlist: number[]
  quantities: CartQuantities
  onQueryChange: (query: string) => void
  onNavigate: (page: Page) => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
  onRemove: (productId: number) => void
}

export function CatalogPage({ page, query, products, wishlist, quantities, onQueryChange, onNavigate, onOpen, onWish, onAdd, onRemove }: CatalogPageProps) {
  return (
    <section className="catalog section-block">
      <p className="eyebrow">{page === 'Search' ? catalogText.searchEyebrow : catalogText.wardrobeEyebrow}</p>
      <div className="catalog-title"><h1>{page === 'Search' ? catalogText.searchTitle : page === 'Collections' ? catalogText.collectionsTitle : catalogText.shopTitle}</h1><span>{products.length} {catalogText.pieces}</span></div>
      {page === 'Search' && <label className="search-box"><span>{catalogText.searchLabel}</span><input autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={catalogText.searchPlaceholder} /></label>}
      {page === 'Collections' && <div className="collection-tabs"><button onClick={() => { onQueryChange(''); onNavigate('Shop') }}>{catalogText.allCollection}</button><button onClick={() => onQueryChange('Shirt')}>{catalogText.easyLayers}</button><button onClick={() => onQueryChange('Dress')}>{catalogText.warmDays}</button></div>}
      <ProductGrid items={products} onOpen={onOpen} onWish={onWish} wishlist={wishlist} quantities={quantities} onAdd={onAdd} onRemove={onRemove} />
    </section>
  )
}