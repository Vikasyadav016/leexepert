import "./PoliciesPage.css";

export function PoliciesPage() {
  return (
    <section className="section-block content-page narrow-page policy-page">
      <p className="eyebrow">The useful details</p>
      <h1>Policies</h1>
      <details open>
        <summary>Shipping</summary>
        <p>
          Complimentary standard shipping on orders over $150. Orders are
          prepared in 1–3 business days. Tracking details are sent as soon as
          your parcel is on its way.
        </p>
      </details>
      <details>
        <summary>Returns &amp; exchanges</summary>
        <p>
          Unworn items can be returned within 30 days of delivery. Items should
          be in their original condition with tags attached. Start a return
          from the Returns page.
        </p>
      </details>
      <details>
        <summary>Care for linen</summary>
        <p>
          Wash cool with like colors and let your linen air dry. A warm iron
          works beautifully, though we think linen is lovely with a little life
          in it.
        </p>
      </details>
      <details>
        <summary>Privacy</summary>
        <p>
          Your details are used only to support your order and experience with
          Leex. We never sell personal information.
        </p>
      </details>
    </section>
  );
}