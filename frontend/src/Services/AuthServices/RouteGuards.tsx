import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireAuth({ loginRequired = false }: { loginRequired?: boolean }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated) return <Outlet />;
  if (loginRequired) {
    return <Navigate to="/account" state={{ from: location }} replace />;
  }
  return <Navigate to="/" replace />;
}

export function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated
    ? <Navigate to={returnPathFromState(location.state)} replace />
    : <Outlet />;
}

export function returnPathFromState(state: unknown): string {
  if (typeof state !== "object" || state === null || !("from" in state)) return "/";
  const from = state.from;
  if (typeof from !== "object" || from === null || !("pathname" in from)) return "/";

  const pathname = typeof from.pathname === "string" ? from.pathname : "/";
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/";
  const search = "search" in from && typeof from.search === "string" ? from.search : "";
  const hash = "hash" in from && typeof from.hash === "string" ? from.hash : "";
  return `${pathname}${search}${hash}`;
}