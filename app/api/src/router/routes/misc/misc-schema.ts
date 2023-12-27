export const GetHelloPostSchema = {
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
        schema: {
          type: 'object',
          properties: {
            hello: { type: 'string' }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Object with hello world data',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              hello: { type: 'string' }
            }
          }
        }
      }
    },
    204: {
      description: 'No content - successful operation'
    }
  }
}
