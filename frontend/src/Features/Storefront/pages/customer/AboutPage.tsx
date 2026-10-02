import "./AboutPage.css";
import aboutText from "../../../../TextJson/Customer/AboutPage.json";

type AboutPageProps = {
  onShop: () => void;
};

export function AboutPage({ onShop }: AboutPageProps) {
  return (
    <section className="section-block content-page editorial-page">
      <p className="eyebrow">{aboutText.eyebrow}</p>
      <h1>{aboutText.title}</h1>
      <p className="editorial-lead">{aboutText.lead}</p>
      <div
        className="editorial-image"
        role="img"
        aria-label={aboutText.imageAlt}
      />
      <p className="page-intro">{aboutText.body}</p>
      <button className="button button-dark" onClick={onShop}>
        {aboutText.shop} <span>↗</span>
      </button>
    </section>
  );
}