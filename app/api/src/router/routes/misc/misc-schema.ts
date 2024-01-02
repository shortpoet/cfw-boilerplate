import { z } from 'zod'
import {
  HelloWorldSchema,
  MiscDataSchema,
  MiscDumpSchema,
  SampleDataSchema,
  TodosSchema
} from '#/types'

const HelloWorldResponseComponent = HelloWorldSchema.openapi('HelloWorldResponseComponent')
const MiscDataRequestComponent = MiscDataSchema.openapi('MiscDataRequestComponent')
const MiscDataResponseComponent = MiscDumpSchema.openapi('MiscDataResponseComponent')
const MiscTodosResponseComponent = TodosSchema.openapi('MiscTodosResponseComponent')
const MiscSampleDataResponseComponent = SampleDataSchema.openapi('MiscSampleDataResponseComponent')

export const MiscSampleDataGetSchema = {
  tags: ['Misc'],
  method: 'get',
  path: '/api/json-data',
  description: 'Get sample data',
  summary: 'Sample data test',
  responses: {
    200: {
      description: 'List of sample data',
      content: {
        'application/json': {
          schema: MiscSampleDataResponseComponent
        }
      }
    },
    204: {
      description: 'No content - successful operation'
    },
    500: {
      description: 'Internal Server Error'
    }
  }
}

export const MiscTodosGetSchema = {
  tags: ['Misc'],
  method: 'get',
  path: '/api/todos',
  description: 'Get todos',
  summary: 'Todos test',
  responses: {
    200: {
      description: 'List of todos',
      content: {
        'application/json': {
          schema: z.array(MiscTodosResponseComponent)
        }
      }
    },
    204: {
      description: 'No content - successful operation'
    },
    500: {
      description: 'Internal Server Error'
    }
  }
}

export const MiscHelloGetSchema = {
  tags: ['Misc'],
  method: 'get',
  path: '/api/hello',
  description: 'Hello world',
  summary: 'Test data in and out',
  responses: {
    200: {
      description: 'Object with hello world data',
      content: {
        'application/json': {
          schema: HelloWorldResponseComponent
        }
      }
    },
    204: {
      description: 'No content - successful operation'
    }
  }
}

export const MiscHelloPostSchema = {
  tags: ['Misc'],
  method: 'post',
  path: '/api/hello',
  description: 'Hello world',
  summary: 'Test data in and out',
  // request: {
  //   params: z.object({ id: UserIdSchema })
  // },
  requestBody: {
    content: {
      'application/json': {
        schema: MiscDataRequestComponent
      }
    }
  },
  responses: {
    200: {
      description: 'Object with hello world data',
      content: {
        'application/json': {
          schema: HelloWorldResponseComponent
        }
      }
    },
    204: {
      description: 'No content - successful operation'
    }
  }
}
export const MiscDumpPostSchema = {
  tags: ['Misc'],
  method: 'post',
  path: '/api/misc',
  description: 'Miscellaneous data dump',
  summary: 'Test data in and out',
  // request: {
  //   params: z.object({ id: UserIdSchema })
  // },
  requestBody: {
    content: {
      'application/json': {
        schema: MiscDataRequestComponent
      }
    }
  },
  responses: {
    200: {
      description: 'Object with hello world data',
      content: {
        'application/json': {
          schema: MiscDataResponseComponent
        }
      }
    },
    204: {
      description: 'No content - successful operation'
    }
  }
}
