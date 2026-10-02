import 'dotenv/config'

function readPort(): number {
  const rawPort = process.env.PORT?.trim()
  if (!rawPort) return 5000

  const port = Number(rawPort)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
  }

  return port
}

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const env = Object.freeze({
  port: readPort(),
  mongoUri: process.env.MONGODB_URI?.trim() || 'mongodb://127.0.0.1:27017/leexepert',
  corsOrigins,
  nodeEnv: process.env.NODE_ENV || 'development',
})