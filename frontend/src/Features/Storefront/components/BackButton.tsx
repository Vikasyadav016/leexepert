import { useLocation, useNavigate } from 'react-router-dom'

function fallbackPath(pathname: string): string {
  if (pathname.startsWith('/products/')) return '/shop'
  if (pathname === '/checkout/payment') return '/checkout/address'
  if (pathname === '/checkout/address') return '/cart'
  if (pathname === '/wishlist/history') return '/wishlist'
  if (pathname === '/orders') return '/shop'
  return '/'
}

export function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const historyIndex = window.history.state?.idx

  if (location.pathname === '/' && !(typeof historyIndex === 'number' && historyIndex > 0)) return null

  function goBack() {
    if (typeof historyIndex === 'number' && historyIndex > 0) navigate(-1)
    else navigate(fallbackPath(location.pathname), { replace: true })
  }

  return <button className="back-button" type="button" onClick={goBack}><span aria-hidden="true">←</span> Back</button>
}