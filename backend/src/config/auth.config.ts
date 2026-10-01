import 'dotenv/config'

function readInteger(name: string, fallback: number, minimum: number, maximum: number): number {
  const rawValue = process.env[name]?.trim()
  if (!rawValue) return fallback

  const value = Number(rawValue)
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer between ${minimum} and ${maximum}.`)
  }

  return value
}

export const authConfig = Object.freeze({
  passwordMinLength: readInteger('AUTH_PASSWORD_MIN_LENGTH', 12, 8, 64),
  passwordMaxBytes: readInteger('AUTH_PASSWORD_MAX_BYTES', 72, 32, 72),
  bcryptRounds: readInteger('AUTH_BCRYPT_ROUNDS', 12, 10, 14),
  accessTokenTtlSeconds: readInteger('AUTH_ACCESS_TOKEN_TTL_SECONDS', 900, 60, 3600),
  refreshTokenTtlMs: readInteger('AUTH_REFRESH_TOKEN_TTL_DAYS', 30, 1, 90) * 24 * 60 * 60 * 1000,
  maxFailedLogins: readInteger('AUTH_MAX_FAILED_LOGINS', 5, 3, 20),
  lockoutMs: readInteger('AUTH_LOCKOUT_MINUTES', 15, 1, 1440) * 60 * 1000,
  signInRateLimitWindowMs: readInteger('AUTH_SIGNIN_RATE_LIMIT_WINDOW_MINUTES', 15, 1, 1440) * 60 * 1000,
  signInRateLimitMax: readInteger('AUTH_SIGNIN_RATE_LIMIT_MAX', 10, 1, 100),
  signUpRateLimitWindowMs: readInteger('AUTH_SIGNUP_RATE_LIMIT_WINDOW_MINUTES', 60, 1, 1440) * 60 * 1000,
  signUpRateLimitMax: readInteger('AUTH_SIGNUP_RATE_LIMIT_MAX', 5, 1, 100),
  refreshCookieName: process.env.AUTH_REFRESH_COOKIE_NAME?.trim() || 'refreshToken',
  refreshCookiePath: process.env.AUTH_REFRESH_COOKIE_PATH?.trim() || '/api/auth',
})

export function getAccessTokenSecret(): string | undefined {
  const secret = process.env.JWT_ACCESS_SECRET?.trim()
  return secret && Buffer.byteLength(secret, 'utf8') >= 32 ? secret : undefined
}