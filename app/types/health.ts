import { z } from 'zod'
import type { Commit } from 'git-last-commit'
import { ExecutionContext } from '@cloudflare/workers-types'

export const HealthCheckSchema = z.object({
  status: z.string(),
  version: z.string(),
  uptime: z.string(),
  worker_env: z.string(),
  timestamp: z.date(),
  gitInfo: z.custom<Commit>()
})
export type HealthCheck = z.infer<typeof HealthCheckSchema>

export const DebugWorkerSchema = z.object({
  env: z.custom<Env>(),
  req: z.custom<Request>(),
  cf: z.custom<Request['cf']>(),
  ctx: z.custom<ExecutionContext>(),
  rawManifest: z.string()
})
export type DebugWorker = z.infer<typeof DebugWorkerSchema>
