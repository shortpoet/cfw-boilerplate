import { DebugWorkerSchema, HealthCheckSchema } from '#/types'
import { Query } from '@cloudflare/itty-router-openapi'
import { ApiErrorResponseComponent } from '../common-oa'

const HealthCheckResponseComponent = HealthCheckSchema.openapi('HealthCheckResponseComponent')
const DebugWorkerResponseComponent = DebugWorkerSchema.openapi('DebugWorkerResponseComponent')

export const HealthGetSchema = {
  tags: ['Health'],
  summary: 'Get health check',
  responses: {
    '200': {
      description: 'Returns health check',
      schema: HealthCheckResponseComponent
    },
    '404': {
      description: 'Health check not found',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal server error',
      schema: ApiErrorResponseComponent
    }
  }
}

export const DebugGetSchema = {
  tags: ['Health'],
  summary: 'Get debug info',
  parameters: {
    parse: Query(Boolean, {
      description: 'Parse KVs - expensive',
      required: false,
      default: false
    })
  },
  responses: {
    '200': {
      description: 'Returns debug info',
      schema: DebugWorkerResponseComponent
    },
    '404': {
      description: 'Debug info not found',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal server error',
      schema: ApiErrorResponseComponent
    }
  }
}
