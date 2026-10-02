import { useState } from "react";
import { UserAvatar } from "../components/UserAvatar";
import type { Address, DemoOrder, Page } from "../types";
import type { AuthUser } from "../../../Services/AuthServices/AuthContext";
import profileText from "../../../TextJson/Profile/ProfilePage.json";
import "./ProfilePage.css";

type ProfilePanel = "details" | "address" | "coupons" | "rewards";

type ProfilePageProps = {
  user: AuthUser;
  orders: DemoOrder[];
  address: Address;
  wishlistCount: number;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onNotice: (message: string) => void;
};

export function ProfilePage({ user, orders, address, wishlistCount, onNavigate, onLogout, onNotice }: ProfilePageProps) {
  const [activePanel, setActivePanel] = useState<ProfilePanel | null>(null);
  const rewardPoints = Math.floor(orders.reduce((total, order) => total + order.total, 0));

  return (
    <section className="section-block content-page profile-page">
      <div className="profile-hero">
        <div className="profile-identity">
          <UserAvatar name={user.fullName} imageUrl={user.avatarUrl} size="large" />
          <div>
            <p className="eyebrow">{profileText.eyebrow}</p>
            <h1>{profileText.welcome.replace("{name}", user.fullName.split(" ")[0])}</h1>
            <p>{user.email ?? user.phone ?? profileText.fallbackContact}</p>
          </div>
        </div>
        <span className="profile-member-mark">{profileText.memberMark[0]}<br />{profileText.memberMark[1]}</span>
      </div>

      <div className="profile-section-heading">
        <div><p className="eyebrow">{profileText.yourSpace}</p><h2>{profileText.overview}</h2></div>
        <span>{orders.length} {orders.length === 1 ? profileText.order : profileText.orders} · {wishlistCount} {profileText.saved}</span>
      </div>
      <div className="profile-action-grid">
        <ProfileAction icon="orders" title={profileText.cards.orders.title} description={profileText.cards.orders.description} onClick={() => onNavigate("Orders")} />
        <ProfileAction icon="wishlist" title={profileText.cards.wishlist.title} description={profileText.cards.wishlist.description} onClick={() => onNavigate("Wishlist")} />
        <ProfileAction icon="help" title={profileText.cards.help.title} description={profileText.cards.help.description} onClick={() => onNavigate("Contact")} />
        <ProfileAction icon="coupon" title={profileText.cards.coupons.title} description={profileText.cards.coupons.description} onClick={() => setActivePanel("coupons")} />
        <ProfileAction icon="rewards" title={profileText.cards.rewards.title} description={profileText.cards.rewards.description.replace("{points}", rewardPoints.toLocaleString())} onClick={() => setActivePanel("rewards")} />
      </div>

      <details className="profile-manage" open={activePanel === "details" || activePanel === "address"}>
        <summary><span><strong>{profileText.manage}</strong><small>{profileText.manageDescription}</small></span><span className="profile-manage-mark" aria-hidden="true">+</span></summary>
        <div className="profile-manage-grid">
          <ProfileAction icon="user" title={profileText.cards.details.title} description={profileText.cards.details.description} onClick={() => setActivePanel("details")} selected={activePanel === "details"} />
          <ProfileAction icon="address" title={profileText.cards.address.title} description={profileText.cards.address.description} onClick={() => setActivePanel("address")} selected={activePanel === "address"} />
        </div>
      </details>

      {activePanel && <ProfileDetailPanel panel={activePanel} user={user} address={address} rewardPoints={rewardPoints} onClose={() => setActivePanel(null)} onNotice={onNotice} />}

      <div className="profile-logout-row">
        <div><strong>{profileText.logoutHeadline}</strong><span>{profileText.logoutDescription}</span></div>
        <button className="profile-logout" type="button" onClick={onLogout}><ProfileIcon name="logout" /><span>{profileText.logout}</span></button>
      </div>
    </section>
  );
}

function ProfileAction({ icon, title, description, onClick, selected = false }: {
  icon: "orders" | "wishlist" | "help" | "coupon" | "rewards" | "user" | "address";
  title: string;
  description: string;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button className={`profile-action${selected ? " selected" : ""}`} type="button" onClick={onClick}>
      <span className="profile-action-icon"><ProfileIcon name={icon} /></span>
      <span className="profile-action-copy"><strong>{title}</strong><small>{description}</small></span>
      <span className="profile-action-arrow" aria-hidden="true">↗</span>
    </button>
  );
}

function ProfileDetailPanel({ panel, user, address, rewardPoints, onClose, onNotice }: {
  panel: ProfilePanel;
  user: AuthUser;
  address: Address;
  rewardPoints: number;
  onClose: () => void;
  onNotice: (message: string) => void;
}) {
  return (
    <section className="profile-detail-panel" aria-live="polite">
      <div className="profile-detail-heading"><div><p className="eyebrow">{profileText.manage}</p><h2>{profileText.panels[panel]}</h2></div><button type="button" className="profile-detail-close" onClick={onClose} aria-label={profileText.closeDetails}>×</button></div>
      {panel === "details" && <dl className="profile-detail-list"><div><dt>{profileText.fullName}</dt><dd>{user.fullName}</dd></div><div><dt>{profileText.email}</dt><dd>{user.email ?? profileText.notAdded}</dd></div><div><dt>{profileText.mobile}</dt><dd>{user.phone ?? profileText.notAdded}</dd></div></dl>}
      {panel === "address" && <address className="profile-address"><strong>{address.firstName} {address.lastName}</strong><span>{address.addressLine1}</span>{address.addressLine2 && <span>{address.addressLine2}</span>}<span>{address.city}{address.region ? `, ${address.region}` : ""} {address.postalCode}</span><span>{address.country}</span>{address.phone && <span>{address.phone}</span>}</address>}
      {panel === "coupons" && <div className="profile-coupon"><span className="profile-coupon-label">{profileText.welcomeOffer}</span><strong>{profileText.couponCode}</strong><p>{profileText.couponDescription}</p><button type="button" onClick={() => onNotice(profileText.couponCopied)}>{profileText.copyCode}</button></div>}
      {panel === "rewards" && <div className="profile-rewards"><span className="profile-reward-count">{rewardPoints.toLocaleString()}</span><span className="profile-reward-unit">{profileText.rewardPoints}</span><p>{profileText.rewardsDescription}</p><div className="profile-reward-track"><span style={{ width: `${Math.min((rewardPoints % 500) / 5, 100)}%` }} /></div><small>{profileText.pointsToReward.replace("{points}", String(500 - (rewardPoints % 500)))}</small></div>}
    </section>
  );
}

function ProfileIcon({ name }: { name: "orders" | "wishlist" | "help" | "coupon" | "rewards" | "user" | "address" | "logout" }) {
  const paths = {
    orders: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
    wishlist: <path d="M20.8 8.8c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.4Z" />,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 4.2 1.6c-1.2 1.1-1.9 1.3-1.9 3M12 17h.01" /></>,
    coupon: <><path d="M3 8V5h18v3a2.5 2.5 0 0 0 0 5v6H3v-6a2.5 2.5 0 0 0 0-5Z" /><path d="M13 8v2m0 4v2" /></>,
    rewards: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.1 3.2-4.7 7-4.7s6.2 1.6 7 4.7" /></>,
    address: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}