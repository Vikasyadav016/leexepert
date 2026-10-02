import { app } from './app'
import { env } from './config/env'
import { connectToDatabase, disconnectFromDatabase } from './database/connection'

async function startServer(): Promise<void> {
  await connectToDatabase()

  const server = app.listen(env.port, () => {
    console.info(`Backend listening on port ${env.port}.`)
  })
  

  server.on('error', (error) => {
    console.error('Backend server failed to start:', error.message)
    void disconnectFromDatabase().finally(() => {
      process.exitCode = 1
    })
  })

  let isClosing = false
  const shutdown = () => {
    if (isClosing) return
    isClosing = true

    server.close((error) => {
      if (error) console.error('Error while closing the HTTP server:', error.message)
      void disconnectFromDatabase().finally(() => {
        process.exitCode = error ? 1 : 0
      })
    })
  }

  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}

void startServer().catch(async (error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Backend startup failed.')
  await disconnectFromDatabase().catch(() => undefined)
  process.exitCode = 1
})