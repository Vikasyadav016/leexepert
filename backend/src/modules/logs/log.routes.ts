import { Router } from 'express'
import { authenticate, requireRoles } from '../../middleware/auth.middleware'
import { withControllerLogging } from '../../middleware/execution-logger.middleware'
import { listExecutionLogs } from './log.controller'

const logRouter = Router()

logRouter.get('/', authenticate, requireRoles('admin'), withControllerLogging('logs', 'listExecutionLogs', listExecutionLogs))

export { logRouter }