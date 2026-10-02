import type { DemoOrder, Page } from '../Storefront/types'
import './OrdersPage.css'

type OrdersPageProps = {
  orders: DemoOrder[]
  onNavigate: (page: Page) => void
}

const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export function OrdersPage({ orders, onNavigate }: OrdersPageProps) {
  return (
    <section className="section-block content-page order-history-page">
      <p className="eyebrow">A record of the good things</p>
      <div className="history-heading"><h1>Order history</h1><span className="heading-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></div>
      <p className="history-intro">Your past purchases, all in one place. Demo orders are saved in this browser.</p>
      {!orders.length ? <div className="empty-panel"><h2>No orders just yet.</h2><p>Your first favorite is waiting to be found.</p><button className="button button-outline" onClick={() => onNavigate('Shop')}>Explore the collection <span>↗</span></button></div> : (
        <div className="order-history-list">{orders.map((order) => (
          <article className="history-order" key={order.id}>
            <div className="history-order-top"><div><span className="order-overline">ORDER {order.orderNumber}</span><time dateTime={order.placedAt}>{new Date(order.placedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time></div><span className="order-status">{order.status}</span></div>
            <div className="history-order-body"><div className="history-order-lines">{order.lines.map((line) => <div className="history-order-line" key={`${order.id}-${line.productId}`}><img src={line.image} alt={line.name} /><div><strong>{line.name}</strong><span>{line.color} · Qty {line.quantity}</span></div><span>{currency(line.unitPrice * line.quantity)}</span></div>)}</div>
              <aside className="history-order-summary"><span>Paid with {order.paymentMethod.name}</span><span>{order.paymentStatus}</span><div><strong>Total paid</strong><strong>{currency(order.total)}</strong></div><button className="text-link" onClick={() => onNavigate('Track Order')}>View delivery details <span>↗</span></button></aside></div>
          </article>
        ))}</div>
      )}
    </section>
  )
}