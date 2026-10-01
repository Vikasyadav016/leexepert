import { rateLimit } from 'express-rate-limit'
import { authConfig } from '../config/auth.config'

export const signInRateLimiter = rateLimit({
  windowMs: authConfig.signInRateLimitWindowMs,
  limit: authConfig.signInRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Try again later.' },
})

export const signUpRateLimiter = rateLimit({
  windowMs: authConfig.signUpRateLimitWindowMs,
  limit: authConfig.signUpRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many signup attempts. Try again later.' },
})