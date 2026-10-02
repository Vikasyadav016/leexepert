import "./PoliciesPage.css";
import policyText from "../../../../TextJson/Customer/PoliciesPage.json";

export function PoliciesPage() {
  return (
    <section className="section-block content-page narrow-page policy-page">
      <p className="eyebrow">{policyText.eyebrow}</p>
      <h1>{policyText.title}</h1>
      <details open>
        <summary>{policyText.shippingTitle}</summary>
        <p>{policyText.shippingBody}</p>
      </details>
      <details>
        <summary>{policyText.returnsTitle}</summary>
        <p>{policyText.returnsBody}</p>
      </details>
      <details>
        <summary>{policyText.careTitle}</summary>
        <p>{policyText.careBody}</p>
      </details>
      <details>
        <summary>{policyText.privacyTitle}</summary>
        <p>{policyText.privacyBody}</p>
      </details>
    </section>
  );
}