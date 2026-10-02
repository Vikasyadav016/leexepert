import type { FormEvent } from "react";
import { AccountFieldIcon } from "./AccountFieldIcon";
import { BrandLoader } from "../../components/BrandLoader";
import otpText from "../../../../TextJson/Auth/VerifyOtpPage.json";
import "./VerifyOtpPage.css";

type VerifyOtpPageProps = {
  destination: string;
  isSubmitting: boolean;
  onBack: () => void;
  onResend: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function VerifyOtpPage({
  destination,
  isSubmitting,
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
          <h2>{otpText.title}</h2>
          <p>{otpText.description.replace("{destination}", destination)}</p>
        </div>
      </div>
      <form className="account-form" onSubmit={onSubmit}>
        <label className="account-field">
          <span>{otpText.code}</span>
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
              placeholder={otpText.placeholder}
              aria-describedby="otp-help"
            />
          </span>
        </label>
        <p id="otp-help" className="account-legal">{otpText.demoHint}</p>
        <button className="account-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <BrandLoader fullScreen={false} label={otpText.loaderVerify} /> : <><span>{otpText.submit}</span><span aria-hidden="true">↗</span></>}
        </button>
        <button className="otp-resend" type="button" onClick={onResend}>
          {otpText.resendPrompt} <strong>{otpText.resend}</strong>
        </button>
        <button className="account-switch-link" type="button" onClick={onBack}>
          <strong>←</strong> {otpText.back}
        </button>
      </form>
    </div>
  );
}