import { useState } from 'react'
import type { Product, ProductSelection } from '../types'
import './ProductPage.css'
import productText from '../../../TextJson/Storefront/ProductPage.json'

type ProductPageProps = {
  product: Product
  isWishlisted: boolean
  onAdd: (product: Product, selection: ProductSelection) => void
  onBuyNow: (product: Product, selection: ProductSelection) => void
  onToggleWishlist: (product: Product) => void
}

export function ProductPage({ product, isWishlisted, onAdd, onBuyNow, onToggleWishlist }: ProductPageProps) {
  const colorOptions = [product.color, productText.naturalLinen, productText.terracotta]
  const [color, setColor] = useState(product.color)
  const [size, setSize] = useState('')
  const [selectionError, setSelectionError] = useState('')

  function submitSelection(action: (item: Product, selection: ProductSelection) => void) {
    if (!size) {
      setSelectionError('Please choose a size before continuing.')
      return
    }
    setSelectionError('')
    action(product, { color, size })
  }

  return (
    <section className="product-detail section-block">
      <div className="detail-image"><img src={product.image} alt={product.name} /></div>
      <div className="detail-copy">
        <p className="eyebrow">{product.category} / {productText.linenDescriptor}</p>
        <h1>{product.name}</h1>
        <p className="detail-price">${product.price}.00</p>
        <p>{product.description}</p>
        <div className="product-meta"><span>{productText.color}</span><strong>{color}</strong></div>
        <div className="swatches" role="group" aria-label={productText.color}>{colorOptions.map((option, index) => <button type="button" key={option} className={`swatch${index === 1 ? ' swatch-light' : index === 2 ? ' swatch-rust' : ''}${color === option ? ' selected' : ''}`} aria-label={productText.selectColor.replace('{color}', option)} aria-pressed={color === option} title={option} onClick={() => setColor(option)} />)}</div>
        <label className="size-label">{productText.selectSize}<select value={size} aria-invalid={Boolean(selectionError)} onChange={(event) => { setSize(event.target.value); setSelectionError('') }}><option value="">{productText.chooseSize}</option>{productText.sizes.map((option) => <option key={option}>{option}</option>)}</select></label>
        {selectionError && <p className="variant-error" role="alert">{selectionError}</p>}
        <button type="button" className="button button-dark full-button" onClick={() => submitSelection(onAdd)}>{productText.addToBag} · ${product.price}.00</button>
        <button type="button" className="button button-outline full-button buy-now-button" onClick={() => submitSelection(onBuyNow)}>{productText.buyNow} <span>↗</span></button>
        <button className="text-link detail-wish" onClick={() => onToggleWishlist(product)}>{isWishlisted ? productText.removeWishlist : productText.addWishlist} <span>♡</span></button>
        <div className="detail-footnote">{productText.shipping}<br />{productText.returns}</div>
      </div>
    </section>
  )
}