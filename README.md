# leexepert



Absolutely. Since you want to **micro-manage the application**, the prompt should force the AI/development team to think in terms of **modules, services, database models, APIs, UI components, admin controls, workflows, permissions, notifications, delivery, and future integrations**, rather than simply generating a basic storefront.

 Below is a master prompt you can give to an AI coding agent such as Cursor, Claude Code, or another development assistant.

 # Premium Linen Clothing E-Commerce Web Application — Master Development Prompt

 ## 1\. Project Overview

 Build a production-ready, premium, modern, scalable e-commerce web application for my own clothing brand specializing in **premium linen clothing**.

 The application should feel like a high-end international fashion/lifestyle brand rather than a generic e-commerce website.

 The system must be:

 - Premium and visually sophisticated
- Minimal and elegant
- Fast and highly responsive
- Mobile-first
- SEO-friendly
- Accessible
- Scalable
- Modular
- Maintainable
- Secure
- Easy to manage from an admin panel
- Prepared for future payment gateway integration
- Prepared for future mobile applications
- Prepared for future multi-vendor/multi-region capabilities if required

 Do not build this as a simple monolithic storefront.

 The architecture should be modular and allow individual services/modules to evolve independently.

---

 # 2\. Technology Stack

 ## Frontend

 Use:

 - React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query for server-state management
- React Hook Form
- Zod for validation
- Modern component architecture
- Responsive design

 The frontend must work perfectly across:

 - Mobile
- Tablet
- Laptop
- Desktop
- Large desktop / wide screens

 Design mobile-first and progressively enhance for larger screens.

---

 # 3\. Backend

 Use:

 - Node.js
- Express.js
- TypeScript
- REST API architecture

 Structure backend into independent modules/services.

 Example:

```
backend/
├── src/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── inventory/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── shipping/
│   │   ├── notifications/
│   │   ├── reviews/
│   │   ├── coupons/
│   │   ├── promotions/
│   │   ├── returns/
│   │   ├── refunds/
│   │   ├── customer-support/
│   │   ├── cms/
│   │   └── analytics/
│   ├── middleware/
│   ├── utils/
│   ├── services/
│   ├── routes/
│   └── app.ts
```

 Keep business logic separate from controllers and routes.

 Use:

```
Route
  ↓
Controller
  ↓
Service
  ↓
Repository/Data Access
  ↓
MongoDB
```

---

 # 4\. Database

 Use:

 - MongoDB
- Mongoose
- TypeScript

 Design proper schemas, indexes, relationships/references and validation.

 The database architecture should support growth.

 Important entities should include:

 ### User

 - id
- firstName
- lastName
- email
- phone
- passwordHash
- role
- status
- avatar
- addresses
- preferences
- wishlist
- createdAt
- updatedAt
- lastLoginAt

 ### Product

 - id
- name
- slug
- SKU
- description
- shortDescription
- brand
- category
- subcategory
- fabric
- material
- color
- sizes
- variants
- images
- videos
- price
- compareAtPrice
- discount
- tax
- inventory
- careInstructions
- fit
- gender
- tags
- SEO metadata
- status
- featured
- bestseller
- newArrival
- createdAt
- updatedAt

 ### Product Variant

 Each product should support variants such as:

```
Product
 ├── Color
 │    ├── Size S
 │    ├── Size M
 │    ├── Size L
 │    └── Size XL
```

 Each variant should be independently trackable for inventory.

 Include:

 - SKU
- color
- size
- price
- stock
- lowStockThreshold
- images
- barcode if required

---

 # 5\. Customer-Facing Website

 Create a premium fashion storefront.

 ## Homepage

 Include:

 - Large premium hero section
- Brand statement
- New collection
- Featured products
- Best sellers
- Linen collection
- Men's collection
- Women's collection
- Seasonal collection
- Editorial section
- Brand story
- Fabric/storytelling section
- Sustainability section
- Customer testimonials
- Instagram/social section
- Newsletter subscription
- Footer

 The homepage should look editorial and luxurious.

 Avoid the appearance of a generic template.

