import "./UserAvatar.css";

type UserAvatarProps = {
  name: string;
  imageUrl?: string;
  size?: "small" | "large";
};

export function UserAvatar({ name, imageUrl, size = "small" }: UserAvatarProps) {
  return (
    <span className={`user-avatar user-avatar-${size}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={`${name}'s profile`} />
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.8-3.1 3.2-4.7 7-4.7s6.2 1.6 7 4.7" />
        </svg>
      )}
    </span>
  );
}