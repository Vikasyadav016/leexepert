import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./PremiumToast.css";

export type ToastPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "center";

export type ToastNotice = {
  id: number;
  message: string;
  placement: ToastPlacement;
  duration: number;
};

type PremiumToastProps = {
  notice: ToastNotice;
  onDismiss: () => void;
};

export function PremiumToast({ notice, onDismiss }: PremiumToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDismiss, notice.duration);
    return () => window.clearTimeout(timeoutId);
  }, [notice.id, notice.duration, onDismiss]);

  return createPortal(
    <div
      className={`premium-toast premium-toast-${notice.placement}`}
      role="status"
      aria-live="polite"
    >
      <span className="premium-toast-mark" aria-hidden="true">
        ✓
      </span>
      <span className="premium-toast-message">{notice.message}</span>
      <button
        className="premium-toast-dismiss"
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>,
    document.body,
  );
}