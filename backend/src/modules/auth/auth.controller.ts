import { randomBytes, createHash } from "node:crypto";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authConfig, getAccessTokenSecret } from "../../config/auth.config";
import { AuthSession } from "./auth-session.model";
import { User } from "../users/user.model";

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

function readRefreshToken(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const prefix = `${authConfig.refreshCookieName}=`;
  const entry = cookieHeader.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(prefix));
  if (!entry) return undefined;
  try {
    return decodeURIComponent(entry.slice(prefix.length));
  } catch {
    return undefined;
  }
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(authConfig.refreshCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: authConfig.refreshCookiePath,
    maxAge: authConfig.refreshTokenTtlMs,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(authConfig.refreshCookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: authConfig.refreshCookiePath,
  });
}

function duplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function publicUser(user: {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  status: string;
}) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function signUp(req: Request, res: Response) {
  const body = req.body as Record<string, unknown> | undefined;
  const firstName = readString(body?.firstName);
  const lastName = readString(body?.lastName);
  const email = readString(body?.email)?.toLowerCase();
  const password =
    typeof body?.password === "string" ? body.password : undefined;

  if (
    !firstName ||
    firstName.length > 80 ||
    !lastName ||
    lastName.length > 80
  ) {
    return res
      .status(400)
      .json({
        error:
          "First and last name are required and must be 80 characters or fewer.",
      });
  }
  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res
      .status(400)
      .json({ error: "A valid email address is required." });
  }
  if (
    !password ||
    password.length < authConfig.passwordMinLength ||
    Buffer.byteLength(password, "utf8") > authConfig.passwordMaxBytes
  ) {
    return res
      .status(400)
      .json({
        error: `Password must be at least ${authConfig.passwordMinLength} characters and no more than ${authConfig.passwordMaxBytes} UTF-8 bytes.`,
      });
  }

  if (await User.exists({ email })) {
    return res
      .status(409)
      .json({ error: "An account with this email already exists." });
  }

  try {
    const passwordHash = await bcrypt.hash(password, authConfig.bcryptRounds);
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: "Account created. Verify your email before signing in.",
      user: publicUser(user),
    });
  } catch (error) {
    if (duplicateKeyError(error)) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }
    throw error;
  }
}

export async function signIn(req: Request, res: Response) {
  const body = req.body as Record<string, unknown> | undefined;
  const email = readString(body?.email)?.toLowerCase();
  const password =
    typeof body?.password === "string" ? body.password : undefined;

  if (!email || !password || email.length > 254) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await User.findOne({ email }).select(
    "+passwordHash +failedLoginCount +lockoutUntil",
  );
  if (!user?.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  if (user.lockoutUntil && user.lockoutUntil.getTime() > Date.now()) {
    const retryAfterSeconds = Math.ceil(
      (user.lockoutUntil.getTime() - Date.now()) / 1000,
    );
    res.setHeader("Retry-After", retryAfterSeconds);
    return res
      .status(429)
      .json({ error: "Too many failed attempts. Try again later." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { failedLoginCount: 1 } },
      { new: true },
    ).select("+failedLoginCount");
    if ((updatedUser?.failedLoginCount ?? 0) >= authConfig.maxFailedLogins) {
      await User.updateOne(
        { _id: user._id },
        { $set: { lockoutUntil: new Date(Date.now() + authConfig.lockoutMs) } },
      );
    }
    return res.status(401).json({ error: "Invalid email or password." });
  }

  if (user.status === "pending_verification") {
    return res
      .status(403)
      .json({
        code: "EMAIL_VERIFICATION_REQUIRED",
        error: "Verify your email before signing in.",
      });
  }
  if (user.status !== "active") {
    return res
      .status(403)
      .json({
        code: "ACCOUNT_UNAVAILABLE",
        error: "This account is unavailable.",
      });
  }

  const secret = getAccessTokenSecret();
  if (!secret) {
    return res
      .status(503)
      .json({
        error:
          "Authentication is not configured. Set JWT_ACCESS_SECRET to a secret of at least 32 bytes.",
      });
  }

  const accessToken = jwt.sign({ role: user.role }, secret, {
    subject: user.id,
    issuer: "leex-api",
    audience: "leex-web",
    expiresIn: authConfig.accessTokenTtlSeconds,
  });
  const refreshToken = randomBytes(48).toString("base64url");
  const refreshTokenHash = createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + authConfig.refreshTokenTtlMs);

  await AuthSession.create({
    userId: user._id,
    refreshTokenHash,
    createdFromIp: req.ip,
    userAgent: req.get("user-agent"),
    expiresAt,
  });
  await User.updateOne(
    { _id: user._id },
    {
      $set: { lastLoginAt: new Date(), failedLoginCount: 0 },
      $unset: { lockoutUntil: 1 },
    },
  );

  setRefreshCookie(res, refreshToken);

  return res.status(200).json({
    accessToken,
    tokenType: "Bearer",
    expiresIn: authConfig.accessTokenTtlSeconds,
    user: publicUser(user),
  });
}

export async function refreshSession(req: Request, res: Response) {
  const refreshToken = readRefreshToken(req);
  if (!refreshToken) return res.status(401).json({ error: "A refresh session is required." });

  const secret = getAccessTokenSecret();
  if (!secret) return res.status(503).json({ error: "Authentication is not configured." });

  const refreshTokenHash = createHash("sha256").update(refreshToken).digest("hex");
  const session = await AuthSession.findOne({ refreshTokenHash, revokedAt: null, expiresAt: { $gt: new Date() } }).select("+refreshTokenHash");
  if (!session) {
    clearRefreshCookie(res);
    return res.status(401).json({ error: "The refresh session is invalid or expired." });
  }

  const user = await User.findById(session.userId);
  if (!user || user.status !== "active") {
    session.revokedAt = new Date();
    session.revokeReason = "security";
    await session.save();
    clearRefreshCookie(res);
    return res.status(401).json({ error: "The account is unavailable." });
  }

  const accessToken = jwt.sign({ role: user.role }, secret, {
    subject: user.id,
    issuer: "leex-api",
    audience: "leex-web",
    expiresIn: authConfig.accessTokenTtlSeconds,
  });
  const nextRefreshToken = randomBytes(48).toString("base64url");
  session.refreshTokenHash = createHash("sha256").update(nextRefreshToken).digest("hex");
  session.expiresAt = new Date(Date.now() + authConfig.refreshTokenTtlMs);
  session.lastUsedAt = new Date();
  await session.save();
  setRefreshCookie(res, nextRefreshToken);

  return res.status(200).json({
    accessToken,
    tokenType: "Bearer",
    expiresIn: authConfig.accessTokenTtlSeconds,
    user: publicUser(user),
  });
}

export async function signOut(req: Request, res: Response) {
  const refreshToken = readRefreshToken(req);
  if (refreshToken) {
    const refreshTokenHash = createHash("sha256").update(refreshToken).digest("hex");
    await AuthSession.updateOne(
      { refreshTokenHash, revokedAt: null },
      { $set: { revokedAt: new Date(), revokeReason: "logout" } },
    );
  }
  clearRefreshCookie(res);
  return res.status(204).end();
}

export async function currentUser(req: Request, res: Response) {
  if (!req.auth) return res.status(401).json({ error: "Authentication is required." });
  const user = await User.findById(req.auth.userId);
  if (!user || user.status !== "active") return res.status(401).json({ error: "The account is unavailable." });
  return res.status(200).json({ user: publicUser(user) });
}
