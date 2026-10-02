import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { getAccessTokenSecret } from '../config/auth.config'
import { setExecutionActor } from './execution-logger.middleware'

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.get('authorization')
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1]
  if (!token) return res.status(401).json({ error: 'A bearer access token is required.' })

  const secret = getAccessTokenSecret()
  if (!secret) return res.status(503).json({ error: 'Authentication is not configured.' })

  try {
    const payload = jwt.verify(token, secret, { issuer: 'leex-api', audience: 'leex-web' })
    if (typeof payload === 'string' || typeof payload.sub !== 'string' || typeof payload.role !== 'string') {
      return res.status(401).json({ error: 'Invalid access token.' })
    }

    req.auth = { userId: payload.sub, role: payload.role }
    setExecutionActor(payload.sub)
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token.' })
  }
}

export function requireRoles(...roles: string[]): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: 'Authentication is required.' })
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: 'You do not have permission to access this resource.' })
    return next()
  }
}