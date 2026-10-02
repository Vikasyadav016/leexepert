import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandLoader } from "../../components/BrandLoader";
import type { AuthProfileInput } from "../../../../Services/AuthServices/AuthContext";
import { AccountFieldIcon } from "./AccountFieldIcon";
import { CreateAccountPage } from "./CreateAccountPage";
import { VerifyOtpPage } from "./VerifyOtpPage";
import accountText from "../../../../TextJson/Auth/AccountPage.json";
import brandText from "../../../../TextJson/Brand.json";
import "./Account.css";

type AccountPageProps = {
  onNotice: (message: string, options?: { placement?: "top-center" }) => void;
  onAuthenticated: (profile: AuthProfileInput) => void;
};

type AccountMethod = "email" | "phone";
type OtpChallenge = { flow: "login" | "signup"; destination: string; profile: AuthProfileInput };

export function AccountPage({ onNotice, onAuthenticated }: AccountPageProps) {
  const [showSignup, setShowSignup] = useState(false);
  const [accountMethod, setAccountMethod] = useState<AccountMethod>("email");
  const [otpChallenge, setOtpChallenge] = useState<OtpChallenge | null>(null);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [pendingForm, setPendingForm] = useState<"login" | "signup" | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>, message: string, form: "login" | "signup", profile: AuthProfileInput) {
    event.preventDefault();
    if (pendingForm) return;

    setPendingForm(form);
    timeoutRef.current = window.setTimeout(() => {
      setPendingForm(null);
      onAuthenticated(profile);
      onNotice(message, { placement: "top-center" });
    }, 3000);
  }

  function requestOtp(event: FormEvent<HTMLFormElement>, destination: string, flow: OtpChallenge["flow"], profile: AuthProfileInput) {
    event.preventDefault();
    setOtpChallenge({ flow, destination, profile });
    onNotice(accountText.otpSent.replace("{destination}", destination), { placement: "top-center" });
  }

  const flipState = otpChallenge
    ? showSignup ? "is-signup-otp" : "is-login-otp"
    : showSignup ? "is-signup" : "";

  return (
    <section className="account-access-page">
      <aside className="account-brand-panel">
        <div className="account-brand-topline">
          <span className="account-brand-mark" aria-hidden="true">{brandText.name.slice(0, 1)}</span>
          <span>{brandText.name} / STUDIO</span>
        </div>
        <div className="account-brand-copy">
          <p className="account-kicker">{accountText.brandEyebrow}</p>
          <h1>{accountText.brandHeadline[0]}<br />{accountText.brandHeadline[1]}</h1>
          <p>{accountText.brandDescription}</p>
        </div>
        <div className="account-brand-bottom">
          <span>{accountText.brandFooter}</span>
          <span>01 — 03</span>
        </div>
      </aside>

      <div className="account-form-panel">
        <div className="account-panel-heading">
          <p className="account-kicker">{accountText.accountLabel.replace("Leex", brandText.name)}</p>
          <div className="account-mode-switch" role="group" aria-label={accountText.accountModeLabel}>
            <button
              type="button"
              className={!showSignup ? "selected" : ""}
              aria-pressed={!showSignup}
              onClick={() => { setOtpChallenge(null); setShowSignup(false); }}
            >
              {accountText.signinTab}
            </button>
            <button
              type="button"
              className={showSignup ? "selected" : ""}
              aria-pressed={showSignup}
              onClick={() => { setOtpChallenge(null); setShowSignup(true); }}
            >
              {accountText.signupTab}
            </button>
          </div>
        </div>
        {!otpChallenge && (
          <div className="account-method-switch" role="group" aria-label={accountText.methodLabel}>
            <button type="button" className={accountMethod === "email" ? "selected" : ""} aria-pressed={accountMethod === "email"} onClick={() => { setOtpChallenge(null); setAccountMethod("email"); }}>
              <AccountFieldIcon name="mail" /> {accountText.emailMethod}
            </button>
            <button type="button" className={accountMethod === "phone" ? "selected" : ""} aria-pressed={accountMethod === "phone"} onClick={() => { setOtpChallenge(null); setAccountMethod("phone"); }}>
              <AccountFieldIcon name="phone" /> {accountText.phoneMethod}
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
                    <h2>{accountText.welcome}</h2>
                    <p>{accountText.welcomeDescription}</p>
                  </div>
                </div>
                {accountMethod === "email" ? (
                  <form className="account-form" onSubmit={(event) => handleSubmit(event, accountText.demoSigninSuccess, "login", { fullName: "", email: loginEmail })}>
                    <label className="account-field">
                      <span>{accountText.emailLabel}</span>
                      <span className="account-input-wrap"><AccountFieldIcon name="mail" /><input required type="email" autoComplete="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder={accountText.emailPlaceholder} /></span>
                    </label>
                    <label className="account-field">
                      <span>{accountText.passwordLabel}</span>
                      <span className="account-input-wrap"><AccountFieldIcon name="lock" /><input required type="password" autoComplete="current-password" placeholder={accountText.passwordPlaceholder} /></span>
                    </label>
                    <button className="account-submit" type="submit" disabled={pendingForm !== null}>{pendingForm === "login" ? <BrandLoader fullScreen={false} label={accountText.loaderSignin} /> : <><span>{accountText.signinAction}</span><span aria-hidden="true">↗</span></>}</button>
                    <p className="account-legal">{accountText.termsLead} <a href="/policies">{accountText.terms}</a> and <a href="/policies">{accountText.privacy}</a>.</p>
                  </form>
                ) : (
                  <form className="account-form" onSubmit={(event) => requestOtp(event, loginPhone, "login", { fullName: "", phone: loginPhone })}>
                    <label className="account-field">
                      <span>{accountText.phoneLabel}</span>
                      <span className="account-input-wrap"><AccountFieldIcon name="phone" /><input required type="tel" autoComplete="tel" value={loginPhone} onChange={(event) => setLoginPhone(event.target.value)} placeholder={accountText.phonePlaceholder} /></span>
                    </label>
                    <button className="account-submit" type="submit"><span>{accountText.otpAction}</span><span aria-hidden="true">↗</span></button>
                    <p className="account-legal">{accountText.phoneDescription}</p>
                  </form>
                )}
              </fieldset>
            </div>
            <div className="account-flip-face account-flip-signup" aria-hidden={!showSignup || Boolean(otpChallenge)}>
              <fieldset className="account-face-fieldset" disabled={!showSignup || Boolean(otpChallenge) || pendingForm !== null}>
                <CreateAccountPage
                  method={accountMethod}
                  isSubmitting={pendingForm === "signup"}
                  onSubmit={(event, message, profile) => handleSubmit(event, message, "signup", profile)}
                  onRequestOtp={(event, destination, fullName) => requestOtp(event, destination, "signup", { fullName, phone: destination })}
                  onSignIn={() => setShowSignup(false)}
                />
              </fieldset>
            </div>
            <div className="account-flip-face account-flip-otp" aria-hidden={!otpChallenge}>
              <fieldset className="account-face-fieldset" disabled={!otpChallenge || pendingForm !== null}>
                {otpChallenge && (
                  <VerifyOtpPage
                    destination={otpChallenge.destination}
                    isSubmitting={pendingForm === otpChallenge.flow}
                    onBack={() => setOtpChallenge(null)}
                    onResend={() => onNotice(accountText.otpResent.replace("{destination}", otpChallenge.destination), { placement: "top-center" })}
                    onSubmit={(event) => handleSubmit(event, otpChallenge.flow === "signup" ? accountText.demoPhoneSignupSuccess : accountText.demoPhoneSigninSuccess, otpChallenge.flow, otpChallenge.profile)}
                  />
                )}
              </fieldset>
            </div>
          </div>
        </div>
        <p className="account-support">{accountText.supportLead} <a href={`mailto:${brandText.supportEmail}`}>{accountText.supportLink}</a></p>
      </div>
    </section>
  );
}
