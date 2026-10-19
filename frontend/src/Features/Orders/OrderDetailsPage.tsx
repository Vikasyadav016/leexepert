import { Link } from 'react-router-dom'
import type { DemoOrder } from '../Storefront/types'
import { downloadOrderInvoice } from './downloadOrderInvoice'
import './OrderDetailsPage.css'

const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export function OrderDetailsPage({ order }: { order: DemoOrder }) {
  return (
    <section className="section-block content-page order-details-page">
      <div className="order-details-top"><div><p className="eyebrow">A record of the good things</p><h1>Order details</h1><p>Order {order.orderNumber} · {new Date(order.placedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p></div><span className="order-details-status">{order.status}</span></div>
      <div className="order-details-actions"><Link className="button button-outline" to={`/orders/${order.orderNumber}/tracking`}>Track this order <span>↗</span></Link><button className="button button-dark" onClick={() => downloadOrderInvoice(order)}>Download invoice PDF <span>↓</span></button></div>
      <div className="order-details-layout">
        <section className="order-details-items"><h2>Your pieces</h2>{order.lines.map((line) => <article className="order-details-item" key={line.productId}><img src={line.image} alt={line.name} /><div><strong>{line.name}</strong><span>{line.color} · Qty {line.quantity}</span></div><span>{currency(line.unitPrice * line.quantity)}</span></article>)}</section>
        <aside className="order-details-sidebar"><section><h2>Delivery</h2><address>{order.address.firstName} {order.address.lastName}<br />{order.address.addressLine1}{order.address.addressLine2 && <><br />{order.address.addressLine2}</>}<br />{order.address.city}, {order.address.region} {order.address.postalCode}<br />{order.address.country}</address></section><section><h2>Payment</h2><p>{order.paymentMethod.name}</p><small>{order.paymentStatus}</small></section><section className="order-details-totals"><h2>Summary</h2><p><span>Subtotal</span><span>{currency(order.subtotal)}</span></p>{order.discount ? <p className="order-details-savings"><span>Coupon {order.couponCode ? `(${order.couponCode})` : 'savings'}</span><span>−{currency(order.discount)}</span></p> : null}<p><span>Shipping</span><span>{order.shipping ? currency(order.shipping) : 'Complimentary'}</span></p><p><span>Estimated tax</span><span>{currency(order.tax)}</span></p><div><strong>Total paid</strong><strong>{currency(order.total)}</strong></div></section></aside>
      </div>
      <p className="order-details-note">Natural linen, thoughtfully made. Thank you for choosing pieces made to live in.</p>
    </section>
  )
}