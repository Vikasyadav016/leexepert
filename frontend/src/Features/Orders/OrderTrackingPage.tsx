import { Link } from 'react-router-dom'
import type { DemoOrder } from '../Storefront/types'
import { downloadOrderInvoice } from './downloadOrderInvoice'
import './OrderTrackingPage.css'

const stages = ['Order confirmed', 'Being prepared', 'On its way', 'Delivered']
const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

function currentStage(status: string) {
  const normalized = status.toLowerCase()
  if (normalized.includes('deliver')) return 3
  if (normalized.includes('ship') || normalized.includes('transit')) return 2
  if (normalized.includes('process') || normalized.includes('prepar')) return 1
  return 0
}

export function OrderTrackingPage({ order }: { order: DemoOrder }) {
  const activeStage = currentStage(order.status)
  const placedDate = new Date(order.placedAt)
  const deliveryDate = new Date(placedDate)
  deliveryDate.setDate(deliveryDate.getDate() + 5)
  const dateText = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <section className="order-tracking-page">
      <div className="tracking-head">
        <p className="eyebrow">A little closer to your door</p>
        <h1>Your order, in good hands.</h1>
        <p>Natural linen, on its way to a new favorite place.</p>
        <span className="tracking-order-number">ORDER {order.orderNumber}</span>
      </div>
      <div className="tracking-layout">
        <section className="tracking-journey" aria-label="Order journey">
          <div className="tracking-journey-heading"><div><span className="tracking-label">DELIVERY STATUS</span><h2>{stages[activeStage]}</h2></div><span className="tracking-status">{order.status}</span></div>
          <p className="tracking-estimate">{activeStage === 3 ? `Delivered ${dateText(placedDate)}.` : `Estimated arrival ${dateText(deliveryDate)}.`}</p>
          <ol className="tracking-timeline">
            {stages.map((stage, index) => (
              <li className={index < activeStage ? 'is-complete' : index === activeStage ? 'is-current' : ''} key={stage}>
                <span className="tracking-marker" aria-hidden="true">{index < activeStage ? '✓' : String(index + 1).padStart(2, '0')}</span>
                <div><strong>{stage}</strong><small>{index === 0 ? dateText(placedDate) : index === activeStage ? 'Current update' : 'Coming up'}</small></div>
              </li>
            ))}
          </ol>
          <p className="tracking-demo-note">This is a storefront demo. Carrier scans and live delivery updates are not connected.</p>
        </section>
        <aside className="tracking-aside">
          <div className="tracking-delivery"><span className="tracking-label">DELIVERING TO</span><strong>{order.address.firstName} {order.address.lastName}</strong><address>{order.address.addressLine1}{order.address.addressLine2 && <><br />{order.address.addressLine2}</>}<br />{order.address.city}, {order.address.region} {order.address.postalCode}<br />{order.address.country}</address></div>
          <div className="tracking-package"><span className="tracking-label">IN THIS PACKAGE</span>{order.lines.map((line) => <div className="tracking-item" key={line.productId}><img src={line.image} alt="" /><div><strong>{line.name}</strong><small>{line.color} · Qty {line.quantity}</small></div></div>)}<div className="tracking-total"><span>Order total</span><strong>{currency(order.total)}</strong></div></div>
          <div className="tracking-actions"><Link className="button button-dark" to={`/orders/${order.orderNumber}`}>View order details <span>↗</span></Link><button className="button button-outline" onClick={() => downloadOrderInvoice(order)}>Download invoice</button></div>
        </aside>
      </div>
    </section>
  )
}