---

 # 6\. Product Listing Page

 Create a sophisticated PLP.

 Features:

 - Product grid
- Sorting
- Filtering
- Search
- Pagination or infinite scrolling
- Category filtering
- Price filtering
- Size filtering
- Color filtering
- Fabric filtering
- Availability filtering
- Collection filtering
- Gender filtering
- New arrivals
- Best sellers
- Discounted products

 Allow users to switch between:

```
2-column
3-column
4-column
```

 depending on screen size.

---

 # 7\. Product Detail Page

 The product detail page should be highly polished.

 Include:

 - Product image gallery
- Zoom
- Product video
- Product name
- Price
- Discount
- Color selector
- Size selector
- Size guide
- Stock availability
- Quantity selector
- Add to cart
- Buy now
- Wishlist
- Product description
- Fabric details
- Fit information
- Care instructions
- Shipping information
- Return policy
- Reviews
- Ratings
- Related products
- Recently viewed products
- Frequently bought together

 Provide helpful UX such as:

```
Only 3 left
Low stock
In stock
Out of stock
Back in stock notification
```

---

 # 8\. Shopping Cart

 Create a complete cart system.

 Features:

 - Add product
- Remove product
- Update quantity
- Change variant
- Apply coupon
- Calculate subtotal
- Tax
- Shipping
- Discount
- Grand total
- Save for later
- Product availability validation
- Inventory validation

 The cart should persist for logged-in users.

 For guests, maintain cart using secure client/session mechanisms and merge the cart after login.

---

 # 9\. Wishlist

 Users should be able to:

 - Add products
- Remove products
- Move wishlist item to cart
- View wishlist
- Receive back-in-stock notification
- Receive price-drop notification

---

 # 10\. Authentication

 Implement secure authentication.

 Features:

 - Registration
- Login
- Logout
- Forgot password
- Reset password
- Email verification
- Change password
- Profile management
- Address management
- Session management

 Support:

```
Customer
Admin
Manager
Support Staff
Warehouse Staff
Content Manager
```

 Use role-based access control.

---

 # 11\. Checkout

 Build checkout in a modular way.

 Checkout should contain:

```
Cart
 ↓
Customer Information
 ↓
Shipping Address
 ↓
Delivery Method
 ↓
Order Summary
 ↓
Payment
 ↓
Order Confirmation
```

 Payment gateway will be integrated later.

 Therefore create a payment abstraction layer:

```
PaymentService
    ├── PaymentProviderInterface
    ├── FutureProvider
    └── PaymentWebhookHandler
```

 Do NOT tightly couple checkout to one payment provider.

 Later I should be able to add:

 - Razorpay
- Stripe
- PayPal
- Other gateways

 without rewriting checkout.

---

 # 12\. Order Management

 Create a complete order lifecycle.

 Example:

```
Pending
 ↓
Confirmed
 ↓
Processing
 ↓
Packed
 ↓
Shipped
 ↓
Out for Delivery
 ↓
Delivered
```

 Other states:

```
Cancelled
Failed
Returned
Refund Requested
Refunded
```

 Track every status change.

 Maintain an order timeline/audit history.

---

 # 13\. Delivery / Shipping Service

 Create shipping as a separate module/service.

 It should support future integration with delivery providers.

 Features:

 - Shipping zones
- Shipping methods
- Delivery charges
- Free shipping thresholds
- Estimated delivery date
- Tracking number
- Shipment creation
- Shipment tracking
- Delivery status
- Failed delivery
- Return shipment
- Exchange shipment

 Architecture:

```
ShippingService
    ├── ShippingProviderInterface
    ├── Provider A
    ├── Provider B
    └── TrackingService
```

 Do not hard-code a single courier provider.

---

 # 14\. Notification Service

 Create a separate notification service.

 It should support:

 ### Email

 - Welcome email
- Email verification
- Password reset
- Order confirmation
- Payment confirmation
- Order shipped
- Out for delivery
- Delivered
- Cancellation
- Refund
- Return
- Exchange
- Back in stock
- Price drop
- Promotional campaigns

 ### SMS

 Keep architecture ready for future SMS integration.

 ### Push Notifications

 Keep architecture ready for future web/mobile push notifications.

 Create a central notification system:

