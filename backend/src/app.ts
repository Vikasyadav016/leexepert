import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import mongoose from 'mongoose'
import { env } from './config/env'
import { logUnhandledRequestError, requestContextMiddleware, withControllerLogging } from './middleware/execution-logger.middleware'
import { apiRouter } from './routes/api.routes'

const app = express()
const allowedOrigins = new Set(env.corsOrigins)

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin))
  },
  credentials: true,
  exposedHeaders: ['X-Request-Id'],
}))
app.use(requestContextMiddleware)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '1mb' }))

app.get('/health', withControllerLogging('system', 'health', (_request, response) => {
  const connected = mongoose.connection.readyState === 1
  return response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  })
}))

app.use('/api', apiRouter)
app.use((_request, response) => response.status(404).json({ error: 'Route not found.' }))

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const statusCode = typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
    ? error.status
    : 500
  const safeStatusCode = statusCode >= 400 && statusCode <= 599 ? statusCode : 500
  const message = safeStatusCode >= 500 && env.nodeEnv === 'production'
    ? 'Internal server error.'
    : error instanceof Error ? error.message : 'Unexpected server error.'

  logUnhandledRequestError(_request, error, safeStatusCode)
  if (safeStatusCode >= 500) console.error(error)
  return response.status(safeStatusCode).json({ error: message })
})

export { app }