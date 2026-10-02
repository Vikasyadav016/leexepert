import { useState, type FormEvent } from "react";
import { CreateAccountPage } from "./CreateAccountPage";

type AccountPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
};

export function AccountPage({ onSubmit }: AccountPageProps) {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <section className="section-block content-page account-access-page">
      <div className={`account-flip${showSignup ? " is-signup" : ""}`}>
        <div className="account-flip-inner">
          <div
            className="account-flip-face account-flip-login"
            aria-hidden={showSignup}
          >
            <fieldset
              className="account-face-fieldset"
              disabled={showSignup}
            >
              <p className="eyebrow">Welcome back</p>
              <h1>Your account</h1>
              <form
                className="simple-form account-form"
                onSubmit={(event) =>
                  onSubmit(
                    event,
                    "Sign-in is not connected yet. Your account service will be available soon.",
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
              disabled={!showSignup}
            >
              <CreateAccountPage
                onSubmit={onSubmit}
                onSignIn={() => setShowSignup(false)}
              />
            </fieldset>
          </div>
        </div>
      </div>
    </section>
  );
}