```
NotificationService
    ├── EmailProvider
    ├── SMSProvider
    └── PushProvider
```

 Notifications should be template-based.

 Admins should eventually be able to manage notification templates.

---

 # 15\. Admin Dashboard

 This is extremely important.

 Build a powerful premium admin dashboard.

 The admin should have complete control over the application.

 Dashboard should contain:

 ### Overview

 - Revenue
- Orders
- Customers
- Products
- Inventory
- Average order value
- Conversion metrics
- Sales charts
- Recent orders
- Low-stock products
- Pending returns
- Pending refunds

---

 # 16\. Product Management

 Admin can:

 - Create products
- Edit products
- Delete/archive products
- Create variants
- Upload images
- Upload videos
- Manage prices
- Manage discounts
- Manage inventory
- Manage SKUs
- Manage categories
- Manage tags
- Mark bestseller
- Mark featured
- Mark new arrival
- Manage SEO metadata

 Use a powerful product editor.

---

 # 17\. Inventory Management

 Create dedicated inventory management.

 Features:

 - Stock quantity
- Reserved quantity
- Available quantity
- Low-stock alerts
- Out-of-stock alerts
- Inventory adjustment
- Inventory history
- SKU management
- Variant-level inventory
- Stock movement history

 Example:

```
Stock = 100

Orders = 20

Reserved = 5

Available = 75
```

 Keep inventory calculations consistent and transactional.

---

 # 18\. Category & Collection Management

 Admin should be able to create:

 - Categories
- Subcategories
- Collections
- Seasonal collections
- Campaign collections
- Featured collections

 Example:

```
Men
 ├── Shirts
 ├── Trousers
 ├── Shorts

Women
 ├── Dresses
 ├── Shirts
 ├── Trousers
```

---

 # 19\. Coupon & Discount System

 Create a flexible promotion engine.

 Support:

 - Percentage discount
- Fixed discount
- Product-specific discount
- Category-specific discount
- Collection-specific discount
- Minimum order amount
- Maximum discount
- First-order discount
- Expiry date
- Usage limit
- Per-user usage limit

 Prepare architecture for future advanced campaigns.

---

 # 20\. Reviews & Ratings

 Customers should be able to:

 - Rate products
- Write reviews
- Upload images
- Edit reviews
- Report reviews

 Admin should be able to:

 - Approve reviews
- Reject reviews
- Hide reviews
- Moderate images
- Respond to reviews

 Only verified purchasers should be allowed to leave verified-purchase reviews.

---

 # 21\. Returns & Refunds

 Create a dedicated returns system.

 Customer can:

 - Request return
- Select reason
- Upload images
- Select items
- Track return status

 Admin can:

 - Approve/reject return
- Generate return shipment
- Inspect return
- Approve refund
- Reject refund
- Process exchange

 Payment refund integration should remain abstract until payment gateway is added.

---

 # 22\. CMS / Content Management

 Admin should be able to manage website content without changing code.

 Include:

 - Homepage banners
- Hero sections
- Promotional banners
- Editorial content
- Brand story
- Collection pages
- FAQs
- Shipping policy
- Return policy
- Privacy policy
- Terms
- Size guide

 Create reusable content blocks.

---

 # 23\. Search

 Implement a powerful product search system.

 Search should support:

 - Product name
- SKU
- Category
- Brand
- Collection
- Tags
- Fabric
- Color

 Include:

 - Search suggestions
- Recent searches
- Popular searches
- No-result suggestions

 Keep architecture ready for future Elasticsearch/Algolia integration.

---

 # 24\. SEO

 SEO must be treated as a first-class feature.

 Implement:

 - Dynamic page titles
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Twitter/X metadata
- Structured data
- Product schema
- Breadcrumb schema
- Organization schema
- Sitemap
- Robots.txt
- SEO-friendly URLs

 Example:

