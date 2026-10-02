import type { CartQuantities, Product } from '../types'
import { ProductGrid } from '../components/ProductGrid'
import './HomePage.css'
import homeText from '../../../TextJson/Storefront/HomePage.json'

type HomePageProps = {
  products: Product[]
  wishlist: number[]
  quantities: CartQuantities
  onNavigate: (page: 'Shop' | 'About Brand') => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
  onRemove: (productId: number) => void
}

export function HomePage({ products, wishlist, quantities, onNavigate, onOpen, onWish, onAdd, onRemove }: HomePageProps) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy"><p className="eyebrow">{homeText.heroEyebrow}</p><h1>{homeText.heroHeadline[0]}<br />{homeText.heroHeadline[1]}</h1><p>{homeText.heroDescription}</p><button className="button button-dark" onClick={() => onNavigate('Shop')}>{homeText.heroAction} <span>↗</span></button></div>
        <div className="hero-image" role="img" aria-label={homeText.heroImageAlt} />
        <div className="hero-caption">{homeText.heroCaption}</div>
      </section>
      <section className="category-strip"><span>{homeText.categoryStrip}</span><button onClick={() => onNavigate('Shop')}>{homeText.shopAll} <span>↗</span></button></section>
      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">{homeText.sectionEyebrow}</p><h2>{homeText.sectionTitle}</h2></div><button className="text-link" onClick={() => onNavigate('Shop')}>{homeText.viewAll} <span>↗</span></button></div>
        <ProductGrid items={products.slice(0, 3)} onOpen={onOpen} onWish={onWish} wishlist={wishlist} quantities={quantities} onAdd={onAdd} onRemove={onRemove} />
      </section>
      <section className="brand-note"><p className="eyebrow">{homeText.brandEyebrow}</p><p className="brand-quote">{homeText.brandQuote}</p><button className="text-link" onClick={() => onNavigate('About Brand')}>{homeText.aboutAction} <span>↗</span></button></section>
    </>
  )
}