import mongoose from 'mongoose'
import { env } from '../config/env'

export async function connectToDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      autoIndex: env.nodeEnv !== 'production',
    })
  } catch (error) {
    await mongoose.disconnect()
    throw new Error('Unable to connect to MongoDB. Check MONGODB_URI and confirm the database is reachable.', { cause: error })
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect()
}