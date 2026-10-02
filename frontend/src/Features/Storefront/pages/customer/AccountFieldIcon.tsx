type AccountFieldIconProps = {
  name: "identity" | "mail" | "phone" | "user" | "lock";
};

const paths = {
  identity: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.1 3.2-4.7 7-4.7s6.2 1.6 7 4.7" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M11 18.5h2" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.1 3.2-4.7 7-4.7s6.2 1.6 7 4.7" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>,
};

export function AccountFieldIcon({ name }: AccountFieldIconProps) {
  return <svg className="account-field-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}