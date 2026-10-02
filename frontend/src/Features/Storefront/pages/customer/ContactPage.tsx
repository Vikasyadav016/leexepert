import type { FormEvent } from "react";
import "./ContactPage.css";
import contactText from "../../../../TextJson/Customer/ContactPage.json";
import brandText from "../../../../TextJson/Brand.json";

type ContactPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
};

export function ContactPage({ onSubmit }: ContactPageProps) {
  return (
    <section className="section-block content-page narrow-page">
      <p className="eyebrow">{contactText.eyebrow}</p>
      <h1>{contactText.title}</h1>
      <p className="page-intro">{contactText.intro}</p>
      <form
        className="simple-form"
        onSubmit={(event) =>
          onSubmit(event, contactText.submitSuccess)
        }
      >
        <input required placeholder={contactText.name} />
        <input required type="email" placeholder={contactText.email} />
        <select defaultValue={contactText.orderQuestion}>
          <option>{contactText.orderQuestion}</option>
          <option>{contactText.productQuestion}</option>
          <option>{contactText.otherQuestion}</option>
        </select>
        <textarea required placeholder={contactText.message} rows={5} />
        <button className="button button-dark full-button">{contactText.submit}</button>
      </form>
      <p className="contact-email">
        {contactText.emailLead} <a href={`mailto:${brandText.supportEmail}`}>{brandText.supportEmail}</a>
      </p>
    </section>
  );
}