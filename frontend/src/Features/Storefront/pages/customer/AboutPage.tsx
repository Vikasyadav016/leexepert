import "./AboutPage.css";

type AboutPageProps = {
  onShop: () => void;
};

export function AboutPage({ onShop }: AboutPageProps) {
  return (
    <section className="section-block content-page editorial-page">
      <p className="eyebrow">A considered wardrobe</p>
      <h1>Less, but lived in.</h1>
      <p className="editorial-lead">
        Leex began with a simple thought: the things we wear every day should
        feel a little more like ourselves.
      </p>
      <div
        className="editorial-image"
        role="img"
        aria-label="Timeless natural fabric and clothing"
      />
      <p className="page-intro">
        We make small collections of lasting essentials in natural linen. We
        choose fabrics for how they feel, work with makers who care about their
        craft, and design for real life: creases, sunlight, long lunches and
        all.
      </p>
      <button className="button button-dark" onClick={onShop}>
        Meet the collection <span>↗</span>
      </button>
    </section>
  );
}