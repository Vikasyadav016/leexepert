import type { FormEvent } from "react";
import "./ContactPage.css";

type ContactPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
};

export function ContactPage({ onSubmit }: ContactPageProps) {
  return (
    <section className="section-block content-page narrow-page">
      <p className="eyebrow">A real person, always</p>
      <h1>Contact</h1>
      <p className="page-intro">
        Questions about fit, fabric or an order? Send us a note and our small
        team will get back to you within two business days.
      </p>
      <form
        className="simple-form"
        onSubmit={(event) =>
          onSubmit(event, "Thanks for reaching out. We will be in touch soon.")
        }
      >
        <input required placeholder="Your name" />
        <input required type="email" placeholder="Email address" />
        <select defaultValue="Order question">
          <option>Order question</option>
          <option>Product and sizing</option>
          <option>Something else</option>
        </select>
        <textarea required placeholder="How can we help?" rows={5} />
        <button className="button button-dark full-button">Send message</button>
      </form>
      <p className="contact-email">
        Or write to <a href="mailto:hello@leex.com">hello@leex.com</a>
      </p>
    </section>
  );
}