```
/products/premium-white-linen-shirt
```

 not:

```
/product?id=123
```

---

 # 25\. Analytics

 Create an analytics module.

 Track:

 - Page views
- Product views
- Search
- Add to cart
- Remove from cart
- Wishlist
- Checkout started
- Checkout completed
- Purchase
- Coupon usage
- Product performance

 Architecture should allow future integration with:

 - Google Analytics
- Meta Pixel
- Other analytics platforms

 Do not tightly couple business logic to one analytics provider.

---

 # 26\. Customer Account Dashboard

 Customer dashboard should contain:

 - Profile
- Orders
- Order details
- Track order
- Wishlist
- Addresses
- Saved preferences
- Returns
- Refunds
- Notifications
- Password/security

---

 # 27\. UI / UX Requirements

 The design must feel like a premium linen/fashion brand.

 Design direction:

 - Minimal
- Elegant
- Sophisticated
- Editorial
- High-end
- Lots of whitespace
- Strong typography
- Beautiful photography
- Subtle animations
- Premium hover effects
- Smooth transitions

 Avoid:

 - Cheap-looking gradients
- Excessive rounded cards
- Excessive shadows
- Overloaded UI
- Generic dashboard templates
- Unnecessary animations

 Use a restrained luxury color palette such as:

```
Warm white
Cream
Natural linen
Beige
Sand
Charcoal
Deep brown
Muted green
```

 Colors should be configurable through the design system.

---

 # 28\. Design System

 Create a reusable design system.

 Components should include:

 - Button
- Input
- Select
- Checkbox
- Radio
- Modal
- Drawer
- Dropdown
- Tooltip
- Tabs
- Accordion
- Toast
- Alert
- Badge
- Card
- ProductCard
- ProductGallery
- Price
- Rating
- Pagination
- Breadcrumb
- Navbar
- Footer
- DataTable
- Form components
- Loading states
- Skeleton loaders
- Empty states
- Error states

 Do not duplicate UI code.

---

 # 29\. Responsive Requirements

 Every page must be tested for:

```
320px
375px
390px
414px
768px
1024px
1280px
1440px
1920px+
```

 The website must not depend on a fixed desktop layout.

 Check:

 - Navigation
- Product grids
- Forms
- Tables
- Checkout
- Admin dashboard
- Modals
- Product galleries
- Filters

 on all screen sizes.

---

 # 30\. Accessibility

 Follow modern accessibility standards.

 Implement:

 - Semantic HTML
- Keyboard navigation
- Proper labels
- ARIA where required
- Focus states
- Color contrast
- Screen-reader friendly interactions
- Accessible forms
- Accessible modal/dialog behavior

---

 # 31\. Security

 Implement:

 - Password hashing
- Secure authentication
- Authorization
- RBAC
- Input validation
- Request validation
- Rate limiting
- CORS configuration
- HTTP security headers
- Sanitization
- Secure cookies where applicable
- Protection against common injection attacks
- Audit logging
- Environment variables for secrets

 Never expose:

 - Database credentials
- API secrets
- JWT secrets
- Payment secrets
- Email credentials

 to the frontend.

---

 # 32\. API Architecture

 Use clean REST APIs.

 Example:

```
/api/v1/auth
/api/v1/users
/api/v1/products
/api/v1/categories
/api/v1/collections
/api/v1/cart
/api/v1/wishlist
/api/v1/orders
/api/v1/payments
/api/v1/shipping
/api/v1/notifications
/api/v1/reviews
/api/v1/coupons
/api/v1/returns
/api/v1/refunds
/api/v1/cms
/api/v1/analytics
```

 Use API versioning.

 All APIs should return consistent responses.

 Example:

```
{
  "success": true,
  "data": {},
  "message": "Product created successfully",
  "meta": {}
}
```

 Error responses should follow a consistent structure.

---

 # 33\. Logging & Monitoring

 Create centralized logging.

 Track:

 - API errors
- Authentication events
- Admin actions
- Order events
- Payment events
- Shipping events
- Notification failures
- Database errors

 Create audit logs for important administrative operations.

