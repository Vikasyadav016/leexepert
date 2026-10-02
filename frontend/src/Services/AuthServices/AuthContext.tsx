import { createContext, useContext, useState, type ReactNode } from "react";
import demoUsers from "./demoUsers.json";
import type { CartQuantities, WishlistEvent, WishlistItem } from "../../Features/Storefront/types";

export type AuthUser = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
};

export type AuthProfileInput = Omit<AuthUser, "id">;

export type AuthStoreData = {
  cart: CartQuantities;
  wishlist: { items: WishlistItem[]; events: WishlistEvent[] };
};

type AuthCompletion = {
  user: AuthUser;
  storeData: AuthStoreData;
};

type PersistedSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  authenticate: (profile: AuthProfileInput, guestData: AuthStoreData) => AuthCompletion;
  logout: () => void;
  refreshSession: () => boolean;
};

const SESSION_KEY = "leex-demo-auth-session";
const PROFILE_KEY = "leex-demo-users";
const ACCOUNT_DATA_PREFIX = "leex-demo-account-data:";
const emptyStoreData: AuthStoreData = {
  cart: {},
  wishlist: { items: [], events: [] },
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function readSession(): PersistedSession | null {
  const session = readJson<PersistedSession | null>(SESSION_KEY, null);
  if (session?.user && session.accessToken && session.refreshToken) return session;
  localStorage.removeItem(SESSION_KEY);
  return null;
}

function accountIdFor(profile: AuthProfileInput): string {
  const identity = profile.email?.trim().toLowerCase()
    ?? profile.phone?.replace(/\D/g, "")
    ?? profile.fullName.trim().toLowerCase();
  return `leex-${identity.replace(/[^a-z0-9]/g, "-")}`;
}

function makeToken(kind: "access" | "refresh", userId: string): string {
  return `demo-${kind}.${encodeURIComponent(userId)}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
}

export function readAccountStoreData(userId: string): AuthStoreData {
  return readJson(`${ACCOUNT_DATA_PREFIX}${userId}`, emptyStoreData);
}

export function saveAccountStoreData(userId: string, data: AuthStoreData): void {
  try {
    localStorage.setItem(`${ACCOUNT_DATA_PREFIX}${userId}`, JSON.stringify(data));
  } catch {
    // Storage may be unavailable or full; the in-memory storefront still works.
  }
}

export function getPersistedUserId(): string | null {
  return readSession()?.user.id ?? null;
}

function mergeStoreData(accountData: AuthStoreData, guestData: AuthStoreData): AuthStoreData {
  const cart = { ...accountData.cart };
  for (const [productId, quantity] of Object.entries(guestData.cart)) {
    cart[Number(productId)] = Math.max(cart[Number(productId)] ?? 0, quantity);
  }

  const itemsByProduct = new Map<number, WishlistItem>();
  for (const item of [...accountData.wishlist.items, ...guestData.wishlist.items]) {
    if (!itemsByProduct.has(item.productId)) itemsByProduct.set(item.productId, item);
  }

  const eventsById = new Map<string, WishlistEvent>();
  for (const event of [...accountData.wishlist.events, ...guestData.wishlist.events]) {
    eventsById.set(event.id, event);
  }

  return {
    cart,
    wishlist: {
      items: [...itemsByProduct.values()],
      events: [...eventsById.values()].sort((left, right) => right.occurredAt.localeCompare(left.occurredAt)),
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PersistedSession | null>(readSession);

  function authenticate(profile: AuthProfileInput, guestData: AuthStoreData): AuthCompletion {
    const id = accountIdFor(profile);
    const users = readJson<AuthUser[]>(PROFILE_KEY, demoUsers as AuthUser[]);
    const storedUser = users.find((candidate) => candidate.id === id);
    const user: AuthUser = {
      id,
      fullName: profile.fullName.trim() || storedUser?.fullName || "Leex Customer",
      email: profile.email?.trim().toLowerCase() || storedUser?.email,
      phone: profile.phone?.trim() || storedUser?.phone,
    };
    const nextUsers = [user, ...users.filter((candidate) => candidate.id !== id)];
    const nextSession = {
      user,
      accessToken: makeToken("access", id),
      refreshToken: makeToken("refresh", id),
    };
    const storeData = mergeStoreData(readAccountStoreData(id), guestData);

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(nextUsers));
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } catch {
      // The current session remains available in memory if storage is unavailable.
    }
    saveAccountStoreData(id, storeData);
    setSession(nextSession);
    return { user, storeData };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  function refreshSession(): boolean {
    if (!session?.refreshToken) {
      logout();
      return false;
    }

    const nextSession = {
      ...session,
      accessToken: makeToken("access", session.user.id),
      refreshToken: makeToken("refresh", session.user.id),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return true;
  }

  const value: AuthContextValue = {
    user: session?.user ?? null,
    accessToken: session?.accessToken ?? null,
    refreshToken: session?.refreshToken ?? null,
    isAuthenticated: Boolean(session?.user && session.accessToken && session.refreshToken),
    authenticate,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}