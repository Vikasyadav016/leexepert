import type { DemoOrder, Page } from "../Storefront/types";
import { ProductRating } from "../Rating/ProductRating/ProductRating";
import orderCompleteText from "../../TextJson/Orders/OrderComplete.json";
import "./OrderCompletePage.css";

type OrderCompletePageProps = {
  order: DemoOrder;
  onRate: (productId: number, rating: number) => void;
  onNavigate: (page: Page) => void;
};

const currency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function OrderCompletePage({ order, onRate, onNavigate }: OrderCompletePageProps) {
  return (
    <section className="order-complete-page">
      <div className="order-complete-confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="order-complete-hero">
        <div className="order-complete-check" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="m10 21 7 7 14-16" /></svg></div>
        <p className="eyebrow">{orderCompleteText.eyebrow}</p>
        <h1>{orderCompleteText.title}</h1>
        <p>{orderCompleteText.subtitle}</p>
        <span className="order-complete-number">{orderCompleteText.orderNumber.replace("{orderNumber}", order.orderNumber)}</span>
        <small>{orderCompleteText.demoNote}</small>
      </div>
      <div className="order-complete-details">
        <div className="order-complete-heading"><h2>{orderCompleteText.itemsHeading}</h2><strong>{currency(order.total)}</strong></div>
        {order.lines.map((line) => (
          <article className="order-complete-line" key={line.productId}>
            <img src={line.image} alt={line.name} />
            <div className="order-complete-item-copy"><strong>{line.name}</strong><span>{line.color} · {orderCompleteText.quantity} {line.quantity}</span><span className="order-complete-rate-prompt">{line.rating ? orderCompleteText.rated : orderCompleteText.ratePrompt}</span><ProductRating value={line.rating} onChange={(rating) => onRate(line.productId, rating)} /></div>
            <span className="order-complete-price">{currency(line.unitPrice * line.quantity)}</span>
          </article>
        ))}
        <div className="order-complete-actions"><button className="button button-outline" onClick={() => onNavigate("Orders")}>{orderCompleteText.viewOrders}</button><button className="button button-dark" onClick={() => onNavigate("Shop")}>{orderCompleteText.continueShopping}<span>↗</span></button></div>
      </div>
    </section>
  );
}