---

 # 34\. Email Service

 Create email functionality as a separate service/module.

 Architecture:

```
EmailService
    ↓
TemplateEngine
    ↓
EmailProvider
```

 Templates should be reusable.

 Example:

```
emails/
├── welcome
├── verify-email
├── reset-password
├── order-confirmation
├── order-shipped
├── order-delivered
├── refund
├── return
└── promotional
```

 Keep the provider replaceable.

---

 # 35\. Background Jobs

 Prepare architecture for asynchronous tasks.

 Examples:

 - Sending emails
- Notifications
- Inventory synchronization
- Order processing
- Abandoned cart reminders
- Promotional campaigns
- Report generation

 Use a queue-based architecture when appropriate.

 Keep it modular so Redis/BullMQ or another queue system can be introduced without restructuring the entire application.

---

 # 36\. Environment Configuration

 Use environment variables.

 Example:

```
NODE_ENV=
PORT=
MONGODB_URI=
JWT_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
FRONTEND_URL=
PAYMENT_SECRET=
SHIPPING_API_KEY=
```

 Never commit secrets.

 Provide:

```
.env.example
```

---

 # 37\. Project Structure

 Use a clean monorepo-style structure if appropriate:

```
linen-brand-commerce/
│
├── apps/
│   ├── storefront/
│   ├── admin/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   ├── validation/
│   └── utils/
│
├── docs/
│
└── README.md
```

 If a monorepo is unnecessary initially, use a clean separated structure while keeping future migration easy.

---

 # 38\. Admin Permissions

 Implement granular permissions.

 Example:

```
ADMIN
    Full access

PRODUCT_MANAGER
    Products
    Categories
    Inventory

ORDER_MANAGER
    Orders
    Shipping
    Returns

CONTENT_MANAGER
    CMS
    Homepage
    Collections

SUPPORT
    Customers
    Orders
    Returns

ANALYST
    Analytics
    Reports
```

 Do not rely only on frontend hiding.

 Permissions must also be enforced on the backend.

---

 # 39\. Error Handling

 Create a centralized error-handling system.

 Frontend should have:

 - Loading states
- Skeleton states
- Empty states
- Error states
- Retry functionality
- Offline-friendly messaging where appropriate

 Backend should have:

 - Custom error classes
- Central error middleware
- Validation errors
- Authentication errors
- Authorization errors
- Not-found errors
- Database errors

---

 # 40\. Testing

 Create a testing strategy.

 Include:

 ### Frontend

 - Component tests
- Form tests
- Critical user-flow tests

 ### Backend

 - Unit tests
- Service tests
- API tests

 ### End-to-End

 Test critical flows:

```
Register
Login
Browse products
Search
Filter
Add to cart
Wishlist
Checkout
Create order
Track order
Cancel order
Return order
Admin login
Create product
Update inventory
Manage order
```

---

 # 41\. Performance

 Optimize for:

 - Fast initial load
- Image optimization
- Lazy loading
- Code splitting
- API caching
- Efficient MongoDB queries
- Pagination
- Optimized product images
- Minimal JavaScript where possible

 Avoid unnecessary API requests.

 Use proper database indexes.

---

 # 42\. Future Payment Integration

 Payment gateway is NOT required in the first implementation.

 However, the complete architecture must already contain:

```
Payment
PaymentMethod
PaymentTransaction
PaymentStatus
PaymentWebhook
Refund
```

 Use an abstraction such as:

```
interface PaymentProvider {
  createPayment(): Promise<any>;
  verifyPayment(): Promise<any>;
  refundPayment(): Promise<any>;
  handleWebhook(): Promise<any>;
}
```

 This allows a payment provider to be added later without redesigning checkout.

---

 # 43\. Future Integrations

 Keep extension points for:

 - Payment gateway
- Shipping/courier APIs
- SMS
- WhatsApp notifications
- Push notifications
- Google Analytics
- Meta Pixel
- Search engine
- CRM
- ERP
- Accounting software
- Tax systems
- Cloud storage
- CDN
- Social media
- Recommendation engine

