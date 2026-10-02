import type { Product } from '../types'
import './ProductPage.css'
import productText from '../../../TextJson/Storefront/ProductPage.json'

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
        <p className="eyebrow">{product.category} / {productText.linenDescriptor}</p>
        <h1>{product.name}</h1>
        <p className="detail-price">${product.price}.00</p>
        <p>{product.description}</p>
        <div className="product-meta"><span>{productText.color}</span><strong>{product.color}</strong></div>
        <div className="swatches"><button className="swatch selected" aria-label={productText.selectColor.replace('{color}', product.color)} /><button className="swatch swatch-light" aria-label={productText.selectColor.replace('{color}', productText.naturalLinen)} /><button className="swatch swatch-rust" aria-label={productText.selectColor.replace('{color}', productText.terracotta)} /></div>
        <label className="size-label">{productText.selectSize}<select defaultValue=""><option value="" disabled>{productText.chooseSize}</option>{productText.sizes.map((size) => <option key={size}>{size}</option>)}</select></label>
        <button className="button button-dark full-button" onClick={() => onAdd(product)}>{productText.addToBag} · ${product.price}.00</button>
        <button className="button button-outline full-button buy-now-button" onClick={() => onBuyNow(product)}>{productText.buyNow} <span>↗</span></button>
        <button className="text-link detail-wish" onClick={() => onToggleWishlist(product)}>{isWishlisted ? productText.removeWishlist : productText.addWishlist} <span>♡</span></button>
        <div className="detail-footnote">{productText.shipping}<br />{productText.returns}</div>
      </div>
    </section>
  )
}