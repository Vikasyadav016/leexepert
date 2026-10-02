import type { FormEvent } from "react";
import returnsText from "../../../../TextJson/Customer/ReturnsPage.json";

type ReturnsPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
};

export function ReturnsPage({ onSubmit }: ReturnsPageProps) {
  return (
    <section className="section-block content-page narrow-page">
      <p className="eyebrow">{returnsText.eyebrow}</p>
      <h1>{returnsText.title}</h1>
      <p className="page-intro">{returnsText.intro}</p>
      <form
        className="simple-form"
        onSubmit={(event) =>
          onSubmit(
            event,
            returnsText.success,
          )
        }
      >
        <input required placeholder={returnsText.orderNumber} />
        <input required type="email" placeholder={returnsText.checkoutEmail} />
        <select required defaultValue="">
          <option value="" disabled>
            {returnsText.reasonPlaceholder}
          </option>
          <option>{returnsText.fit}</option>
          <option>{returnsText.changedMind}</option>
          <option>{returnsText.other}</option>
        </select>
        <button className="button button-dark full-button">
          {returnsText.submit}
        </button>
      </form>
    </section>
  );
}