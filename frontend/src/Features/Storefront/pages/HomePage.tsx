import type { Product } from '../types'
import { ProductGrid } from '../components/ProductGrid'
import './HomePage.css'

type HomePageProps = {
  products: Product[]
  wishlist: number[]
  onNavigate: (page: 'Shop' | 'About Brand') => void
  onOpen: (product: Product) => void
  onWish: (product: Product) => void
  onAdd: (product: Product) => void
}

export function HomePage({ products, wishlist, onNavigate, onOpen, onWish, onAdd }: HomePageProps) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy"><p className="eyebrow">Linen for living</p><h1>Wear the<br />unhurried.</h1><p>Thoughtful essentials in natural linen, made to feel like yours from the very first wear.</p><button className="button button-dark" onClick={() => onNavigate('Shop')}>Shop the collection <span>↗</span></button></div>
        <div className="hero-image" role="img" aria-label="Woman wearing a relaxed linen outfit" />
        <div className="hero-caption">01 / 04 &nbsp; THE SLOW SUMMER EDIT</div>
      </section>
      <section className="category-strip"><span>Made for warmer days</span><button onClick={() => onNavigate('Shop')}>Shop all linen <span>↗</span></button></section>
      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">The good things</p><h2>Pieces to live in</h2></div><button className="text-link" onClick={() => onNavigate('Shop')}>View all <span>↗</span></button></div>
        <ProductGrid items={products.slice(0, 3)} onOpen={onOpen} onWish={onWish} wishlist={wishlist} onAdd={onAdd} />
      </section>
      <section className="brand-note"><p className="eyebrow">A softer kind of everyday</p><p className="brand-quote">Good clothes should feel like a deep breath. We make fewer, better things from natural fibers, with care in every detail.</p><button className="text-link" onClick={() => onNavigate('About Brand')}>A little about us <span>↗</span></button></section>
    </>
  )
}