---

 # 44\. Micro-Management Requirement

 I want to be able to control almost every important business operation from the admin panel.

 Do not hard-code business rules unnecessarily.

 Where practical, make these configurable:

 - Product status
- Inventory thresholds
- Shipping charges
- Free shipping threshold
- Coupon rules
- Tax settings
- Order statuses
- Return windows
- Notification templates
- Homepage content
- Collections
- Promotional banners
- Product visibility
- Featured products
- Store settings
- Customer settings

 Create a centralized settings system.

---

 # 45\. Admin Settings

 Create:

```
Settings
├── General
├── Store
├── Currency
├── Tax
├── Shipping
├── Orders
├── Returns
├── Notifications
├── Email
├── SEO
├── Social
├── Security
└── Integrations
```

---

 # 46\. Audit Trail

 Every important admin action should be traceable.

 Example:

```
Admin: John
Action: Updated Product
Product: Premium Linen Shirt
Old Price: ₹3,499
New Price: ₹3,799
Time: 2026-10-01 10:32
```

 Store audit logs in MongoDB.

---

 # 47\. Product Image Management

 Create a proper media management architecture.

 Support:

 - Multiple images
- Product thumbnails
- Variant images
- Product videos
- Image ordering
- Alt text
- Image deletion
- Image replacement

 Do not store large binary files directly inside MongoDB unless there is a specific reason.

 Prepare architecture for cloud object storage/CDN.

---

 # 48\. Data Validation

 Use shared validation schemas wherever practical.

 Validate:

 - Forms
- API requests
- Product data
- Orders
- Addresses
- Coupons
- User information

 Never trust frontend validation alone.

---

 # 49\. Documentation

 Create detailed documentation.

 Include:

```
README.md

docs/
├── architecture.md
├── database.md
├── api.md
├── authentication.md
├── payments.md
├── shipping.md
├── notifications.md
├── deployment.md
├── environment.md
├── admin.md
└── development.md
```

 Document important architectural decisions.

---

 # 50\. Development Process

 Do NOT attempt to generate the entire application in one step.

 Work incrementally.

 Follow this sequence:

 ### Phase 1 — Planning

 First create:

 - Architecture
- Folder structure
- Database ER/data model
- Module boundaries
- API plan
- Authentication strategy
- UI design system
- Development roadmap

 Do not write large amounts of implementation code yet.

 ### Phase 2 — Foundation

 Implement:

 - Project setup
- TypeScript
- Tailwind
- MongoDB
- Express
- API structure
- Error handling
- Validation
- Authentication
- RBAC
- Logging

 ### Phase 3 — Storefront

 Implement:

 - Homepage
- Navigation
- Product listing
- Product details
- Search
- Filters
- Cart
- Wishlist
- Customer account

 ### Phase 4 — Commerce

 Implement:

 - Checkout
- Orders
- Inventory
- Shipping
- Returns
- Coupons

 ### Phase 5 — Admin

 Implement:

 - Admin authentication
- Dashboard
- Products
- Inventory
- Orders
- Customers
- Coupons
- CMS
- Settings
- Analytics

 ### Phase 6 — Integrations

 Prepare/add:

 - Payment provider
- Email
- Shipping provider
- SMS
- Analytics
- Notifications

 ### Phase 7 — Testing & Production

 Complete:

 - Unit tests
- Integration tests
- E2E tests
- Security review
- Performance optimization
- SEO
- Accessibility
- Production deployment

---

 # 51\. Important AI Development Rules

 When working on this project, follow these rules strictly:

 1. Do not generate unnecessary code.
