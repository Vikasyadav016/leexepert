import { createPortal } from "react-dom";
import "./BrandLoader.css";

type BrandLoaderProps = {
  fullScreen?: boolean;
  brandName?: string;
};

export function BrandLoader({
  fullScreen = true,
  brandName = "LEEX",
}: BrandLoaderProps) {
  const loader = (
    <div
      className={`brand-loader${fullScreen ? " brand-loader-fullscreen" : ""}`}
      role="status"
      aria-label={`Loading ${brandName}`}
    >
      <span className="brand-loader-spinner" aria-hidden="true">
        <span className="brand-loader-name">{brandName}</span>
      </span>
      <span className="brand-loader-label">Please wait</span>
    </div>
  );

  return fullScreen ? createPortal(loader, document.body) : loader;
}