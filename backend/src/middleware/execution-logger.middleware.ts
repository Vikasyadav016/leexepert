import { randomUUID } from 'node:crypto'
import { AsyncLocalStorage } from 'node:async_hooks'
import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { ExecutionLog } from '../modules/logs/execution-log.model'

interface ExecutionContext {
  requestId: string
  actorId?: string
  method: string
  path: string
}

interface ExecutionLogInput {
  executionId: string
  requestId?: string
  layer: 'request' | 'controller' | 'service'
  moduleName: string
  operation: string
  outcome: 'started' | 'completed' | 'failed'
  actorId?: string
  method?: string
  path?: string
  statusCode?: number
  startedAt: Date
  finishedAt?: Date
  durationMs?: number
  errorName?: string
  errorMessage?: string
}

const executionContext = new AsyncLocalStorage<ExecutionContext>()

function safeErrorDetails(error: unknown) {
  const errorName = error instanceof Error ? error.name : 'UnknownError'
  let errorMessage = error instanceof Error ? error.message : String(error)

  if (/(password|token|secret|authorization|cookie)/i.test(errorMessage)) {
    errorMessage = '[sensitive error detail redacted]'
  } else {
    errorMessage = errorMessage.replace(/mongodb(?:\+srv)?:\/\/[^@\s]+@/gi, 'mongodb://[redacted]@')
  }

  return { errorName: errorName.slice(0, 120), errorMessage: errorMessage.slice(0, 500) }
}

async function persistLog(input: ExecutionLogInput): Promise<void> {
  try {
    await ExecutionLog.create(input)
  } catch {
    console.error(JSON.stringify({ event: 'execution_log_write_failed', requestId: input.requestId }))
  }
}

async function updateLog(executionId: string, fields: Partial<ExecutionLogInput>): Promise<void> {
  try {
    await ExecutionLog.updateOne({ executionId }, { $set: fields })
  } catch {
    console.error(JSON.stringify({ event: 'execution_log_update_failed', executionId }))
  }
}

function writeConsoleEvent(event: string, input: ExecutionLogInput): void {
  const output = JSON.stringify({
    event,
    requestId: input.requestId,
    executionId: input.executionId,
    layer: input.layer,
    moduleName: input.moduleName,
    operation: input.operation,
    outcome: input.outcome,
    statusCode: input.statusCode,
    durationMs: input.durationMs,
    errorName: input.errorName,
    errorMessage: input.errorMessage,
  })

  if (input.outcome === 'failed') console.error(output)
  else console.info(output)
}

function requestLogContext(req: Request): Pick<ExecutionLogInput, 'requestId' | 'actorId' | 'method' | 'path'> {
  const context = executionContext.getStore()
  return {
    requestId: context?.requestId,
    actorId: context?.actorId,
    method: req.method,
    path: req.path,
  }
}

export function setExecutionActor(actorId: string): void {
  const context = executionContext.getStore()
  if (context) context.actorId = actorId
}

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const suppliedId = req.get('x-request-id')?.trim()
  const requestId = suppliedId && /^[A-Za-z0-9._-]{1,80}$/.test(suppliedId) ? suppliedId : randomUUID()
  const startedAt = new Date()
  const context: ExecutionContext = { requestId, method: req.method, path: req.path }

  res.setHeader('X-Request-Id', requestId)
  res.once('finish', () => {
    const finishedAt = new Date()
    const input: ExecutionLogInput = {
      executionId: randomUUID(),
      requestId,
      layer: 'request',
      moduleName: 'http',
      operation: 'request',
      outcome: res.statusCode >= 500 ? 'failed' : 'completed',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      startedAt,
      finishedAt,
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    }
    if (context.actorId) input.actorId = context.actorId
    writeConsoleEvent('http.request.finished', input)
    void persistLog(input)
  })

  executionContext.run(context, next)
}

export function withControllerLogging(moduleName: string, operation: string, handler: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    const executionId = randomUUID()
    const startedAt = new Date()
    const context = requestLogContext(req)
    const input: ExecutionLogInput = {
      executionId,
      ...context,
      layer: 'controller',
      moduleName,
      operation,
      outcome: 'started',
      startedAt,
    }

    writeConsoleEvent('controller.started', input)
    await persistLog(input)

    const finish = async (error?: unknown) => {
      const finishedAt = new Date()
      const failed = error !== undefined || res.statusCode >= 500
      const errorDetails = error === undefined ? {} : safeErrorDetails(error)
      const result: Partial<ExecutionLogInput> = {
        outcome: failed ? 'failed' : 'completed',
        statusCode: res.statusCode,
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        ...errorDetails,
      }
      await updateLog(executionId, result)
      writeConsoleEvent(failed ? 'controller.failed' : 'controller.completed', { ...input, ...result } as ExecutionLogInput)
    }

    let forwardedError: unknown
    const loggedNext: NextFunction = (error?: unknown) => {
      if (error !== undefined) forwardedError = error
      return next(error)
    }

    try {
      await handler(req, res, loggedNext)
      await finish(forwardedError)
    } catch (error) {
      await finish(error)
      next(error)
    }
  }
}

export function withServiceLogging<Args extends unknown[], Result>(
  moduleName: string,
  operation: string,
  service: (...args: Args) => Result | Promise<Result>,
): (...args: Args) => Promise<Result> {
  return async (...args) => {
    const executionId = randomUUID()
    const startedAt = new Date()
    const context = executionContext.getStore()
    const input: ExecutionLogInput = {
      executionId,
      requestId: context?.requestId,
      actorId: context?.actorId,
      method: context?.method,
      path: context?.path,
      layer: 'service',
      moduleName,
      operation,
      outcome: 'started',
      startedAt,
    }

    writeConsoleEvent('service.started', input)
    await persistLog(input)

    try {
      const result = await service(...args)
      const finishedAt = new Date()
      const completion: Partial<ExecutionLogInput> = {
        outcome: 'completed',
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime(),
      }
      await updateLog(executionId, completion)
      writeConsoleEvent('service.completed', { ...input, ...completion } as ExecutionLogInput)
      return result
    } catch (error) {
      const finishedAt = new Date()
      const failure: Partial<ExecutionLogInput> = {
        outcome: 'failed',
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        ...safeErrorDetails(error),
      }
      await updateLog(executionId, failure)
      writeConsoleEvent('service.failed', { ...input, ...failure } as ExecutionLogInput)
      throw error
    }
  }
}

export function logUnhandledRequestError(req: Request, error: unknown, statusCode: number): void {
  const finishedAt = new Date()
  const context = requestLogContext(req)
  const details = safeErrorDetails(error)
  const input: ExecutionLogInput = {
    executionId: randomUUID(),
    ...context,
    layer: 'request',
    moduleName: 'http',
    operation: 'unhandled-error',
    outcome: 'failed',
    statusCode,
    startedAt: finishedAt,
    finishedAt,
    durationMs: 0,
    ...details,
  }
  writeConsoleEvent('http.request.failed', input)
  void persistLog(input)
}