2. Do not create duplicate components.
3. Do not duplicate business logic.
4. Do not put business logic directly inside React components.
5. Do not put business logic directly inside Express routes.
6. Keep services modular.
7. Use TypeScript strictly.
8. Avoid `any` unless absolutely necessary.
9. Keep interfaces/types reusable.
10. Validate all external input.
11. Keep frontend and backend responsibilities separate.
12. Never expose secrets to the frontend.
13. Do not hard-code configurable business rules.
14. Do not tightly couple payment/shipping/email providers.
15. Keep future integrations in mind.
16. Use reusable UI components.
17. Keep accessibility in mind.
18. Keep responsive behavior in mind.
19. Optimize database queries.
20. Add proper indexes.
21. Use meaningful naming.
22. Keep functions small and focused.
23. Write documentation for architectural decisions.
24. Before changing an existing module, inspect its dependencies.
25. Do not break existing functionality when adding features.

---

 # 52\. Micro-Management Development Workflow

 For every development task, follow this workflow:

```
1. Understand requirement
        ↓
2. Inspect existing architecture
        ↓
3. Identify affected modules
        ↓
4. Explain proposed change
        ↓
5. Define files to create/change
        ↓
6. Implement
        ↓
7. Run type checking
        ↓
8. Run linting
        ↓
9. Run relevant tests
        ↓
10. Review security
        ↓
11. Review responsive UI
        ↓
12. Summarize changes
```

 Before making a major architectural change, explain:

 - Why the change is needed
- What files/modules are affected
- What alternatives were considered
- How it affects future scalability

---

 # 53\. UI Quality Requirement

 The application must not look AI-generated or like a generic admin/e-commerce template.

 Every important page should have intentional:

 - Typography
- Spacing
- Hierarchy
- Photography
- Interaction
- Responsive behavior
- Empty states
- Loading states
- Error states
- Micro-interactions

 The final result should resemble a premium fashion/lifestyle commerce experience.

---

 # 54\. Final Deliverable

 The final application should provide:

 ### Customer Website

```
Home
Shop
Collections
Product
Search
Cart
Wishlist
Checkout
Account
Orders
Returns
Track Order
About Brand
Contact
Policies
```

 ### Admin

```
Dashboard
Products
Categories
Collections
Inventory
Orders
Customers
Coupons
Returns
Refunds
Reviews
CMS
Notifications
Analytics
Reports
Settings
Users & Roles
Audit Logs
Integrations
```

 ### Backend Services

```
Authentication
Users
Products
Categories
Collections
Inventory
Cart
Wishlist
Orders
Payments
Shipping
Notifications
Email
Reviews
Coupons
Returns
Refunds
CMS
Analytics
Audit Logs
Settings
```

---

 # 55\. Most Important Instruction

 Build this as a **real production-grade premium clothing commerce platform**, not as a demo.

 Prioritize:

```
Architecture
Scalability
Maintainability
Security
Performance
Premium UI/UX
Responsive Design
Admin Control
Modularity
Future Integrations
```

 The system should be designed so that adding a new payment gateway, courier, email provider, SMS provider, analytics provider, or mobile application later does not require rewriting the core commerce system.

 Start by producing the **complete technical architecture, database design, module boundaries, API specification, folder structure, UI design system, and phased implementation roadmap**.

 Do not start generating the complete application until the architecture is clearly defined.

 ### One important recommendation

 Because you said you want to **micro-manage** the application, I would actually take this one step further: build the project as **three separately deployable applications** from the beginning:

```
                    ┌──────────────────┐
                    │   React Storefront│
                    │   Customer Web    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   API / Backend   │
                    │ Node + Express    │
                    └────────┬─────────┘
                             │
              ┌──────────────┼───────────────┐
              ▼              ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌────────────┐
        │ MongoDB  │   │  Email   │   │  Shipping  │
        │          │   │ Service  │   │  Service   │
        └──────────┘   └──────────┘   └────────────┘
                             │
                             ▼
                       Notification
                          Service
```

 And separately:

```
Customer Storefront
        ↓
Admin Dashboard
        ↓
Backend API
        ↓
Commerce Services
        ↓
External Integrations
```

 That separation will make your **payment, delivery, email, notification, inventory, analytics, and future integrations** much easier to control independently.

 If you're using an AI coding tool, I also recommend **not pasting the whole prompt and saying "build everything."** Give it the architecture first, then make it implement **one module at a time with a checklist and acceptance criteria**. This will give you much tighter control over the application.