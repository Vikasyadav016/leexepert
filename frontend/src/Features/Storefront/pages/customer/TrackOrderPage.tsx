import type { FormEvent } from "react";
import trackText from "../../../../TextJson/Customer/TrackOrderPage.json";

type TrackOrderPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
};

export function TrackOrderPage({ onSubmit }: TrackOrderPageProps) {
  return (
    <section className="section-block content-page narrow-page">
      <p className="eyebrow">{trackText.eyebrow}</p>
      <h1>{trackText.title}</h1>
      <p className="page-intro">{trackText.intro}</p>
      <form
        className="simple-form"
        onSubmit={(event) =>
          onSubmit(
            event,
            trackText.notConnected,
          )
        }
      >
        <input required placeholder={trackText.orderNumber} />
        <input required type="email" placeholder={trackText.email} />
        <button className="button button-dark full-button">
          {trackText.submit}
        </button>
      </form>
    </section>
  );
}