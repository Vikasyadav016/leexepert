import { createPortal } from "react-dom";
import brandText from "../../TextJson/Brand.json";
import "./BrandLoader.css";

type BrandLoaderProps = {
  fullScreen?: boolean;
  brandName?: string;
  label?: string;
};

export function BrandLoader({
  fullScreen = true,
  brandName = brandText.name,
  label = brandText.loadingLabel,
}: BrandLoaderProps) {
  const content = (
    <>
      <span className="brand-loader-spinner" aria-hidden="true">
        <span className="brand-loader-name">{brandName}</span>
      </span>
      <span className="brand-loader-label">{label}</span>
    </>
  );

  if (fullScreen) {
    return createPortal(
      <div className="brand-loader brand-loader-fullscreen" role="status" aria-label={`${label} ${brandName}`}>
        {content}
      </div>,
      document.body,
    );
  }

  return <span className="brand-loader brand-loader-inline" role="status" aria-label={`${label} ${brandName}`}>{content}</span>;
}