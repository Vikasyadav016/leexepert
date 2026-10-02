import { useEffect, useRef, useState, type FormEvent } from "react";
import { BrandLoader } from "../../components/BrandLoader";
import { CreateAccountPage } from "./CreateAccountPage";

type AccountPageProps = {
  onNotice: (message: string, options?: { placement?: "top-center" }) => void;
};

export function AccountPage({ onNotice }: AccountPageProps) {
  const [showSignup, setShowSignup] = useState(false);
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

  return (
    <section className="section-block content-page account-access-page">
      {pendingForm && <BrandLoader fullScreen />}
      <div className={`account-flip${showSignup ? " is-signup" : ""}`}>
        <div className="account-flip-inner">
          <div
            className="account-flip-face account-flip-login"
            aria-hidden={showSignup}
          >
            <fieldset className="account-face-fieldset" disabled={showSignup || pendingForm !== null}>
              <p className="eyebrow">Welcome back</p>
              <h1>Your account</h1>
              <form
                className="simple-form account-form"
                onSubmit={(event) =>
                  handleSubmit(
                    event,
                    "Demo sign-in complete. Authentication is not connected yet.",
                    "login",
                  )
                }
              >
                <p>
                  Sign in to see your orders, save your favorites and make
                  checkout a little easier.
                </p>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                />
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                />
                <button className="button button-dark full-button">
                  Sign in
                </button>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setShowSignup(true)}
                >
                  Create an account <span>↗</span>
                </button>
              </form>
            </fieldset>
          </div>
          <div
            className="account-flip-face account-flip-signup"
            aria-hidden={!showSignup}
          >
            <fieldset
              className="account-face-fieldset"
              disabled={!showSignup || pendingForm !== null}
            >
              <CreateAccountPage
                onSubmit={(event, message) => handleSubmit(event, message, "signup")}
                onSignIn={() => setShowSignup(false)}
              />
            </fieldset>
          </div>
        </div>
      </div>
    </section>
  );
}