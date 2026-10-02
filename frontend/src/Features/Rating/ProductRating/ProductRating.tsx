import ratingText from "../../../TextJson/Rating/ProductRating.json";
import "./ProductRating.css";

type ProductRatingProps = {
  value?: number;
  onChange?: (rating: number) => void;
  label?: string;
};

export function ProductRating({ value = 0, onChange, label }: ProductRatingProps) {
  return (
    <div className="product-rating" role="group" aria-label={label ?? "Product rating"}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={`rating-star${rating <= value ? " is-active" : ""}`}
          aria-label={ratingText.ariaLabel.replace("{rating}", String(rating))}
          aria-pressed={value === rating}
          onClick={() => onChange?.(rating)}
          disabled={!onChange}
        >
          ★
        </button>
      ))}
      {value > 0 && <span className="rating-value">{ratingText.displayLabel.replace("{rating}", String(value))}</span>}
    </div>
  );
}