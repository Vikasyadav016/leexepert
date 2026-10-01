import { useState, type FormEvent } from 'react'
import { SiteFooter } from './Features/Storefront/components/SiteFooter'
import { SiteHeader } from './Features/Storefront/components/SiteHeader'
import { CartPage } from './Features/Storefront/pages/CartPage'
import { CatalogPage } from './Features/Storefront/pages/CatalogPage'
import { CheckoutPage } from './Features/Storefront/pages/CheckoutPage'
import { CustomerPages } from './Features/Storefront/pages/CustomerPages'
import { HomePage } from './Features/Storefront/pages/HomePage'
import { ProductPage } from './Features/Storefront/pages/ProductPage'
import { WishlistPage } from './Features/Storefront/pages/WishlistPage'
import { products } from './Features/Storefront/data/products'
import type { CartQuantities, Page, Product } from './Features/Storefront/types'
import './App.css'

function App() {
  const [page, setPage] = useState<Page>('Home')
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [cart, setCart] = useState<CartQuantities>({})
  const [wishlist, setWishlist] = useState<number[]>([])
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const cartTotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0)
  const visibleProducts = products.filter((product) => `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query.toLowerCase()))
  const wishedProducts = products.filter((product) => wishlist.includes(product.id))

  function navigate(nextPage: Page) {
    setPage(nextPage)
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openProduct(product: Product) {
    setSelectedProduct(product)
    navigate('Product')
  }

  function addToCart(product: Product, amount = 1) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + amount }))
    setNotice(`${product.name} added to your bag`)
  }

  function setQuantity(productId: number, quantity: number) {
    setCart((current) => ({ ...current, [productId]: Math.max(0, quantity) }))
  }

  function toggleWishlist(product: Product) {
    setWishlist((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])
  }

  function submitForm(event: FormEvent<HTMLFormElement>, message: string) {
    event.preventDefault()
    setNotice(message)
  }

  function renderPage() {
    if (page === 'Home') {
      return <HomePage products={products} wishlist={wishlist} onNavigate={navigate} onOpen={openProduct} onWish={toggleWishlist} onAdd={addToCart} />
    }

    if (page === 'Shop' || page === 'Collections' || page === 'Search') {
      return <CatalogPage page={page} query={query} products={visibleProducts} wishlist={wishlist} onQueryChange={setQuery} onNavigate={navigate} onOpen={openProduct} onWish={toggleWishlist} onAdd={addToCart} />
    }

    if (page === 'Product') {
      return <ProductPage product={selectedProduct} isWishlisted={wishlist.includes(selectedProduct.id)} onAdd={addToCart} onToggleWishlist={toggleWishlist} />
    }

    if (page === 'Cart') {
      return <CartPage products={products} quantities={cart} total={cartTotal} onNavigate={navigate} onSetQuantity={setQuantity} />
    }

    if (page === 'Wishlist') {
      return <WishlistPage products={wishedProducts} wishlist={wishlist} onNavigate={() => navigate('Shop')} onOpen={openProduct} onWish={toggleWishlist} onAdd={addToCart} />
    }

    if (page === 'Checkout') {
      return <CheckoutPage products={products} quantities={cart} total={cartTotal} onNavigate={() => navigate('Shop')} onSubmit={submitForm} />
    }

    return <CustomerPages page={page} onNotice={setNotice} onSubmit={submitForm} onShop={() => navigate('Shop')} />
  }

  return (
    <div className="storefront">
      <SiteHeader page={page} cartCount={cartCount} wishlistCount={wishlist.length} onNavigate={navigate} />
      <main>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}
        {renderPage()}
      </main>
      <SiteFooter onNavigate={navigate} onSubmit={submitForm} />
    </div>
  )
}

export default App