import type { Product } from '../types'
import './ProductPage.css'

type ProductPageProps = {
  product: Product
  isWishlisted: boolean
  onAdd: (product: Product) => void
  onBuyNow: (product: Product) => void
  onToggleWishlist: (product: Product) => void
}

export function ProductPage({ product, isWishlisted, onAdd, onBuyNow, onToggleWishlist }: ProductPageProps) {
  return (
    <section className="product-detail section-block">
      <div className="detail-image"><img src={product.image} alt={product.name} /></div>
      <div className="detail-copy">
        <p className="eyebrow">{product.category} / 100% linen</p>
        <h1>{product.name}</h1>
        <p className="detail-price">${product.price}.00</p>
        <p>{product.description}</p>
        <div className="product-meta"><span>Color</span><strong>{product.color}</strong></div>
        <div className="swatches"><button className="swatch selected" aria-label={`Select ${product.color}`} /><button className="swatch swatch-light" aria-label="Select natural linen" /><button className="swatch swatch-rust" aria-label="Select terracotta" /></div>
        <label className="size-label">Select size<select defaultValue=""><option value="" disabled>Choose a size</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option></select></label>
        <button className="button button-dark full-button" onClick={() => onAdd(product)}>Add to bag · ${product.price}.00</button>
        <button className="button button-outline full-button buy-now-button" onClick={() => onBuyNow(product)}>Buy now <span>↗</span></button>
        <button className="text-link detail-wish" onClick={() => onToggleWishlist(product)}>{isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} <span>♡</span></button>
        <div className="detail-footnote">Free shipping on orders over $150<br />Easy returns within 30 days</div>
      </div>
    </section>
  )
}