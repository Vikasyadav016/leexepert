import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandLoader } from "../../components/BrandLoader";
import { AccountFieldIcon } from "./AccountFieldIcon";
import { CreateAccountPage } from "./CreateAccountPage";
import { VerifyOtpPage } from "./VerifyOtpPage";
import "./Account.css";

type AccountPageProps = {
  onNotice: (message: string, options?: { placement?: "top-center" }) => void;
};

type AccountMethod = "email" | "phone";
type OtpChallenge = { flow: "login" | "signup"; destination: string };

export function AccountPage({ onNotice }: AccountPageProps) {
  const [showSignup, setShowSignup] = useState(false);
  const [accountMethod, setAccountMethod] = useState<AccountMethod>("email");
  const [otpChallenge, setOtpChallenge] = useState<OtpChallenge | null>(null);
  const [loginPhone, setLoginPhone] = useState("");
  const [pendingForm, setPendingForm] = useState<"login" | "signup" | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>, message: string, form: "login" | "signup") {
    event.preventDefault();
    if (pendingForm) return;

    setPendingForm(form);
    timeoutRef.current = window.setTimeout(() => {
      setPendingForm(null);
      onNotice(message, { placement: "top-center" });
    }, 3000);
  }

  function requestOtp(event: FormEvent<HTMLFormElement>, destination: string, flow: OtpChallenge["flow"]) {
    event.preventDefault();
    setOtpChallenge({ flow, destination });
    onNotice(`Demo verification code sent to ${destination}.`, { placement: "top-center" });
  }

  const flipState = otpChallenge
    ? showSignup ? "is-signup-otp" : "is-login-otp"
    : showSignup ? "is-signup" : "";

  return (
    <section className="account-access-page">
      {pendingForm && <BrandLoader fullScreen />}
      <aside className="account-brand-panel">
        <div className="account-brand-topline">
          <span className="account-brand-mark" aria-hidden="true">L</span>
          <span>LEEX / STUDIO</span>
        </div>
        <div className="account-brand-copy">
          <p className="account-kicker">A more considered wardrobe</p>
          <h1>Make room<br />for what lasts.</h1>
          <p>Thoughtful linen. Pieces to keep close. A little more ease in every day.</p>
        </div>
        <div className="account-brand-bottom">
          <span>Designed for living, not just looking.</span>
          <span>01 — 03</span>
        </div>
      </aside>

      <div className="account-form-panel">
        <div className="account-panel-heading">
          <p className="account-kicker">Your Leex account</p>
          <div className="account-mode-switch" role="group" aria-label="Account access mode">
            <button
              type="button"
              className={!showSignup ? "selected" : ""}
              aria-pressed={!showSignup}
              onClick={() => { setOtpChallenge(null); setShowSignup(false); }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={showSignup ? "selected" : ""}
              aria-pressed={showSignup}
              onClick={() => { setOtpChallenge(null); setShowSignup(true); }}
            >
              Create account
            </button>
          </div>
        </div>
        {!otpChallenge && (
          <div className="account-method-switch" role="group" aria-label="Choose sign-in method">
            <button type="button" className={accountMethod === "email" ? "selected" : ""} aria-pressed={accountMethod === "email"} onClick={() => { setOtpChallenge(null); setAccountMethod("email"); }}>
              <AccountFieldIcon name="mail" /> Email
            </button>
            <button type="button" className={accountMethod === "phone" ? "selected" : ""} aria-pressed={accountMethod === "phone"} onClick={() => { setOtpChallenge(null); setAccountMethod("phone"); }}>
              <AccountFieldIcon name="phone" /> Mobile
            </button>
          </div>
        )}
        <div className={`account-flip ${flipState}`}>
          <div className="account-flip-inner">
            <div className="account-flip-face account-flip-login" aria-hidden={showSignup || Boolean(otpChallenge)}>
              <fieldset className="account-face-fieldset" disabled={showSignup || Boolean(otpChallenge) || pendingForm !== null}>
                <div className="account-form-intro">
                  <span className="account-form-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M20 21v-1.5a4.5 4.5 0 0 0-4.5-4.5h-7A4.5 4.5 0 0 0 4 19.5V21M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>
                  </span>
                  <div>
                    <h2>Welcome back</h2>
                    <p>Sign in to pick up where you left off.</p>
                  </div>
                </div>
                {accountMethod === "email" ? (
                  <form className="account-form" onSubmit={(event) => handleSubmit(event, "Demo sign-in complete. Authentication is not connected yet.", "login")}>
                    <label className="account-field">
                      <span>Email address</span>
                      <span className="account-input-wrap"><AccountFieldIcon name="mail" /><input required type="email" autoComplete="email" placeholder="you@example.com" /></span>
                    </label>
                    <label className="account-field">
                      <span>Password</span>
                      <span className="account-input-wrap"><AccountFieldIcon name="lock" /><input required type="password" autoComplete="current-password" placeholder="Enter your password" /></span>
                    </label>
                    <button className="account-submit" type="submit"><span>Sign in</span><span aria-hidden="true">↗</span></button>
                    <p className="account-legal">By continuing, you agree to our <a href="/policies">Terms</a> and <a href="/policies">Privacy Policy</a>.</p>
                  </form>
                ) : (
                  <form className="account-form" onSubmit={(event) => requestOtp(event, loginPhone, "login")}>
                    <label className="account-field">
                      <span>Mobile number</span>
                      <span className="account-input-wrap"><AccountFieldIcon name="phone" /><input required type="tel" autoComplete="tel" value={loginPhone} onChange={(event) => setLoginPhone(event.target.value)} placeholder="+1 555 0123" /></span>
                    </label>
                    <button className="account-submit" type="submit"><span>Send verification code</span><span aria-hidden="true">↗</span></button>
                    <p className="account-legal">We’ll send a one-time code to verify your mobile number. No password needed.</p>
                  </form>
                )}
              </fieldset>
            </div>
            <div className="account-flip-face account-flip-signup" aria-hidden={!showSignup || Boolean(otpChallenge)}>
              <fieldset className="account-face-fieldset" disabled={!showSignup || Boolean(otpChallenge) || pendingForm !== null}>
                <CreateAccountPage
                  method={accountMethod}
                  onSubmit={(event, message) => handleSubmit(event, message, "signup")}
                  onRequestOtp={(event, destination) => requestOtp(event, destination, "signup")}
                  onSignIn={() => setShowSignup(false)}
                />
              </fieldset>
            </div>
            <div className="account-flip-face account-flip-otp" aria-hidden={!otpChallenge}>
              <fieldset className="account-face-fieldset" disabled={!otpChallenge || pendingForm !== null}>
                {otpChallenge && (
                  <VerifyOtpPage
                    destination={otpChallenge.destination}
                    onBack={() => setOtpChallenge(null)}
                    onResend={() => onNotice(`A new demo verification code was sent to ${otpChallenge.destination}.`, { placement: "top-center" })}
                    onSubmit={(event) => handleSubmit(event, otpChallenge.flow === "signup" ? "Demo phone verification complete. Account creation is not connected yet." : "Demo phone sign-in complete. Authentication is not connected yet.", otpChallenge.flow)}
                  />
                )}
              </fieldset>
            </div>
          </div>
        </div>
        <p className="account-support">Need a hand? <a href="mailto:hello@leex.com">We’re here for you.</a></p>
      </div>
    </section>
  );
}
