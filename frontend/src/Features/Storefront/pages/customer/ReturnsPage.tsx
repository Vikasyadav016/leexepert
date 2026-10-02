import type { FormEvent } from "react";

type ReturnsPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
};

export function ReturnsPage({ onSubmit }: ReturnsPageProps) {
  return (
    <section className="section-block content-page narrow-page">
      <p className="eyebrow">Here to help</p>
      <h1>Returns</h1>
      <p className="page-intro">
        We hope you love your Leex pieces. If something isn't quite right, start
        a return within 30 days of delivery.
      </p>
      <form
        className="simple-form"
        onSubmit={(event) =>
          onSubmit(
            event,
            "Return request received. Our care team will be in touch.",
          )
        }
      >
        <input required placeholder="Order number" />
        <input required type="email" placeholder="Email used at checkout" />
        <select required defaultValue="">
          <option value="" disabled>
            Reason for return
          </option>
          <option>Fit wasn't right</option>
          <option>Changed my mind</option>
          <option>Something else</option>
        </select>
        <button className="button button-dark full-button">
          Start a return
        </button>
      </form>
    </section>
  );
}