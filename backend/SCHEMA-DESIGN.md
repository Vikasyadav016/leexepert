# Backend Schema Design

The Mongoose models live under `src/modules`, grouped by business domain. The existing root-level `schemas/` files were empty; they remain untouched for compatibility. Import models from `src/modules/index.ts` so every schema and index is registered before the app starts.

## Model Map

| Module | Models | Purpose |
| --- | --- | --- |
| `auth` | `AuthSession` | Hashed refresh-token sessions, expiry, revocation, device metadata |
| `users` | `User` | Customer/staff identity, verified contacts, addresses, preferences, role and account status |
| `products` | `Product`, `ProductVariant` | Product editorial/catalog data and separately addressable SKU/options/pricing |
| `categories` | `Category` | Hierarchical, publishable catalog taxonomy |
| `inventory` | `InventoryItem`, `StockMovement`, `InventoryReservation` | Warehouse balances, append-only movement audit, expiring checkout holds |
| `cart` | `Cart` | Guest or signed-in active cart; line prices are recalculated from catalog data |
| `wishlist` | `Wishlist` | User-owned saved products and optional variants |
| `orders` | `Order` | Immutable checkout line/address/price snapshots and order/payment/fulfillment states |
| `payments` | `Payment` | Provider payment attempts and idempotency; never card numbers or CVV |
| `shipping` | `Shipment` | Partial fulfillment, destination snapshot, carrier tracking and events |
| `notifications` | `Notification` | Channel, template, delivery state, retries and deduplication |
| `reviews` | `Review` | Order-linked reviews and moderation state |
| `coupons` | `Coupon`, `CouponRedemption` | Code discounts, limits and auditable order redemption |
| `promotions` | `Promotion`, `PromotionRedemption` | Scheduled automatic discounts, catalog targeting and auditable application |
| `returns` | `ReturnRequest` | Requested return lines, inspection, resolution and reverse tracking |
| `refunds` | `Refund` | Provider refund attempts linked to order/payment/return |
| `customer-support` | `SupportTicket` | Customer/guest case, assignment, status and message history |
| `cms` | `ContentPage` | Localized editorial and policy pages with publish scheduling |
| `analytics` | `AnalyticsEvent` | Product/order/user/session events with optional TTL retention |

## Persistence Rules

- All monetary amounts are integer minor units (for example, cents) with an ISO 4217 currency code. Do not store floating-point currency values. Percentage discounts use basis points (10,000 = 100%).
- Order lines, addresses, SKU, selected options, and unit prices are snapshots. Historic orders must not change when a product is edited or deleted.
- Product and variant records describe what can be sold; inventory is separate and keyed by variant plus warehouse. Available stock is `onHand - reserved`.
- Use MongoDB transactions for checkout/order creation, stock reservation/commit/release, coupon redemption, and refunds when running a replica set. Make commands idempotent with the supplied idempotency keys.
- Stock movement records are an append-only audit ledger. Update the inventory balance and write its movement in the same transaction.
- Recalculate cart prices and promotions at checkout. Never trust client-submitted price, tax, discount, or shipping totals.
- Store only password hashes, hashed refresh tokens, and payment-provider references. Do not persist raw passwords, refresh tokens, card numbers, CVV, or provider secrets.
- Authorization, ownership, state transitions, address validity, variant/product consistency, coupon limits, return windows, and cross-field/time-window rules belong in services. Mongoose field validation alone cannot enforce concurrent business invariants.
- TTL indexes are asynchronous cleanup, not exact-time authorization. Every session/reservation read must check `expiresAt` in application logic.
- Text and compound indexes are declared in model files. In production, manage index creation through controlled migrations rather than relying on automatic index builds at application startup.

## Checkout Lifecycle

1. Validate cart lines against active products/variants, current prices, promotion rules, destination, and shipping options.
2. In one transaction, create the order snapshot, reserve available stock, and create a pending provider payment attempt with an idempotency key.
3. Confirm/capture payment from a verified provider webhook; then commit the reservation, update order states, and enqueue deduplicated notifications.
4. Create one or more shipments from fulfilled order lines. Partial shipments are supported.
5. Returns reference original order-line IDs. Approved returns are inspected before restocking and refund creation; refund state remains separate from return state.

## Notes

The model files define persistence contracts. The backend now has an Express app, auth routes, environment-backed configuration, and a MongoDB connection/startup path. Domain services for commerce workflows, broader API validation, background workers, and migrations remain separate implementation work.

## Authentication Endpoints

`src/modules/auth/auth.routes.ts` exports `authRouter`; mount it at `/api/auth` to expose `POST /signup` and `POST /signin`. Set `JWT_ACCESS_SECRET` to a randomly generated secret of at least 32 bytes. Signup creates a `pending_verification` account, so email verification delivery/confirmation must be implemented before those accounts can sign in. Sign-in returns a 15-minute access JWT and sets a 30-day refresh token in an HttpOnly cookie; only its SHA-256 hash is persisted in `AuthSession`. A refresh/logout endpoint is not included yet.