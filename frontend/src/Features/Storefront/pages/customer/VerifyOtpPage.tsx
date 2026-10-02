import type { FormEvent } from "react";
import { AccountFieldIcon } from "./AccountFieldIcon";
import "./VerifyOtpPage.css";

type VerifyOtpPageProps = {
  destination: string;
  onBack: () => void;
  onResend: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function VerifyOtpPage({
  destination,
  onBack,
  onResend,
  onSubmit,
}: VerifyOtpPageProps) {
  return (
    <div className="otp-page">
      <div className="account-form-intro">
        <span className="account-form-icon" aria-hidden="true">
          <AccountFieldIcon name="phone" />
        </span>
        <div>
          <h2>Verify your number</h2>
          <p>Enter the 6-digit code sent to {destination}.</p>
        </div>
      </div>
      <form className="account-form" onSubmit={onSubmit}>
        <label className="account-field">
          <span>Verification code</span>
          <span className="account-input-wrap">
            <input
              className="otp-code-input"
              required
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              placeholder="000000"
              aria-describedby="otp-help"
            />
          </span>
        </label>
        <p id="otp-help" className="account-legal">For this demo, enter any six digits.</p>
        <button className="account-submit" type="submit">
          <span>Verify and continue</span><span aria-hidden="true">↗</span>
        </button>
        <button className="otp-resend" type="button" onClick={onResend}>
          Didn’t receive a code? <strong>Resend code</strong>
        </button>
        <button className="account-switch-link" type="button" onClick={onBack}>
          <strong>←</strong> Back to previous step
        </button>
      </form>
    </div>
  );
}