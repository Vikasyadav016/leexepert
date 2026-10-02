import type { FormEvent } from "react";
import { AboutPage } from "./customer/AboutPage";
import { AccountPage } from "./customer/AccountPage";
import { ContactPage } from "./customer/ContactPage";
import { PoliciesPage } from "./customer/PoliciesPage";
import { ReturnsPage } from "./customer/ReturnsPage";
import { TrackOrderPage } from "./customer/TrackOrderPage";
import type { Page } from "../types";
import type { AuthProfileInput } from "../../../Services/AuthServices/AuthContext";

type CustomerPagesProps = {
  page: Extract<
    Page,
    | "Account"
    | "Returns"
    | "Track Order"
    | "About Brand"
    | "Contact"
    | "Policies"
  >;
  onNotice: (message: string, options?: { placement?: "top-center" }) => void;
  onAuthenticated: (profile: AuthProfileInput) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>, message: string) => void;
  onShop: () => void;
};

export function CustomerPages({
  page,
  onNotice,
  onAuthenticated,
  onSubmit,
  onShop,
}: CustomerPagesProps) {
  switch (page) {
    case "Account":
      return <AccountPage onNotice={onNotice} onAuthenticated={onAuthenticated} />;
    case "Returns":
      return <ReturnsPage onSubmit={onSubmit} />;
    case "Track Order":
      return <TrackOrderPage onSubmit={onSubmit} />;
    case "About Brand":
      return <AboutPage onShop={onShop} />;
    case "Contact":
      return <ContactPage onSubmit={onSubmit} />;
    case "Policies":
      return <PoliciesPage />;
  }
}