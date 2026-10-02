import { useState, type FormEvent } from "react";
import { AccountFieldIcon } from "./AccountFieldIcon";

type CreateAccountPageProps = {
  method: "email" | "phone";
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
  onRequestOtp: (event: FormEvent<HTMLFormElement>, destination: string) => void;
  onSignIn: () => void;
};

export function CreateAccountPage({
  method,
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
          <h2>Create your account</h2>
          <p>Join us for thoughtful pieces and considered care.</p>
        </div>
      </div>
      <form
        className="account-form"
        onSubmit={(event) => method === "phone"
          ? onRequestOtp(event, phone)
          : onSubmit(
            event,
            "Demo sign-up complete. Account creation is not connected yet, so no details were saved.",
          )
        }
      >
        <label className="account-field">
          <span>Full name</span>
          <span className="account-input-wrap">
            <AccountFieldIcon name="user" />
            <input required autoComplete="name" placeholder="Your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </span>
        </label>
        {method === "email" ? (
        <label className="account-field">
          <span>Email address</span>
          <span className="account-input-wrap">
            <AccountFieldIcon name="mail" />
            <input required type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </span>
        </label>
        ) : (
          <label className="account-field">
          <span>Mobile number</span>
          <span className="account-input-wrap">
            <AccountFieldIcon name="phone" />
            <input required type="tel" autoComplete="tel" placeholder="+1 555 0123" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </span>
        </label>
        )}
        {method === "email" && (
          <label className="account-field">
            <span>Password</span>
            <span className="account-input-wrap">
              <AccountFieldIcon name="lock" />
              <input required type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" />
            </span>
          </label>
        )}
        <button className="account-submit" type="submit">
          <span>{method === "phone" ? "Continue with mobile" : "Create account"}</span><span aria-hidden="true">↗</span>
        </button>
        <p className="account-legal">{method === "phone" ? "We’ll verify your mobile number with a one-time code." : <>By creating an account, you agree to our <a href="/policies">Terms</a> and <a href="/policies">Privacy Policy</a>.</>}</p>
        <button type="button" className="account-switch-link" onClick={onSignIn}>
          Already have an account? <strong>Sign in</strong>
        </button>
      </form>
    </div>
  );
}
