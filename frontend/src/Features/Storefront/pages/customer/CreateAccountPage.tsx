import { useState, type FormEvent } from "react";
import type { AuthProfileInput } from "../../../../Services/AuthServices/AuthContext";
import { AccountFieldIcon } from "./AccountFieldIcon";
import { BrandLoader } from "../../components/BrandLoader";
import signupText from "../../../../TextJson/Auth/CreateAccountPage.json";

type CreateAccountPageProps = {
  method: "email" | "phone";
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string, profile: AuthProfileInput) => void;
  onRequestOtp: (event: FormEvent<HTMLFormElement>, destination: string, fullName: string) => void;
  onSignIn: () => void;
};

export function CreateAccountPage({
  method,
  isSubmitting,
  onSubmit,
  onRequestOtp,
  onSignIn,
}: CreateAccountPageProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");

  return (
    <div className="signup-face-content">
      <div className="account-form-intro">
        <span className="account-form-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5h-7A4.5 4.5 0 0 0 0 19.5V21m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm11-5v6m-3-3h6" transform="translate(2 0)" /></svg>
        </span>
        <div>
          <h2>{signupText.title}</h2>
          <p>{signupText.description}</p>
        </div>
      </div>
      <form
        className="account-form"
        onSubmit={(event) => method === "phone"
          ? onRequestOtp(event, phone, fullName)
          : onSubmit(
            event,
            signupText.demoSuccess,
            { fullName, email },
          )
        }
      >
        <label className="account-field">
          <span>{signupText.fullName}</span>
          <span className="account-input-wrap">
            <AccountFieldIcon name="user" />
            <input required autoComplete="name" placeholder={signupText.fullNamePlaceholder} value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </span>
        </label>
        {method === "email" ? (
        <label className="account-field">
          <span>{signupText.email}</span>
          <span className="account-input-wrap">
            <AccountFieldIcon name="mail" />
            <input required type="email" autoComplete="email" placeholder={signupText.emailPlaceholder} value={email} onChange={(event) => setEmail(event.target.value)} />
          </span>
        </label>
        ) : (
          <label className="account-field">
          <span>{signupText.phone}</span>
          <span className="account-input-wrap">
            <AccountFieldIcon name="phone" />
            <input required type="tel" autoComplete="tel" placeholder={signupText.phonePlaceholder} value={phone} onChange={(event) => setPhone(event.target.value)} />
          </span>
        </label>
        )}
        {method === "email" && (
          <label className="account-field">
            <span>{signupText.password}</span>
            <span className="account-input-wrap">
              <AccountFieldIcon name="lock" />
              <input required type="password" autoComplete="new-password" minLength={8} placeholder={signupText.passwordPlaceholder} />
            </span>
          </label>
        )}
        <button className="account-submit" type="submit">
          {isSubmitting ? <BrandLoader fullScreen={false} label={signupText.loaderSignup} /> : <><span>{method === "phone" ? signupText.continuePhone : signupText.signup}</span><span aria-hidden="true">↗</span></>}
        </button>
        <p className="account-legal">{method === "phone" ? signupText.phoneHint : <>{signupText.termsLead} <a href="/policies">{signupText.terms}</a> and <a href="/policies">{signupText.privacy}</a>.</>}</p>
        <button type="button" className="account-switch-link" onClick={onSignIn}>
          {signupText.signinPrompt} <strong>{signupText.signin}</strong>
        </button>
      </form>
    </div>
  );
}
