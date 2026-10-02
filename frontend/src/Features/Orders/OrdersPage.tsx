import type { DemoOrder, Page } from '../Storefront/types'
import { ProductRating } from '../Rating/ProductRating/ProductRating'
import ordersText from '../../TextJson/Orders/OrdersPage.json'
import './OrdersPage.css'

type OrdersPageProps = {
  orders: DemoOrder[]
  onNavigate: (page: Page) => void
  onRate: (orderId: string, productId: number, rating: number) => void
}

const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export function OrdersPage({ orders, onNavigate, onRate }: OrdersPageProps) {
  return (
    <section className="section-block content-page order-history-page">
      <p className="eyebrow">{ordersText.eyebrow}</p>
      <div className="history-heading"><h1>{ordersText.title}</h1><span className="heading-count">{orders.length} {orders.length === 1 ? ordersText.order : ordersText.orders}</span></div>
      <p className="history-intro">{ordersText.intro}</p>
      {!orders.length ? <div className="empty-panel"><h2>{ordersText.emptyTitle}</h2><p>{ordersText.emptyBody}</p><button className="button button-outline" onClick={() => onNavigate('Shop')}>{ordersText.shop}<span>↗</span></button></div> : (
        <div className="order-history-list">{orders.map((order) => (
          <article className="history-order" key={order.id}>
            <div className="history-order-top"><div><span className="order-overline">{ordersText.orderPrefix} {order.orderNumber}</span><time dateTime={order.placedAt}>{new Date(order.placedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time></div><span className="order-status">{order.status}</span></div>
            <div className="history-order-body"><div className="history-order-lines">{order.lines.map((line) => <div className="history-order-line" key={`${order.id}-${line.productId}`}><img src={line.image} alt={line.name} /><div><strong>{line.name}</strong><span>{line.color} · {ordersText.quantity} {line.quantity}</span><div className="history-order-rating"><ProductRating value={line.rating} onChange={line.rating ? undefined : (rating) => onRate(order.id, line.productId, rating)} />{line.rating && <small>{ordersText.rated}</small>}</div></div><span>{currency(line.unitPrice * line.quantity)}</span></div>)}</div>
              <aside className="history-order-summary"><span>{ordersText.paidWith} {order.paymentMethod.name}</span><span>{order.paymentStatus}</span><div><strong>{ordersText.totalPaid}</strong><strong>{currency(order.total)}</strong></div><button className="text-link" onClick={() => onNavigate('Track Order')}>{ordersText.delivery}<span>↗</span></button></aside></div>
          </article>
        ))}</div>
      )}
    </section>
  )
}