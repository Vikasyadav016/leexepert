import { Router, type RequestHandler } from 'express'
import { withControllerLogging } from '../middleware/execution-logger.middleware'

function notImplemented(moduleName: string, operation: string): RequestHandler {
  return (_request, response) => response.status(501).json({
    error: `${moduleName} ${operation} endpoint is not implemented yet.`,
    module: moduleName,
    operation,
  })
}

export function createModulePlaceholderRouter(moduleName: string): Router {
  const router = Router()
  router.get('/', withControllerLogging(moduleName, 'list', notImplemented(moduleName, 'list')))
  router.post('/', withControllerLogging(moduleName, 'create', notImplemented(moduleName, 'create')))
  router.get('/:id', withControllerLogging(moduleName, 'getById', notImplemented(moduleName, 'getById')))
  router.patch('/:id', withControllerLogging(moduleName, 'update', notImplemented(moduleName, 'update')))
  router.delete('/:id', withControllerLogging(moduleName, 'delete', notImplemented(moduleName, 'delete')))
  return router
}