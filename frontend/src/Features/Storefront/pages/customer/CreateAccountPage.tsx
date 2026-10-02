import type { FormEvent } from "react";

type CreateAccountPageProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
  onSignIn: () => void;
};

export function CreateAccountPage({
  onSubmit,
  onSignIn,
}: CreateAccountPageProps) {
  return (
    <>
      <p className="eyebrow">A wardrobe that feels like yours</p>
      <h1>Create your account</h1>
      <form
        className="simple-form account-form"
        onSubmit={(event) =>
          onSubmit(
            event,
            "Account creation is not connected yet. Your details have not been saved.",
          )
        }
      >
        <p>Keep your orders and favorite pieces together in one place.</p>
        <input
          required
          autoComplete="name"
          placeholder="Full name"
        />
        <input
          required
          type="email"
          autoComplete="email"
          placeholder="Email address"
        />
        <input
          required
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Create a password"
        />
        <button className="button button-dark full-button">
          Create account
        </button>
        <button type="button" className="text-link" onClick={onSignIn}>
          Already have an account? Sign in
        </button>
      </form>
    </>
  );
}