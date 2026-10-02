import type { FormEvent } from "react";

type TrackOrderPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
};

export function TrackOrderPage({ onSubmit }: TrackOrderPageProps) {
  return (
    <section className="section-block content-page narrow-page">
      <p className="eyebrow">On its way?</p>
      <h1>Track your order</h1>
      <p className="page-intro">
        Enter your order details and we'll help you find your parcel.
      </p>
      <form
        className="simple-form"
        onSubmit={(event) =>
          onSubmit(
            event,
            "Tracking details are not connected yet. Please check your shipping confirmation email.",
          )
        }
      >
        <input required placeholder="Order number" />
        <input required type="email" placeholder="Email address" />
        <button className="button button-dark full-button">
          Find my order
        </button>
      </form>
    </section>
  );
}