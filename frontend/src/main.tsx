import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import brandText from './TextJson/Brand.json'

document.title = brandText.title

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    if (property) element.setAttribute('property', name)
    else element.name = name
    document.head.append(element)
  }
  element.content = content
}

setMeta('description', brandText.description)
setMeta('keywords', brandText.keywords)
setMeta('theme-color', brandText.themeColor)
setMeta('og:title', brandText.title, true)
setMeta('og:description', brandText.description, true)
setMeta('og:site_name', brandText.legalName, true)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
