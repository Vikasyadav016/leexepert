import type { Request, Response } from 'express'
import { ExecutionLog, type ExecutionLogRecord } from './execution-log.model'

function readQueryString(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() : undefined
}

function readPositiveInteger(value: unknown, fallback: number, maximum: number): number | undefined {
  if (value === undefined) return fallback
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return undefined

  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= maximum ? parsed : undefined
}

export async function listExecutionLogs(req: Request, res: Response) {
  const page = readPositiveInteger(req.query.page, 1, 1000000)
  const limit = readPositiveInteger(req.query.limit, 50, 100)
  if (page === undefined || limit === undefined) {
    return res.status(400).json({ error: 'Page must be positive and limit must be between 1 and 100.' })
  }

  const query = req.query as Record<string, unknown>
  const filter: {
    moduleName?: string
    requestId?: string
    layer?: ExecutionLogRecord['layer']
    outcome?: ExecutionLogRecord['outcome']
  } = {}
  const moduleName = readQueryString(query.module)
  const requestId = readQueryString(query.requestId)
  const layer = readQueryString(query.layer)
  const outcome = readQueryString(query.outcome)

  if (moduleName) filter.moduleName = moduleName
  if (requestId) filter.requestId = requestId
  if (layer) {
    if (!['request', 'controller', 'service'].includes(layer)) {
      return res.status(400).json({ error: 'Layer must be request, controller, or service.' })
    }
    filter.layer = layer as ExecutionLogRecord['layer']
  }
  if (outcome) {
    if (!['started', 'completed', 'failed'].includes(outcome)) {
      return res.status(400).json({ error: 'Outcome must be started, completed, or failed.' })
    }
    filter.outcome = outcome as ExecutionLogRecord['outcome']
  }

  const [logs, total] = await Promise.all([
    ExecutionLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ExecutionLog.countDocuments(filter),
  ])

  return res.status(200).json({
    data: logs,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}